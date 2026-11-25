import com.sun.jdi.*;
import com.sun.jdi.connect.*;
import com.sun.jdi.event.*;
import com.sun.jdi.request.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.*;

/**
 * Step-by-step execution tracer for Java programs, built on the Java Debug Interface.
 * Usage: java Tracer <MainClass> <maxSteps> <stdinFile> <debuggee JVM options>
 * Prints a single JSON line in the same trace format the Python tracer produces.
 */
public class Tracer {
    static final String[] EXCLUDE = {"java.*", "javax.*", "sun.*", "jdk.*", "com.sun.*"};
    static final int MAX_ITEMS = 60;
    static final int MAX_HEAP = 400;

    static InputStream dOut, dErr;
    static final ByteArrayOutputStream stdout = new ByteArrayOutputStream();
    static final ByteArrayOutputStream stderr = new ByteArrayOutputStream();
    static final StringBuilder steps = new StringBuilder();
    static int stepCount = 0;
    static int maxSteps;
    static int lastDepth = 0;
    static boolean truncated = false;
    static String mainClass;

    public static void main(String[] args) throws Exception {
        mainClass = args[0];
        maxSteps = Integer.parseInt(args[1]);
        byte[] input = Files.readAllBytes(Paths.get(args[2]));
        String opts = args.length > 3 ? args[3] : "";

        LaunchingConnector lc = Bootstrap.virtualMachineManager().defaultConnector();
        Map<String, Connector.Argument> ca = lc.defaultArguments();
        ca.get("main").setValue(mainClass);
        ca.get("options").setValue(opts);
        VirtualMachine vm = lc.launch(ca);
        Process proc = vm.process();
        dOut = proc.getInputStream();
        dErr = proc.getErrorStream();
        Thread feeder = new Thread(() -> {
            try (OutputStream os = proc.getOutputStream()) { os.write(input); } catch (IOException ignored) {}
        });
        feeder.setDaemon(true);
        feeder.start();

        EventRequestManager erm = vm.eventRequestManager();
        ClassPrepareRequest cpr = erm.createClassPrepareRequest();
        cpr.addClassFilter(mainClass);
        cpr.enable();

        String error = null;
        EventQueue queue = vm.eventQueue();
        boolean running = true;
        try {
            while (running) {
                EventSet set = queue.remove();
                for (Event ev : set) {
                    if (ev instanceof ClassPrepareEvent) {
                        ReferenceType rt = ((ClassPrepareEvent) ev).referenceType();
                        List<Method> mains = rt.methodsByName("main");
                        if (mains.isEmpty()) { error = "No main method found in " + mainClass; }
                        else {
                            BreakpointRequest br = erm.createBreakpointRequest(mains.get(0).location());
                            br.enable();
                        }
                    } else if (ev instanceof BreakpointEvent) {
                        ThreadReference t = ((BreakpointEvent) ev).thread();
                        StepRequest sr = erm.createStepRequest(t, StepRequest.STEP_LINE, StepRequest.STEP_INTO);
                        for (String ex : EXCLUDE) sr.addClassExclusionFilter(ex);
                        sr.enable();
                        MethodExitRequest mx = erm.createMethodExitRequest();
                        for (String ex : EXCLUDE) mx.addClassExclusionFilter(ex);
                        mx.addThreadFilter(t);
                        mx.enable();
                        ExceptionRequest exr = erm.createExceptionRequest(null, false, true);
                        exr.enable();
                        record(t, ((BreakpointEvent) ev).location(), "line", null, null);
                    } else if (ev instanceof StepEvent) {
                        StepEvent se = (StepEvent) ev;
                        record(se.thread(), se.location(), "line", null, null);
                    } else if (ev instanceof MethodExitEvent) {
                        MethodExitEvent me = (MethodExitEvent) ev;
                        String name = me.method().name();
                        if (!name.equals("<clinit>") && !(name.equals("main") && me.method().declaringType().name().equals(mainClass))) {
                            Value rv = name.equals("<init>") ? null : me.returnValue();
                            boolean isVoid = rv == null || rv instanceof VoidValue;
                            record(me.thread(), me.location(), "return", isVoid ? null : rv, null);
                        }
                    } else if (ev instanceof ExceptionEvent) {
                        ExceptionEvent ee = (ExceptionEvent) ev;
                        String msg = ee.exception().referenceType().name();
                        try {
                            Value m = ee.exception().getValue(findField(ee.exception().referenceType(), "detailMessage"));
                            if (m instanceof StringReference) msg += ": " + ((StringReference) m).value();
                        } catch (Exception ignored) {}
                        if (ee.location() != null && !isExcluded(ee.location().declaringType().name()))
                            record(ee.thread(), ee.location(), "exception", null, msg);
                    } else if (ev instanceof VMDeathEvent || ev instanceof VMDisconnectEvent) {
                        running = false;
                    }
                    if (stepCount >= maxSteps) {
                        truncated = true;
                        running = false;
                    }
                }
                if (running) set.resume();
            }
        } catch (VMDisconnectedException ignored) {
        } catch (Exception e) {
            error = "Tracer error: " + e;
        }
        if (truncated) {
            try { vm.exit(0); } catch (Exception ignored) {}
        }
        drain(true);
        try { proc.waitFor(); } catch (Exception ignored) {}
        drain(true);

        StringBuilder sb = new StringBuilder();
        sb.append("{\"language\":\"java\",\"steps\":[").append(steps).append("],\"stdout\":")
          .append(q(stdout.toString(StandardCharsets.UTF_8))).append(",\"stderr\":").append(q(stderr.toString(StandardCharsets.UTF_8)))
          .append(",\"truncated\":").append(truncated);
        if (error != null) sb.append(",\"error\":").append(q(error));
        sb.append("}");
        PrintStream ps = new PrintStream(new FileOutputStream(FileDescriptor.out), true, "UTF-8");
        ps.println(sb);
    }

