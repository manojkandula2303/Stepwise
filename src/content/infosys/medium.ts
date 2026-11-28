import type { InfosysProblem } from './types';
import { lines, reader } from './rng';

const javaHead = `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        StringTokenizer st = new StringTokenizer(new String(System.in.readAllBytes()));`;

export const MEDIUM: InfosysProblem[] = [
  {
    id: 'inf-m-subarray-sum',
    level: 'medium',
    title: 'Balanced Ledger Segments',
    topics: ['prefix', 'hash-adv'],
    sample: true,
    statement: `An accountant records **N** daily balance changes **A[0..N−1]** (positive for income, negative for expenses). A *segment* is a contiguous block of days. She wants to know how many segments have a total change of exactly **K**.

Count the segments (subarrays) whose sum equals K.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].\nThe last line contains an integer, K.',
    outputFormat: 'Print the number of subarrays with sum K.',
    constraints: ['1 ≤ N ≤ 10⁵', '−10⁴ ≤ A[i] ≤ 10⁴', '−10⁹ ≤ K ≤ 10⁹'],
    pattern: {
      name: 'Prefix sum + hash map',
      recognize: 'Count subarrays with a target sum when values can be negative (so a sliding window does not work).',
      approach: [
        'Let P be the running prefix sum. A subarray (j, i] has sum K exactly when P_i − P_j = K.',
        'Keep a map count[prefix value] of prefixes seen so far, starting with count[0] = 1.',
        'At each position add count[P − K] to the answer, then increment count[P].',
      ],
      time: 'O(N)',
      space: 'O(N)',
      pitfalls: 'Forgetting count[0] = 1 misses subarrays that start at index 0. The answer can exceed 2³¹ − 1.',
    },
    walkthrough: 'A = [1, 2, 3], K = 3: prefixes 0, 1, 3, 6. At prefix 3 we look up 3 − 3 = 0 (seen once) → [1, 2]; at prefix 6 we look up 3 (seen once) → [3]. Answer 2.',
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(5, 7);
        const a = r.array(n, -3, 5);
        return lines(n, a, r.int(1, 6));
      }
      if (k === 'edge') return r.pick([lines(1, 5, 5), lines(1, 5, 3), lines(5, [0, 0, 0, 0, 0], 0), lines(4, [-1, 1, -1, 1], 0)]);
      const n = k === 'large' ? 30000 : r.int(10, 400);
      const a = r.array(n, k === 'large' ? -3 : -10, k === 'large' ? 3 : 10);
      const i = r.int(0, n - 1);
      const j = r.int(i, Math.min(n - 1, i + 20));
      return lines(n, a, a.slice(i, j + 1).reduce((s, x) => s + x, 0));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n);
      const K = rd.num();
      const cnt = new Map<number, number>([[0, 1]]);
      let p = 0;
      let ans = 0;
      for (const x of a) {
        p += x;
        ans += cnt.get(p - K) || 0;
        cnt.set(p, (cnt.get(p) || 0) + 1);
      }
      return String(ans);
    },
    solutions: {
      python: `import sys
from collections import defaultdict

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
k = int(data[1 + n])
count = defaultdict(int)
count[0] = 1
prefix = answer = 0
for x in a:
    prefix += x
    answer += count[prefix - k]
    count[prefix] += 1
print(answer)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long[] a = new long[n];
        for (int i = 0; i < n; i++) a[i] = Long.parseLong(st.nextToken());
        long k = Long.parseLong(st.nextToken());
        HashMap<Long, Integer> count = new HashMap<>();
        count.put(0L, 1);
        long prefix = 0, answer = 0;
        for (long x : a) {
            prefix += x;
            answer += count.getOrDefault(prefix - k, 0);
            count.merge(prefix, 1, Integer::sum);
        }
        System.out.println(answer);
    }
}
`,
    },
  },
  {
    id: 'inf-m-unique-window',
    level: 'medium',
    title: 'Longest Unique Password Segment',
    topics: ['window', 'hash-adv'],
    statement: `A security audit examines a long password **S** made of lowercase letters. It looks for the **longest contiguous segment in which no character repeats**.

