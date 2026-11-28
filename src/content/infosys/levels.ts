import type { CodingLevel } from '../../lib/types';

export interface InfosysTopic {
  id: string;
  title: string;
  /** Why this matters at this level. */
  why: string;
  /** What you must be able to do. */
  skills: string[];
  /** Lesson ids in Learn → DSA. */
  lessons: string[];
}

export interface LevelInfo {
  id: CodingLevel;
  title: string;
  tagline: string;
  /** What questions at this level look like in the real assessment. */
  expect: string[];
  /** Typical constraint scale and the complexity it demands. */
  scale: string;
  /** Minutes allowed for a generated 4-question test. */
  minutes: number;
  strategy: string[];
  topics: InfosysTopic[];
}

export const LEVELS: LevelInfo[] = [
  {
    id: 'easy',
    title: 'Easy',
    tagline: 'Clean implementation: read input correctly, loop once, count, track a maximum.',
    expect: [
      'A short story around an array or a string, usually solvable in one pass.',
      'Input is given one value per line: first N, then the N values.',
      'The trap is usually an edge case (N = 1, all values equal, an empty result) rather than the algorithm.',
    ],
    scale: 'N up to 10⁵. An O(n) or O(n log n) solution is expected; O(n²) usually times out on the larger hidden cases.',
    minutes: 60,
    strategy: [
      'Read all input tokens at once (sys.stdin.read().split() / StringTokenizer) instead of line-by-line parsing.',
      'Write down what the answer is for N = 1 and for "all equal" before coding.',
      'Use 64-bit integers (long) whenever you add or multiply values up to 10⁹.',
      'Print exactly one value with no extra text: the judge compares outputs character for character.',
    ],
    topics: [
      { id: 'io', title: 'Input parsing and output format', why: 'Every Infosys question reads from standard input in a fixed format; a parsing bug fails all test cases.', skills: ['Read N then N values (one per line or space-separated)', 'Read a whole line as a string', 'Print a single number without extra spaces or text'], lessons: ['intro'] },
      { id: 'arrays', title: 'Array traversal', why: 'Most easy questions are a single pass that maintains a running value.', skills: ['Running maximum / minimum', 'Counting elements that satisfy a condition', 'Comparing neighbours (A[i] vs A[i−1])'], lessons: ['dsa-arrays'] },
      { id: 'strings', title: 'String processing', why: 'Character counting, runs of equal characters and simple encodings appear often.', skills: ['Iterate characters and track runs', 'Convert between digits and characters', 'Build output strings efficiently'], lessons: ['dsa-strings'] },
      { id: 'hashing', title: 'Hash sets and frequency maps', why: 'Distinct counts and "pair sums to K" are classic easy questions that need O(1) lookups.', skills: ['Count distinct values with a set', 'Frequency map with dict / HashMap', 'Complement lookup (K − x)'], lessons: ['hashing'] },
      { id: 'math', title: 'Basic math and digits', why: 'Digit sums, parity, modulo and simple formulas avoid needless loops.', skills: ['Digit sum of very long numbers (as strings)', 'Integer division and modulo', 'Median minimises the sum of absolute differences'], lessons: ['number-theory'] },
      { id: 'sorting', title: 'Sorting', why: 'Sorting first often turns a hard-looking question into a single pass.', skills: ['Sort numbers ascending / descending', 'Take the median or the k-th element after sorting'], lessons: ['sorting-basic'] },
      { id: 'complexity', title: 'Estimating time complexity', why: 'Hidden cases use the maximum N; you must know whether O(n²) will pass.', skills: ['About 10⁸ simple operations per second (fewer in Python)', 'Pick O(n) or O(n log n) when N ≥ 10⁵'], lessons: ['complexity'] },
    ],
  },
  {
    id: 'medium',
    title: 'Medium',
    tagline: 'One classic technique applied correctly: prefix sums, windows, two pointers, binary search, stacks.',
    expect: [
      'The brute force is obvious but too slow; you must recognise the technique that makes it O(n) or O(n log n).',
      'Typical stories: subarrays with a target sum, scheduling platforms, shipping within D days, bracket repairs.',
      'Answers can exceed 32 bits; some ask for counts.',
    ],
    scale: 'N up to 10⁵ (values up to 10⁹). Target O(n) or O(n log n).',
    minutes: 90,
    strategy: [
      'Write the O(n²) idea first, then ask: what am I recomputing? A prefix sum, a window or a sorted order usually removes it.',
      '"Minimum X such that it is possible" → binary search on the answer with a greedy check.',
      'Subarray questions: positive numbers → sliding window; any sign → prefix sum + hash map.',
      'Test your solution on the two public cases, then on your own edge cases (N = 1, all equal, already sorted).',
    ],
    topics: [
      { id: 'prefix', title: 'Prefix sums', why: 'Sum of any subarray in O(1); combined with a hash map it counts subarrays with a given sum.', skills: ['Build prefix[i] = A[0] + … + A[i−1]', 'Count pairs of equal prefix differences with a hash map'], lessons: ['prefix-sum'] },
      { id: 'window', title: 'Sliding window', why: 'Longest / shortest subarray or substring satisfying a condition, in linear time.', skills: ['Fixed-size window sums', 'Variable window that grows and shrinks (two indices)'], lessons: ['sliding-window'] },
      { id: 'two-pointers', title: 'Two pointers and sweeps', why: 'Sorted arrays and event timelines are processed with two moving indices.', skills: ['Merge two sorted sequences', 'Sweep start/end events to find maximum overlap'], lessons: ['two-pointers'] },
      { id: 'binary-search', title: 'Binary search on the answer', why: '"Minimum capacity / maximum distance such that it is possible" questions.', skills: ['Monotonic feasibility check', 'Search on value range [lo, hi]'], lessons: ['binary-search'] },
      { id: 'stack', title: 'Stacks and monotonic stacks', why: 'Bracket matching and next greater / smaller element questions.', skills: ['Balance counters and stacks for brackets', 'Monotonic stack for next greater element in O(n)'], lessons: ['stack', 'monotonic-stack'] },
      { id: 'intervals', title: 'Sorting and intervals', why: 'Meetings, bookings and coverage questions need sorting by start or end.', skills: ['Merge overlapping intervals', 'Greedy choice after sorting'], lessons: ['intervals', 'greedy'] },
      { id: 'hash-adv', title: 'Hash maps for counting pairs', why: 'Pairs with a given difference, frequencies of prefix values, duplicates within a window.', skills: ['Count pairs with frequency × frequency', 'Map from value to last index'], lessons: ['hashing'] },
    ],
  },
  {
    id: 'hard',
    title: 'Hard',
    tagline: 'Dynamic programming, graph traversal, union–find and bit tricks, often with answers modulo 10⁹+7.',
    expect: [
      'You need to model the problem (states for DP, nodes and edges for graphs) before any code works.',
      'Answers are often large and asked modulo 1,000,000,007.',
      'Grids and friendship / dependency stories are common.',
    ],
    scale: 'N up to 10⁴–10⁵ for linear DP / graphs; up to ~1000 for 2-D DP. Target O(n log n) or O(n·m) within limits.',
    minutes: 120,
    strategy: [
      'For DP, write the state in words ("ways[i] = number of ways to reach step i"), the transition and the base case before coding.',
      'For grids, think BFS for shortest steps, DP for counting paths.',
      'Take the modulo after every addition and multiplication.',
      'Python: avoid deep recursion (use iterative BFS/DFS or raise the recursion limit).',
    ],
    topics: [
      { id: 'dp-basic', title: '1-D and 2-D dynamic programming', why: 'Counting ways and optimising choices step by step.', skills: ['Define a state, a transition and base cases', 'Bottom-up tables, rolling arrays'], lessons: ['dp-intro', 'dp-1d', 'dp-2d'] },
      { id: 'knapsack', title: 'Knapsack and subset DP', why: 'Pick items under a capacity, or count subsets with a sum.', skills: ['0/1 knapsack (iterate capacity downwards)', 'Subset-sum counting modulo M'], lessons: ['dp-knapsack'] },
      { id: 'lis', title: 'Longest increasing subsequence', why: 'Classic O(n log n) technique with binary search over tails.', skills: ['Patience sorting with bisect / lower_bound'], lessons: ['dp-1d', 'binary-search'] },
      { id: 'bfs', title: 'BFS on grids and graphs', why: 'Minimum number of steps in an unweighted grid or graph.', skills: ['Queue-based BFS with a distance array', 'Four-direction moves with bounds checks'], lessons: ['bfs-dfs', 'graph-basics'] },
      { id: 'dsu', title: 'Union–find (DSU)', why: 'Groups, connected components and merging sets quickly.', skills: ['find with path compression', 'union by size / rank'], lessons: ['dsu'] },
      { id: 'topo', title: 'Topological sort', why: 'Course prerequisites and dependency ordering; detecting cycles.', skills: ["Kahn's algorithm with in-degrees", 'Detect nodes trapped in cycles'], lessons: ['topological-sort'] },
      { id: 'bits', title: 'Bit manipulation and tries', why: 'XOR maximisation and subset tricks.', skills: ['Bitwise operators and masks', 'Binary trie for maximum XOR'], lessons: ['bit-manipulation', 'tries'] },
      { id: 'modular', title: 'Modular arithmetic', why: 'Counts are reported modulo 10⁹+7.', skills: ['(a + b) % M, (a × b) % M with 64-bit', 'Never subtract without adding M back'], lessons: ['number-theory'] },
    ],
  },
  {
    id: 'complex',
    title: 'Complex',
    tagline: 'Advanced techniques: Dijkstra, MST, Fenwick trees, bitmask / tree / digit / interval DP.',
    expect: [
      'Multi-part problems where a known advanced algorithm is the core and the story hides it.',
      'Weighted graphs, range queries with updates, very large N (up to 10¹⁸) handled digit by digit.',
      'Correctness on tricky hidden cases (disconnected graphs, single node, large weights) matters.',
    ],
    scale: 'N up to 10⁵ with O(n log n) structures; small N (≤ 15) for bitmask DP; N up to 10¹⁸ for digit DP.',
    minutes: 150,
    strategy: [
      'Name the algorithm first ("this is Dijkstra on cities with tolls"), then adapt the input to it.',
      'Use 64-bit distances and an "infinity" larger than any possible path.',
      'For trees in Python, use iterative DFS (recursion depth can exceed 1000).',
      'Check disconnected / impossible cases: many problems expect −1.',
    ],
    topics: [
      { id: 'dijkstra', title: 'Shortest paths (Dijkstra)', why: 'Minimum cost between nodes in a weighted graph with non-negative weights.', skills: ['Priority queue (heapq / PriorityQueue) with lazy deletion', 'Counting shortest paths'], lessons: ['shortest-paths'] },
      { id: 'mst', title: 'Minimum spanning tree', why: 'Connect all nodes at minimum total cost.', skills: ["Kruskal's algorithm with DSU", 'Detect a disconnected graph'], lessons: ['minimum-spanning-tree', 'dsu'] },
      { id: 'fenwick', title: 'Fenwick / segment trees', why: 'Range queries with point updates in O(log n).', skills: ['Fenwick tree update / prefix query', 'Segment tree for sums / minimums'], lessons: ['segment-tree', 'segment-tree-impl'] },
      { id: 'bitmask', title: 'Bitmask DP', why: 'Visiting subsets of up to ~15 items (travelling salesman).', skills: ['dp[mask][last] transitions', 'Iterating set bits'], lessons: ['dp-bitmask'] },
      { id: 'tree-dp', title: 'DP on trees', why: 'Choose nodes on a tree under parent–child constraints.', skills: ['Post-order processing with an explicit stack', 'Include / exclude states per node'], lessons: ['dp-trees', 'tree-traversals'] },
      { id: 'digit-dp', title: 'Digit DP', why: 'Count numbers up to 10¹⁸ with a digit property.', skills: ['State: position, tight flag, accumulated value', 'Memoisation over digits'], lessons: ['dp-digit'] },
      { id: 'interval-dp', title: 'Interval DP', why: 'Optimal merging / splitting of contiguous segments.', skills: ['dp[i][j] over increasing lengths', 'Prefix sums for segment costs'], lessons: ['dp-interval'] },
    ],
  },
];

export const levelById = (id: string) => LEVELS.find((l) => l.id === id);