    static boolean isExcluded(String cls) {
        return cls.startsWith("java.") || cls.startsWith("javax.") || cls.startsWith("sun.") || cls.startsWith("jdk.") || cls.startsWith("com.sun.");
    }

    static void drain(boolean all) {
        try {
            byte[] buf = new byte[8192];
            while (dOut.available() > 0) { int n = dOut.read(buf); if (n <= 0) break; stdout.write(buf, 0, n); }
            while (dErr.available() > 0) { int n = dErr.read(buf); if (n <= 0) break; stderr.write(buf, 0, n); }
        } catch (IOException ignored) {}
    }

    // ---------- state capture ----------
    static Map<Long, String> heap;
    static int heapCount;

    static void record(ThreadReference t, Location loc, String event, Value ret, String exception) {
        if (stepCount >= maxSteps) return;
        drain(false);
        heap = new LinkedHashMap<>();
        heapCount = 0;
        StringBuilder stack = new StringBuilder();
        int depth = 0;
        try {
            List<StackFrame> frames = t.frames();
            boolean first = true;
            for (int i = frames.size() - 1; i >= 0; i--) {
                StackFrame f = frames.get(i);
                Location fl = f.location();
                String cls = fl.declaringType().name();
                if (isExcluded(cls)) continue;
                depth++;
                if (!first) stack.append(',');
                first = false;
                Method m = fl.method();
                String fname = m.name().equals("<init>") ? simple(cls) + " (constructor)" : (cls.equals(mainClass) ? m.name() : simple(cls) + "." + m.name());
                stack.append("{\"id\":").append(i).append(",\"name\":").append(q(fname)).append(",\"line\":").append(fl.lineNumber()).append(",\"vars\":[");
                boolean fv = true;
                ObjectReference self = f.thisObject();
                if (self != null) {
                    stack.append("[\"this\",").append(val(self)).append(']');
                    fv = false;
                }
                try {
                    for (LocalVariable lv : f.visibleVariables()) {
                        if (lv.name().equals("args") && m.name().equals("main")) continue;
                        if (!fv) stack.append(',');
                        fv = false;
                        stack.append('[').append(q(lv.name())).append(',').append(val(f.getValue(lv))).append(']');
                    }
                } catch (AbsentInformationException ignored) {}
                stack.append("]}");
            }
        } catch (IncompatibleThreadStateException e) {
            return;
        }
        String ev = event;
        if (event.equals("line") && depth > lastDepth && stepCount > 0) ev = "call";
        lastDepth = depth;

        if (stepCount > 0) steps.append(',');
        stepCount++;
        String func = loc.method().name();
        steps.append("{\"line\":").append(loc.lineNumber()).append(",\"event\":").append(q(ev)).append(",\"func\":").append(q(func))
             .append(",\"stack\":[").append(stack).append("],\"heap\":{");
        boolean fh = true;
        for (Map.Entry<Long, String> e : heap.entrySet()) {
            if (!fh) steps.append(',');
            fh = false;
            steps.append('"').append(e.getKey()).append("\":").append(e.getValue());
        }
        steps.append("},\"stdout\":").append(q(stdout.toString(StandardCharsets.UTF_8)));
        if (ret != null) steps.append(",\"returned\":").append(val(ret));
        if (exception != null) steps.append(",\"exception\":").append(q(exception));
        steps.append('}');
    }