Print the length of that segment.`,
    inputFormat: 'The first line contains a string, S.',
    outputFormat: 'Print the length of the longest substring without repeating characters.',
    constraints: ['1 ≤ |S| ≤ 2 × 10⁵', 'S contains only lowercase English letters'],
    pattern: {
      name: 'Variable sliding window',
      recognize: '"Longest substring / subarray such that …" where the condition breaks only when something repeats.',
      approach: ['Keep a window [left, right] with no repeats and the last index of each character.', "When S[right] was last seen inside the window, move left to one past that index.", 'The answer is the largest window length right − left + 1.'],
      time: 'O(|S|)',
      space: 'O(1) (26 letters)',
      pitfalls: 'Never move left backwards: use left = max(left, last[c] + 1).',
    },
    gen: (r, k) => {
      if (k === 'public') return lines(r.str(r.int(6, 10), 'abcde'));
      if (k === 'edge') return r.pick([lines('a'), lines('aaaaaa'), lines('abcdefghijklmnopqrstuvwxyz'), lines('abba')]);
      return lines(r.str(k === 'large' ? 200000 : r.int(10, 400), r.pick(['abc', 'abcdefgh', 'abcdefghijklmnopqrstuvwxyz'])));
    },
    solve: (inp) => {
      const s = inp.trim();
      const last = new Map<string, number>();
      let left = 0;
      let best = 0;
      for (let i = 0; i < s.length; i++) {
        const c = s[i];
        if (last.has(c) && last.get(c)! >= left) left = last.get(c)! + 1;
        last.set(c, i);
        best = Math.max(best, i - left + 1);
      }
      return String(best);
    },
    solutions: {
      python: `s = input().strip()
last = {}
left = best = 0
for right, c in enumerate(s):
    if c in last and last[c] >= left:
        left = last[c] + 1
    last[c] = right
    best = max(best, right - left + 1)
print(best)
`,
      java: `${javaHead}
        String s = st.nextToken();
        int[] last = new int[26];
        Arrays.fill(last, -1);
        int left = 0, best = 0;
        for (int right = 0; right < s.length(); right++) {
            int c = s.charAt(right) - 'a';
            if (last[c] >= left) left = last[c] + 1;
            last[c] = right;
            best = Math.max(best, right - left + 1);
        }
        System.out.println(best);
    }
}
`,
    },
  },
  {
    id: 'inf-m-platforms',
    level: 'medium',
    title: 'Railway Platforms',
    topics: ['two-pointers', 'intervals'],
    sample: true,
    statement: `A junction station receives **N** trains a day. Train i arrives at minute **A[i]** and departs at minute **D[i]** (A[i] ≤ D[i]). A platform can hold only one train at a time, and a train occupies its platform for the **whole closed interval [A[i], D[i]]**: if one train departs at the same minute another arrives, they need **different** platforms.

