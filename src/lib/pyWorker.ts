/// <reference lib="webworker" />
/**
 * Python runtime: CPython compiled to WebAssembly (Pyodide), running in a dedicated worker.
 * The browser sandbox isolates user code from the page and from the server; the main thread
 * enforces a wall-clock timeout by terminating this worker.
 */
const PYODIDE = 'https://cdn.jsdelivr.net/pyodide/v0.26.4/full/';

const RUNTIME = String.raw`
import sys, io, json, traceback, types, builtins
from collections import deque

class _SwStop(BaseException):
    pass

def _sw_make_input(stdin, out):
    lines = stdin.split('\n')
    if lines and lines[-1] == '':
        lines.pop()
    pos = [0]
    def _input(prompt=''):
        out.write(str(prompt))
        if pos[0] >= len(lines):
            raise EOFError('EOF when reading a line (add more lines to the input box)')
        v = lines[pos[0]]
        pos[0] += 1
        return v
    return _input

def _sw_format_exc(e):
    tb = e.__traceback__
    while tb is not None and tb.tb_frame.f_code.co_filename != '<main>':
        tb = tb.tb_next
    return ''.join(traceback.format_exception(type(e), e, tb))

def _sw_globals(stdin, out):
    g = {'__name__': '__main__', '__builtins__': builtins}
    g['input'] = _sw_make_input(stdin, out)
    return g

def _sw_run(code, stdin):
    out, err = io.StringIO(), io.StringIO()
    old = sys.stdout, sys.stderr, sys.stdin
    sys.stdout, sys.stderr, sys.stdin = out, err, io.StringIO(stdin)
    status = 'ok'
    try:
        compiled = compile(code, '<main>', 'exec')
    except SyntaxError as e:
        sys.stdout, sys.stderr, sys.stdin = old
        msg = f'  File "main.py", line {e.lineno}\n    {(e.text or "").rstrip()}\n    {" " * max((e.offset or 1) - 1, 0)}^\n{type(e).__name__}: {e.msg}'
        return json.dumps({'status': 'compile_error', 'stdout': '', 'stderr': '', 'compileOutput': msg})
    try:
        exec(compiled, _sw_globals(stdin, out))
    except SystemExit as e:
        if e.code not in (None, 0):
            status = 'runtime_error'
    except RecursionError as e:
        status = 'runtime_error'
        err.write('RecursionError: maximum recursion depth exceeded. Check your base case.\n')
    except BaseException as e:
        status = 'runtime_error'
        err.write(_sw_format_exc(e).replace('"<main>"', '"main.py"'))
    finally:
        sys.stdout, sys.stderr, sys.stdin = old
    return json.dumps({'status': status, 'stdout': out.getvalue(), 'stderr': err.getvalue()})

_SKIP_TYPES = (types.FunctionType, types.BuiltinFunctionType, types.ModuleType, type, types.MethodType)

def _sw_trace(code, stdin, max_steps):
    steps = []
    out = io.StringIO()
    try:
        compiled = compile(code, '<main>', 'exec')
    except SyntaxError as e:
        return json.dumps({'language': 'python', 'steps': [], 'stdout': '', 'error': f'SyntaxError on line {e.lineno}: {e.msg}'})
    g = _sw_globals(stdin, out)
    MAX_ITEMS, MAX_HEAP = 60, 300

    def enc(v, heap):
        if v is None: return {'t': 'none'}
        if isinstance(v, bool): return {'t': 'bool', 'v': v}
        if isinstance(v, int): return {'t': 'int', 'v': v if abs(v) < 2**53 else str(v)}
        if isinstance(v, float):
            return {'t': 'float', 'v': v if v == v and v not in (float('inf'), float('-inf')) else str(v)}
        if isinstance(v, str): return {'t': 'str', 'v': v if len(v) < 500 else v[:500] + '…'}
        if isinstance(v, _SKIP_TYPES): return {'t': 'other', 'v': getattr(v, '__name__', type(v).__name__)}
        key = str(id(v))
        if key in heap: return {'t': 'ref', 'v': key}
        if len(heap) >= MAX_HEAP: return {'t': 'other', 'v': type(v).__name__}
        heap[key] = None
        tn = type(v).__name__
        if isinstance(v, (list, tuple, deque)):
            kind = 'list' if isinstance(v, list) else ('tuple' if isinstance(v, tuple) else 'deque')
            items = [enc(x, heap) for x in list(v)[:MAX_ITEMS]]
            o = {'kind': kind, 'type': tn, 'items': items}
            if len(v) > MAX_ITEMS: o['more'] = len(v) - MAX_ITEMS
        elif isinstance(v, (set, frozenset)):
            try: srt = sorted(v)
            except Exception: srt = list(v)
            o = {'kind': 'set', 'type': tn, 'items': [enc(x, heap) for x in srt[:MAX_ITEMS]]}
        elif isinstance(v, dict):
            o = {'kind': 'dict', 'type': tn, 'entries': [[enc(k, heap), enc(x, heap)] for k, x in list(v.items())[:MAX_ITEMS]]}
        elif hasattr(v, '__dict__') and type(v).__module__ == '__main__':
            o = {'kind': 'object', 'type': tn, 'fields': [[k, enc(x, heap)] for k, x in vars(v).items() if not k.startswith('__')]}
        else:
            heap.pop(key)
            r = repr(v)
            return {'t': 'other', 'v': r if len(r) < 80 else tn}
        heap[key] = o
        return {'t': 'ref', 'v': key}

    def frame_vars(fr, heap, is_module):
        res = []
        for k, v in list(fr.f_locals.items()):
            if k.startswith('__') or k == 'input': continue
            if is_module and isinstance(v, _SKIP_TYPES): continue
            if isinstance(v, (types.ModuleType,)): continue
            res.append([k, enc(v, heap)])
        return res

    def snap(frame, event, arg):
        chain = []
        f = frame
        while f is not None:
            if f.f_code.co_filename == '<main>': chain.append(f)
            f = f.f_back
        chain.reverse()
        heap = {}
        stack = []
        for i, fr in enumerate(chain):
            is_mod = fr.f_code.co_name == '<module>'
            stack.append({'id': i, 'name': 'Global' if is_mod else fr.f_code.co_name, 'line': fr.f_lineno, 'vars': frame_vars(fr, heap, is_mod)})
        st = {'line': frame.f_lineno, 'event': event, 'func': frame.f_code.co_name, 'stack': stack, 'heap': heap, 'stdout': out.getvalue()}
        if event == 'return': st['returned'] = enc(arg, heap)
        if event == 'exception': st['exception'] = f'{arg[0].__name__}: {arg[1]}'
        return st

    state = {'stopped': False}
    def tracer(frame, event, arg):
        if state['stopped'] or frame.f_code.co_filename != '<main>':
            return None
        if frame.f_code.co_name in ('<listcomp>', '<dictcomp>', '<setcomp>', '<genexpr>') and event != 'line':
            return tracer
        if frame.f_code.co_name == '<module>' and event in ('call', 'return'):
            return tracer
        if len(steps) >= max_steps:
            state['stopped'] = True
            raise _SwStop()
        steps.append(snap(frame, event, arg))
        return tracer

    old = sys.stdout, sys.stdin
    sys.stdout, sys.stdin = out, io.StringIO(stdin)
    error = None
    try:
        sys.settrace(tracer)
        exec(compiled, g)
    except _SwStop:
        pass
    except SystemExit:
        pass
    except BaseException as e:
        error = f'{type(e).__name__}: {e}'
    finally:
        sys.settrace(None)
        sys.stdout, sys.stdin = old
    # Merge 'call' events into the following first line so the step list reads naturally.
    return json.dumps({'language': 'python', 'steps': steps, 'stdout': out.getvalue(), 'truncated': state['stopped'], 'error': error})
`;