    static String simple(String cls) {
        int i = Math.max(cls.lastIndexOf('.'), cls.lastIndexOf('$'));
        return i >= 0 ? cls.substring(i + 1) : cls;
    }

    static Field findField(ReferenceType t, String name) {
        Field f = t.fieldByName(name);
        if (f != null) return f;
        if (t instanceof ClassType) {
            ClassType sup = ((ClassType) t).superclass();
            if (sup != null) return findField(sup, name);
        }
        return null;
    }

    static Value get(ObjectReference o, String name) {
        Field f = findField(o.referenceType(), name);
        return f == null ? null : o.getValue(f);
    }

    static int intOf(Value v) {
        return v instanceof PrimitiveValue ? ((PrimitiveValue) v).intValue() : 0;
    }

    static String val(Value v) {
        if (v == null) return "{\"t\":\"none\"}";
        if (v instanceof BooleanValue) return "{\"t\":\"bool\",\"v\":" + ((BooleanValue) v).value() + "}";
        if (v instanceof CharValue) return "{\"t\":\"char\",\"v\":" + q(String.valueOf(((CharValue) v).value())) + "}";
        if (v instanceof DoubleValue || v instanceof FloatValue) {
            double d = ((PrimitiveValue) v).doubleValue();
            return "{\"t\":\"float\",\"v\":" + (Double.isFinite(d) ? String.valueOf(d) : q(String.valueOf(d))) + "}";
        }
        if (v instanceof PrimitiveValue) return "{\"t\":\"int\",\"v\":" + ((PrimitiveValue) v).longValue() + "}";
        if (v instanceof StringReference) return "{\"t\":\"str\",\"v\":" + q(((StringReference) v).value()) + "}";
        ObjectReference o = (ObjectReference) v;
        String tn = o.referenceType().name();
        switch (tn) {
            case "java.lang.Integer": case "java.lang.Long": case "java.lang.Short": case "java.lang.Byte":
            case "java.lang.Double": case "java.lang.Float": case "java.lang.Boolean": case "java.lang.Character":
                return val(get(o, "value"));
            case "java.lang.StringBuilder": case "java.lang.StringBuffer":
                return "{\"t\":\"str\",\"v\":" + q(sbString(o)) + ",\"type\":\"StringBuilder\"}";
        }
        long id = o.uniqueID();
        if (!heap.containsKey(id)) {
            if (heapCount >= MAX_HEAP) return "{\"t\":\"other\",\"v\":" + q(simple(tn)) + "}";
            heapCount++;
            heap.put(id, "null");
            heap.put(id, heapObj(o, tn));
        }
        return "{\"t\":\"ref\",\"v\":\"" + id + "\"}";
    }