Find the minimum number of platforms the station needs.`,
    inputFormat: 'The first line contains an integer, N.\nEach of the next N lines contains an integer A[i] (arrival times).\nEach of the next N lines contains an integer D[i] (departure times, in the same train order).',
    outputFormat: 'Print the minimum number of platforms.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ A[i] ≤ D[i] ≤ 10⁹'],
    pattern: {
      name: 'Sort events + two-pointer sweep',
      recognize: '"Maximum number of overlapping intervals at any moment".',
      approach: ['Sort arrivals and departures separately.', 'Walk both lists: if the next arrival ≤ next departure, a platform is taken (count += 1); otherwise one is freed (count −= 1).', 'The answer is the maximum count reached.'],
      time: 'O(N log N)',
      space: 'O(N)',
      pitfalls: 'Using < instead of ≤ treats an arrival at the same minute as a departure as non-overlapping, which contradicts this statement.',
    },
    walkthrough: 'Arrivals [900, 940, 950], departures [910, 1200, 1120]: at 950 trains 2 and 3 are both present, so 2 platforms are needed.',
    gen: (r, k) => {
      const make = (n: number, span: number, maxStay: number) => {
        const a = r.array(n, 0, span);
        const d = a.map((x) => x + r.int(0, maxStay));
        return lines(n, a, d);
      };
      if (k === 'public') return make(r.int(4, 6), 100, 40);
      if (k === 'edge') return r.pick([lines(1, 5, 5), lines(2, [10, 20], [20, 30]), lines(3, [0, 0, 0], [1000000000, 1000000000, 1000000000])]);
      if (k === 'large') return make(20000, 1000000000, 100000000);
      return make(r.int(10, 400), 2000, r.int(10, 400));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n).sort((x, y) => x - y);
      const d = rd.nums(n).sort((x, y) => x - y);
      let i = 0;
      let j = 0;
      let cur = 0;
      let best = 0;
      while (i < n) {
        if (a[i] <= d[j]) {
          cur++;
          i++;
          best = Math.max(best, cur);
        } else {
          cur--;
          j++;
        }
      }
      return String(best);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
arr = sorted(map(int, data[1:1 + n]))
dep = sorted(map(int, data[1 + n:1 + 2 * n]))
i = j = cur = best = 0
while i < n:
    if arr[i] <= dep[j]:
        cur += 1
        i += 1
        best = max(best, cur)
    else:
        cur -= 1
        j += 1
print(best)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long[] arr = new long[n], dep = new long[n];
        for (int i = 0; i < n; i++) arr[i] = Long.parseLong(st.nextToken());
        for (int i = 0; i < n; i++) dep[i] = Long.parseLong(st.nextToken());
        Arrays.sort(arr);
        Arrays.sort(dep);
        int i = 0, j = 0, cur = 0, best = 0;
        while (i < n) {
            if (arr[i] <= dep[j]) { cur++; i++; best = Math.max(best, cur); }
            else { cur--; j++; }
        }
        System.out.println(best);
    }
}
`,
    },
  },
  {
    id: 'inf-m-next-greater',
    level: 'medium',
    title: 'Next Taller Building Sum',
    topics: ['stack'],
    statement: `A skyline has **N** buildings with heights **H[0..N−1]** from left to right. For every building i, its *next taller building* is the first building to its right that is **strictly taller**. If there is none, building i contributes **0**.

Print the sum, over all buildings, of the height of their next taller building.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing H[i].',
    outputFormat: 'Print the required sum.',
    constraints: ['1 ≤ N ≤ 10⁵', '1 ≤ H[i] ≤ 10⁹'],
    pattern: {
      name: 'Monotonic stack',
      recognize: '"Next greater / smaller element to the right / left" for every position.',
      approach: ['Scan from left to right with a stack of indices whose next taller building is still unknown (heights decreasing).', 'While the current height is taller than the height at the stack top, that building found its answer: add H[i] and pop.', 'Push i. Buildings left on the stack contribute 0.'],
      time: 'O(N): each index is pushed and popped at most once',
      space: 'O(N)',
      pitfalls: 'Checking every pair is O(N²). The sum can reach 10¹⁴: use 64-bit.',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(5, 7);
        return lines(n, r.array(n, 1, 9));
      }
      if (k === 'edge') return r.pick([lines(1, 3), lines(4, [5, 5, 5, 5]), lines(4, [4, 3, 2, 1]), lines(4, [1, 2, 3, 4])]);
      const n = k === 'large' ? 30000 : r.int(10, 400);
      const a = r.array(n, 1, k === 'large' ? 1000000000 : 100);
      if (k === 'large' && r.chance(0.4)) a.sort((x, y) => y - x);
      return lines(n, a);
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const h = rd.nums(n);
      const stack: number[] = [];
      let sum = 0;
      for (let i = 0; i < n; i++) {
        while (stack.length && h[stack[stack.length - 1]] < h[i]) {
          stack.pop();
          sum += h[i];
        }
        stack.push(i);
      }
      return String(sum);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
h = list(map(int, data[1:1 + n]))
stack = []
total = 0
for x in h:
    while stack and stack[-1] < x:
        stack.pop()
        total += x
    stack.append(x)
print(total)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long[] h = new long[n];
        for (int i = 0; i < n; i++) h[i] = Long.parseLong(st.nextToken());
        long[] stack = new long[n];
        int top = 0;
        long total = 0;
        for (int i = 0; i < n; i++) {
            while (top > 0 && stack[top - 1] < h[i]) { top--; total += h[i]; }
            stack[top++] = h[i];
        }
        System.out.println(total);
    }
}
`,
    },
  },
  {
    id: 'inf-m-ship-capacity',
    level: 'medium',
    title: 'Courier Capacity',
    topics: ['binary-search'],
    sample: true,
    statement: `A courier company must ship **N** parcels in the given order; parcel i weighs **W[i]** kg. Every day the truck is loaded with parcels **in order** without exceeding its capacity, and the parcels must all be delivered within **D** days.

Find the **minimum truck capacity** that allows shipping every parcel within D days.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing W[i].\nThe last line contains an integer, D.',
    outputFormat: 'Print the minimum capacity.',
    constraints: ['1 ≤ D ≤ N ≤ 10⁵', '1 ≤ W[i] ≤ 10⁴'],
    pattern: {
      name: 'Binary search on the answer',
      recognize: '"Minimum capacity / speed / time such that the task can be done": feasibility is monotonic in the answer.',
      approach: [
        'Capacity must be at least max(W) and at most sum(W).',
        'feasible(c): greedily fill each day up to c and count days; feasible if days ≤ D.',
        'Binary search the smallest c in [max(W), sum(W)] with feasible(c).',
      ],
      time: 'O(N log(sum W))',
      space: 'O(1)',
      pitfalls: 'Starting the search at 1 (instead of max W) makes feasible() loop forever or fail for heavy parcels.',
    },
    walkthrough: 'W = [1..10], D = 5: capacity 15 ships [1–5], [6, 7], [8], [9], [10]; capacity 14 would need 6 days. Answer 15.',
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(5, 8);
        return lines(n, r.array(n, 1, 10), r.int(2, Math.max(2, n - 2)));
      }
      if (k === 'edge') return r.pick([lines(1, 7, 1), lines(4, [5, 5, 5, 5], 4), lines(4, [3, 1, 4, 1], 1)]);
      const n = k === 'large' ? 30000 : r.int(10, 400);
      return lines(n, r.array(n, 1, k === 'large' ? 10000 : 100), r.int(1, n));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const w = rd.nums(n);
      const D = rd.num();
      const ok = (c: number) => {
        let days = 1;
        let load = 0;
        for (const x of w) {
          if (load + x > c) {
            days++;
            load = 0;
          }
          load += x;
        }
        return days <= D;
      };
      let lo = Math.max(...w);
      let hi = w.reduce((s, x) => s + x, 0);
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (ok(mid)) hi = mid;
        else lo = mid + 1;
      }
      return String(lo);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
w = list(map(int, data[1:1 + n]))
d = int(data[1 + n])

def feasible(cap):
    days, load = 1, 0
    for x in w:
        if load + x > cap:
            days += 1
            load = 0
        load += x
    return days <= d

lo, hi = max(w), sum(w)
while lo < hi:
    mid = (lo + hi) // 2
    if feasible(mid):
        hi = mid
    else:
        lo = mid + 1
print(lo)
`,
      java: `import java.util.*;
import java.io.*;

public class Main {
    static int[] w;
    static int d;

    static boolean feasible(long cap) {
        int days = 1;
        long load = 0;
        for (int x : w) {
            if (load + x > cap) { days++; load = 0; }
            load += x;
        }
        return days <= d;
    }

    public static void main(String[] args) throws IOException {
        StringTokenizer st = new StringTokenizer(new String(System.in.readAllBytes()));
        int n = Integer.parseInt(st.nextToken());
        w = new int[n];
        long lo = 0, hi = 0;
        for (int i = 0; i < n; i++) {
            w[i] = Integer.parseInt(st.nextToken());
            lo = Math.max(lo, w[i]);
            hi += w[i];
        }
        d = Integer.parseInt(st.nextToken());
        while (lo < hi) {
            long mid = (lo + hi) / 2;
            if (feasible(mid)) hi = mid; else lo = mid + 1;
        }
        System.out.println(lo);
    }
}
`,
    },
  },
  {
    id: 'inf-m-min-window-sum',
    level: 'medium',
    title: 'Shortest Fundraising Streak',
    topics: ['window'],
    statement: `A charity receives donations **A[0..N−1]** (all positive) on consecutive days. It wants the **shortest run of consecutive days** whose total donations are **at least S**.

Print the length of that run, or **0** if no run reaches S.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].\nThe last line contains an integer, S.',
    outputFormat: 'Print the minimum length, or 0.',
    constraints: ['1 ≤ N ≤ 10⁵', '1 ≤ A[i] ≤ 10⁴', '1 ≤ S ≤ 10⁹'],
    pattern: {
      name: 'Shrinking sliding window',
      recognize: 'Positive values + "shortest subarray with sum ≥ S": extending the window only increases the sum.',
      approach: ['Expand right, adding A[right] to the window sum.', 'While the sum ≥ S, record the length and shrink from the left.'],
      time: 'O(N)',
      space: 'O(1)',
      pitfalls: 'This only works because all values are positive; with negatives you need prefix sums + a deque.',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(5, 8);
        return lines(n, r.array(n, 1, 9), r.int(5, 20));
      }
      if (k === 'edge') return r.pick([lines(1, 5, 5), lines(1, 5, 6), lines(3, [1, 1, 1], 100), lines(4, [2, 2, 2, 2], 8)]);
      const n = k === 'large' ? 30000 : r.int(10, 400);
      const a = r.array(n, 1, k === 'large' ? 10000 : 50);
      const total = a.reduce((s, x) => s + x, 0);
      return lines(n, a, r.int(1, Math.floor(total * r.pick([0.01, 0.2, 0.7, 1.1]))));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n);
      const S = rd.num();
      let left = 0;
      let sum = 0;
      let best = Infinity;
      for (let right = 0; right < n; right++) {
        sum += a[right];
        while (sum >= S) {
          best = Math.min(best, right - left + 1);
          sum -= a[left++];
        }
      }
      return String(best === Infinity ? 0 : best);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
s = int(data[1 + n])
left = total = 0
best = n + 1
for right in range(n):
    total += a[right]
    while total >= s:
        best = min(best, right - left + 1)
        total -= a[left]
        left += 1
print(best if best <= n else 0)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        int[] a = new int[n];
        for (int i = 0; i < n; i++) a[i] = Integer.parseInt(st.nextToken());
        long s = Long.parseLong(st.nextToken());
        int left = 0, best = Integer.MAX_VALUE;
        long total = 0;
        for (int right = 0; right < n; right++) {
            total += a[right];
            while (total >= s) {
                best = Math.min(best, right - left + 1);
                total -= a[left++];
            }
        }
        System.out.println(best == Integer.MAX_VALUE ? 0 : best);
    }
}
`,
    },
  },
  {
    id: 'inf-m-interval-union',
    level: 'medium',
    title: 'Total Booked Time',
    topics: ['intervals'],
    statement: `A conference room has **N** bookings. Booking i occupies the half-open time range **[L[i], R[i])**. Bookings may overlap.

Print the **total length of time** during which the room is booked by at least one booking.`,
    inputFormat: 'The first line contains an integer, N.\nEach of the next N lines contains two space-separated integers L[i] and R[i].',
    outputFormat: 'Print the total booked time.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ L[i] < R[i] ≤ 10⁹'],
    pattern: {
      name: 'Sort and merge intervals',
      recognize: '"Total covered length / merged intervals" from overlapping ranges.',
      approach: ['Sort bookings by start.', 'Keep a current merged block [cs, ce). If the next start ≤ ce, extend ce; otherwise add ce − cs to the total and start a new block.', 'Add the last block at the end.'],
      time: 'O(N log N)',
      space: 'O(N)',
      pitfalls: 'Touching intervals ([1,3) and [3,5)) merge without double counting either way, but contained intervals must not shrink the block: use ce = max(ce, R).',
    },
    gen: (r, k) => {
      const make = (n: number, span: number, maxLen: number) => {
        const rows: string[] = [];
        for (let i = 0; i < n; i++) {
          const l = r.int(0, span - 1);
          rows.push(`${l} ${Math.min(span, l + r.int(1, maxLen))}`);
        }
        return lines(n, rows);
      };
      if (k === 'public') return make(r.int(3, 5), 20, 6);
      if (k === 'edge') return r.pick([lines(1, '0 1000000000'), lines(2, ['1 3', '3 5']), lines(3, ['1 10', '2 3', '4 5'])]);
      if (k === 'large') return make(20000, 1000000000, 50000000);
      return make(r.int(10, 400), 5000, r.int(5, 500));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const iv: [number, number][] = [];
      for (let i = 0; i < n; i++) iv.push([rd.num(), rd.num()]);
      iv.sort((a, b) => a[0] - b[0]);
      let total = 0;
      let [cs, ce] = iv[0];
      for (let i = 1; i < n; i++) {
        const [l, r2] = iv[i];
        if (l <= ce) ce = Math.max(ce, r2);
        else {
          total += ce - cs;
          cs = l;
          ce = r2;
        }
      }
      total += ce - cs;
      return String(total);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
iv = sorted((int(data[1 + 2 * i]), int(data[2 + 2 * i])) for i in range(n))
total = 0
cs, ce = iv[0]
for l, r in iv[1:]:
    if l <= ce:
        ce = max(ce, r)
    else:
        total += ce - cs
        cs, ce = l, r
total += ce - cs
print(total)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        long[][] iv = new long[n][2];
        for (int i = 0; i < n; i++) {
            iv[i][0] = Long.parseLong(st.nextToken());
            iv[i][1] = Long.parseLong(st.nextToken());
        }
        Arrays.sort(iv, (x, y) -> Long.compare(x[0], y[0]));
        long total = 0, cs = iv[0][0], ce = iv[0][1];
        for (int i = 1; i < n; i++) {
            if (iv[i][0] <= ce) ce = Math.max(ce, iv[i][1]);
            else { total += ce - cs; cs = iv[i][0]; ce = iv[i][1]; }
        }
        total += ce - cs;
        System.out.println(total);
    }
}
`,
    },
  },
  {
    id: 'inf-m-diff-pairs',
    level: 'medium',
    title: 'Rating Gap Pairs',
    topics: ['hash-adv'],
    statement: `A coding club has **N** members with ratings **A[0..N−1]**. For a mentoring scheme, the coach wants pairs of members whose ratings differ by **exactly K**.