let pyodide: any = null;
let loading: Promise<any> | null = null;

async function boot() {
  if (pyodide) return pyodide;
  if (!loading) {
    loading = (async () => {
      const mod = await import(/* @vite-ignore */ `${PYODIDE}pyodide.mjs`);
      const py = await mod.loadPyodide({ indexURL: PYODIDE });
      py.setStdout({ batched: () => {} });
      py.setStderr({ batched: () => {} });
      py.runPython(RUNTIME);
      py.runPython('import sys; sys.setrecursionlimit(1500)');
      pyodide = py;
      return py;
    })();
  }
  return loading;
}

self.onmessage = async (e: MessageEvent) => {
  const { id, type, code, stdin, maxSteps } = e.data;
  try {
    const py = await boot();
    if (type === 'warm') return self.postMessage({ id, ok: true, result: null });
    py.globals.set('_sw_code', code);
    py.globals.set('_sw_stdin', stdin || '');
    const out =
      type === 'trace'
        ? py.runPython(`_sw_trace(_sw_code, _sw_stdin, ${Number(maxSteps) || 1500})`)
        : py.runPython('_sw_run(_sw_code, _sw_stdin)');
    self.postMessage({ id, ok: true, result: JSON.parse(out) });
  } catch (err: any) {
    self.postMessage({ id, ok: false, error: String(err?.message || err) });
  }
};