    static String sbString(ObjectReference o) {
        try {
            Value val = get(o, "value");
            int count = intOf(get(o, "count"));
            int coder = intOf(get(o, "coder"));
            if (val instanceof ArrayReference) {
                List<Value> vs = ((ArrayReference) val).getValues();
                if (vs.isEmpty()) return "";
                if (vs.get(0) instanceof CharValue) {
                    StringBuilder s = new StringBuilder();
                    for (int i = 0; i < count; i++) s.append(((CharValue) vs.get(i)).value());
                    return s.toString();
                }
                byte[] b = new byte[coder == 0 ? count : count * 2];
                for (int i = 0; i < b.length && i < vs.size(); i++) b[i] = ((ByteValue) vs.get(i)).value();
                return new String(b, coder == 0 ? StandardCharsets.ISO_8859_1 : StandardCharsets.UTF_16LE);
            }
        } catch (Exception ignored) {}
        return "";
    }

    static String items(List<String> vals, String kind, String type) {
        StringBuilder s = new StringBuilder("{\"kind\":\"").append(kind).append("\",\"type\":").append(q(type)).append(",\"items\":[");
        for (int i = 0; i < vals.size(); i++) { if (i > 0) s.append(','); s.append(vals.get(i)); }
        return s.append("]}").toString();
    }

    static String heapObj(ObjectReference o, String tn) {
        if (o instanceof ArrayReference) {
            ArrayReference a = (ArrayReference) o;
            List<String> vals = new ArrayList<>();
            int n = Math.min(a.length(), MAX_ITEMS);
            for (Value x : a.getValues(0, n)) vals.add(val(x));
            String s = items(vals, "array", simple(tn));
            return a.length() > n ? s.substring(0, s.length() - 1) + ",\"more\":" + (a.length() - n) + "}" : s;
        }
        try {
            switch (tn) {
                case "java.util.ArrayList": case "java.util.Vector": case "java.util.Stack": {
                    ArrayReference data = (ArrayReference) get(o, "elementData");
                    int size = intOf(get(o, tn.equals("java.util.ArrayList") ? "size" : "elementCount"));
                    List<String> vals = new ArrayList<>();
                    for (int i = 0; i < Math.min(size, MAX_ITEMS); i++) vals.add(val(data.getValue(i)));
                    return items(vals, tn.endsWith("Stack") ? "stack" : "list", simple(tn));
                }
                case "java.util.LinkedList": {
                    List<String> vals = new ArrayList<>();
                    Value node = get(o, "first");
                    while (node instanceof ObjectReference && vals.size() < MAX_ITEMS) {
                        vals.add(val(get((ObjectReference) node, "item")));
                        node = get((ObjectReference) node, "next");
                    }
                    return items(vals, "list", "LinkedList");
                }
                case "java.util.ArrayDeque": {
                    ArrayReference el = (ArrayReference) get(o, "elements");
                    int head = intOf(get(o, "head")), tail = intOf(get(o, "tail")), cap = el.length();
                    List<String> vals = new ArrayList<>();
                    for (int i = head; i != tail && vals.size() < MAX_ITEMS; i = (i + 1) % cap) vals.add(val(el.getValue(i)));
                    return items(vals, "deque", "ArrayDeque");
                }
                case "java.util.PriorityQueue": {
                    ArrayReference qa = (ArrayReference) get(o, "queue");
                    int size = intOf(get(o, "size"));
                    List<String> vals = new ArrayList<>();
                    for (int i = 0; i < Math.min(size, MAX_ITEMS); i++) vals.add(val(qa.getValue(i)));
                    return items(vals, "heap", "PriorityQueue");
                }
                case "java.util.HashMap": case "java.util.LinkedHashMap": case "java.util.TreeMap":
                    return mapObj(o, tn, false);
                case "java.util.HashSet": case "java.util.LinkedHashSet": {
                    return mapObj((ObjectReference) get(o, "map"), ((ObjectReference) get(o, "map")).referenceType().name(), true, simple(tn));
                }
                case "java.util.TreeSet": {
                    ObjectReference m = (ObjectReference) get(o, "m");
                    return mapObj(m, m.referenceType().name(), true, "TreeSet");
                }
            }
        } catch (Exception ignored) {}
        if (isExcluded(tn)) return "{\"kind\":\"object\",\"type\":" + q(simple(tn)) + ",\"fields\":[]}";
        StringBuilder s = new StringBuilder("{\"kind\":\"object\",\"type\":").append(q(simple(tn))).append(",\"fields\":[");
        boolean first = true;
        for (Field f : o.referenceType().allFields()) {
            if (f.isStatic() || f.name().startsWith("this$")) continue;
            if (!first) s.append(',');
            first = false;
            s.append('[').append(q(f.name())).append(',').append(val(o.getValue(f))).append(']');
        }
        return s.append("]}").toString();
    }