Count the pairs of indices (i, j) with i < j and |A[i] − A[j]| = K.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer describing A[i].\nThe last line contains an integer, K.',
    outputFormat: 'Print the number of pairs.',
    constraints: ['1 ≤ N ≤ 10⁵', '0 ≤ A[i] ≤ 10⁹', '0 ≤ K ≤ 10⁹'],
    pattern: {
      name: 'Frequency map pairing',
      recognize: 'Count pairs with a fixed difference: pair every value v with v + K using counts, not loops.',
      approach: ['Build freq[v] for every rating.', 'If K = 0: each value contributes f·(f−1)/2 pairs.', 'If K > 0: each value v contributes freq[v] · freq[v + K].'],
      time: 'O(N)',
      space: 'O(N)',
      pitfalls: 'K = 0 is a special case: pairing v with v + K would count each element with itself.',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(5, 7);
        return lines(n, r.array(n, 1, 8), r.int(0, 3));
      }
      if (k === 'edge') return r.pick([lines(1, 4, 0), lines(4, [7, 7, 7, 7], 0), lines(3, [1, 2, 3], 1000000000)]);
      const n = k === 'large' ? 30000 : r.int(10, 400);
      const hi = k === 'large' ? r.pick([20, 1000000]) : 60;
      return lines(n, r.array(n, 0, hi), r.int(0, 5));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n);
      const K = rd.num();
      const f = new Map<number, number>();
      for (const x of a) f.set(x, (f.get(x) || 0) + 1);
      let c = 0;
      for (const [v, cnt] of f) c += K === 0 ? (cnt * (cnt - 1)) / 2 : cnt * (f.get(v + K) || 0);
      return String(c);
    },
    solutions: {
      python: `import sys
from collections import Counter

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
k = int(data[1 + n])
freq = Counter(a)
if k == 0:
    print(sum(f * (f - 1) // 2 for f in freq.values()))
else:
    print(sum(f * freq.get(v + k, 0) for v, f in freq.items()))
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        HashMap<Long, Long> freq = new HashMap<>();
        for (int i = 0; i < n; i++) freq.merge(Long.parseLong(st.nextToken()), 1L, Long::sum);
        long k = Long.parseLong(st.nextToken()), pairs = 0;
        for (Map.Entry<Long, Long> e : freq.entrySet()) {
            long f = e.getValue();
            if (k == 0) pairs += f * (f - 1) / 2;
            else pairs += f * freq.getOrDefault(e.getKey() + k, 0L);
        }
        System.out.println(pairs);
    }
}
`,
    },
  },
  {
    id: 'inf-m-fix-brackets',
    level: 'medium',
    title: 'Repairing the Expression',
    topics: ['stack'],
    statement: `A text editor receives a string **S** of parentheses '(' and ')' that may be **unbalanced**. You may insert parentheses anywhere in the string.

Find the **minimum number of insertions** needed to make S a balanced parentheses sequence.`,
    inputFormat: 'The first line contains a string, S.',
    outputFormat: 'Print the minimum number of insertions.',
    constraints: ['1 ≤ |S| ≤ 2 × 10⁵', "S contains only '(' and ')'"],
    pattern: {
      name: 'Balance counter (greedy)',
      recognize: 'Bracket validity with one bracket type: track how many "(" are waiting to be closed.',
      approach: ["open = 0, add = 0.", "For '(' do open += 1. For ')': if open > 0 then open −= 1 else add += 1 (insert a '(' before it).", "At the end, every unmatched '(' needs a ')': answer = add + open."],
      time: 'O(|S|)',
      space: 'O(1)',
    },
    gen: (r, k) => {
      if (k === 'public') return lines(r.str(r.int(5, 8), '()'));
      if (k === 'edge') return r.pick([lines('('), lines(')'), lines('()()'), lines(')))((('), lines('(())')]);
      return lines(r.str(k === 'large' ? 200000 : r.int(10, 400), r.pick(['()', '(()', '())'])));
    },
    solve: (inp) => {
      const s = inp.trim();
      let open = 0;
      let add = 0;
      for (const c of s) {
        if (c === '(') open++;
        else if (open > 0) open--;
        else add++;
      }
      return String(add + open);
    },
    solutions: {
      python: `s = input().strip()
open_ = add = 0
for c in s:
    if c == '(':
        open_ += 1
    elif open_ > 0:
        open_ -= 1
    else:
        add += 1
print(add + open_)
`,
      java: `${javaHead}
        String s = st.nextToken();
        long open = 0, add = 0;
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') open++;
            else if (open > 0) open--;
            else add++;
        }
        System.out.println(add + open);
    }
}
`,
    },
  },
  {
    id: 'inf-m-group-ones',
    level: 'medium',
    title: 'Seating the Team Together',
    topics: ['window'],
    statement: `A row of **N** seats is described by **A[0..N−1]**, where 1 means the seat is taken by a team member and 0 means it is taken by someone else. In one **swap**, two people exchange seats.

Find the minimum number of swaps needed so that all team members sit in **one contiguous block**.`,
    inputFormat: 'The first line contains an integer, N.\nEach line i of the N subsequent lines contains an integer (0 or 1) describing A[i].',
    outputFormat: 'Print the minimum number of swaps.',
    constraints: ['1 ≤ N ≤ 10⁵', 'A[i] ∈ {0, 1}'],
    pattern: {
      name: 'Fixed-size sliding window',
      recognize: 'The final block has a known size (the number of 1s); choose the best place for it.',
      approach: ['Let T = number of 1s; the block must be a window of size T.', 'Slide a window of size T and track the maximum number of 1s inside it.', 'Answer = T − (max ones in a window): each missing 1 needs one swap.'],
      time: 'O(N)',
      space: 'O(1)',
      pitfalls: 'T = 0 means no swaps are needed.',
    },
    gen: (r, k) => {
      if (k === 'public') {
        const n = r.int(6, 9);
        return lines(n, r.array(n, 0, 1));
      }
      if (k === 'edge') return r.pick([lines(1, 0), lines(1, 1), lines(5, [0, 0, 0, 0, 0]), lines(5, [1, 1, 1, 1, 1]), lines(5, [1, 0, 1, 0, 1])]);
      const n = k === 'large' ? 50000 : r.int(10, 400);
      const p = r.pick([0.1, 0.4, 0.7]);
      return lines(n, Array.from({ length: n }, () => (r.chance(p) ? 1 : 0)));
    },
    solve: (inp) => {
      const rd = reader(inp);
      const n = rd.num();
      const a = rd.nums(n);
      const T = a.reduce((s, x) => s + x, 0);
      if (T === 0) return '0';
      let cur = 0;
      for (let i = 0; i < T; i++) cur += a[i];
      let best = cur;
      for (let i = T; i < n; i++) {
        cur += a[i] - a[i - T];
        best = Math.max(best, cur);
      }
      return String(T - best);
    },
    solutions: {
      python: `import sys

data = sys.stdin.read().split()
n = int(data[0])
a = list(map(int, data[1:1 + n]))
t = sum(a)
if t == 0:
    print(0)
else:
    cur = sum(a[:t])
    best = cur
    for i in range(t, n):
        cur += a[i] - a[i - t]
        best = max(best, cur)
    print(t - best)
`,
      java: `${javaHead}
        int n = Integer.parseInt(st.nextToken());
        int[] a = new int[n];
        int t = 0;
        for (int i = 0; i < n; i++) { a[i] = Integer.parseInt(st.nextToken()); t += a[i]; }
        if (t == 0) { System.out.println(0); return; }
        int cur = 0;
        for (int i = 0; i < t; i++) cur += a[i];
        int best = cur;
        for (int i = t; i < n; i++) { cur += a[i] - a[i - t]; best = Math.max(best, cur); }
        System.out.println(t - best);
    }
}
`,
    },
  },
];