    static String mapObj(ObjectReference m, String tn, boolean asSet) { return mapObj(m, tn, asSet, simple(tn)); }

    static String mapObj(ObjectReference m, String tn, boolean asSet, String label) {
        List<String[]> entries = new ArrayList<>();
        if (tn.equals("java.util.TreeMap")) {
            Deque<ObjectReference> st = new ArrayDeque<>();
            Value cur = get(m, "root");
            while ((cur instanceof ObjectReference || !st.isEmpty()) && entries.size() < MAX_ITEMS) {
                while (cur instanceof ObjectReference) { st.push((ObjectReference) cur); cur = get((ObjectReference) cur, "left"); }
                ObjectReference n = st.pop();
                entries.add(new String[]{val(get(n, "key")), asSet ? null : val(get(n, "value"))});
                cur = get(n, "right");
            }
        } else if (tn.equals("java.util.LinkedHashMap")) {
            Value n = get(m, "head");
            while (n instanceof ObjectReference && entries.size() < MAX_ITEMS) {
                ObjectReference e = (ObjectReference) n;
                entries.add(new String[]{val(get(e, "key")), asSet ? null : val(get(e, "value"))});
                n = get(e, "after");
            }
        } else {
            Value table = get(m, "table");
            if (table instanceof ArrayReference) {
                for (Value b : ((ArrayReference) table).getValues()) {
                    Value n = b;
                    while (n instanceof ObjectReference && entries.size() < MAX_ITEMS) {
                        ObjectReference e = (ObjectReference) n;
                        if (e.referenceType().name().endsWith("TreeNode")) { /* treeified bin: still linked via next */ }
                        entries.add(new String[]{val(get(e, "key")), asSet ? null : val(get(e, "value"))});
                        n = get(e, "next");
                    }
                }
            }
        }
        StringBuilder s = new StringBuilder("{\"kind\":\"").append(asSet ? "set" : "dict").append("\",\"type\":").append(q(label));
        if (asSet) {
            s.append(",\"items\":[");
            for (int i = 0; i < entries.size(); i++) { if (i > 0) s.append(','); s.append(entries.get(i)[0]); }
        } else {
            s.append(",\"entries\":[");
            for (int i = 0; i < entries.size(); i++) { if (i > 0) s.append(','); s.append('[').append(entries.get(i)[0]).append(',').append(entries.get(i)[1]).append(']'); }
        }
        return s.append("]}").toString();
    }

    static String q(String s) {
        StringBuilder b = new StringBuilder("\"");
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            switch (c) {
                case '"': b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n"); break;
                case '\r': b.append("\\r"); break;
                case '\t': b.append("\\t"); break;
                default:
                    if (c < 0x20) b.append(String.format("\\u%04x", (int) c));
                    else b.append(c);
            }
        }
        return b.append('"').toString();
    }
}
