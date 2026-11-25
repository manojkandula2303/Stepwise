import type { CodeLang } from '../../lib/types';

export interface Sample {
  id: string;
  title: string;
  stdin?: string;
  code: Record<CodeLang, string>;
}

export const SAMPLES: Sample[] = [
  {
    id: 'hello',
    title: 'Hello, World',
    code: {
      python: `print("Hello, World!")\n`,
      java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}\n`,
      c: `#include <stdio.h>\n\nint main(void) {\n    printf("Hello, World!\\n");\n    return 0;\n}\n`,
    },
  },
  {
    id: 'input',
    title: 'Read input & sum',
    stdin: '5\n3 8 1 9 4\n',
    code: {
      python: `n = int(input())\nnums = list(map(int, input().split()))\n\ntotal = 0\nfor x in nums:\n    total += x\n\nprint("Count:", n)\nprint("Sum:", total)\nprint("Max:", max(nums))\n`,
      java: `import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        int[] nums = new int[n];\n        for (int i = 0; i < n; i++) {\n            nums[i] = sc.nextInt();\n        }\n        int total = 0, max = Integer.MIN_VALUE;\n        for (int x : nums) {\n            total += x;\n            max = Math.max(max, x);\n        }\n        System.out.println("Count: " + n);\n        System.out.println("Sum: " + total);\n        System.out.println("Max: " + max);\n    }\n}\n`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    int n;\n    cin >> n;\n    vector<int> nums(n);\n    for (auto &x : nums) cin >> x;\n    long long total = accumulate(nums.begin(), nums.end(), 0LL);\n    cout << "Count: " << n << "\\n";\n    cout << "Sum: " << total << "\\n";\n    cout << "Max: " << *max_element(nums.begin(), nums.end()) << "\\n";\n}\n`,
      c: `#include <stdio.h>\n\nint main(void) {\n    int n;\n    scanf("%d", &n);\n    int total = 0, max = -2147483647;\n    for (int i = 0; i < n; i++) {\n        int x;\n        scanf("%d", &x);\n        total += x;\n        if (x > max) max = x;\n    }\n    printf("Count: %d\\nSum: %d\\nMax: %d\\n", n, total, max);\n    return 0;\n}\n`,
    },
  },
  {
    id: 'factorial',
    title: 'Recursion: factorial',
    code: {
      python: `def factorial(n):\n    if n <= 1:\n        return 1\n    return n * factorial(n - 1)\n\nresult = factorial(4)\nprint("4! =", result)\n`,
      java: `public class Main {\n    static int factorial(int n) {\n        if (n <= 1) {\n            return 1;\n        }\n        return n * factorial(n - 1);\n    }\n\n    public static void main(String[] args) {\n        int result = factorial(4);\n        System.out.println("4! = " + result);\n    }\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\n\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    cout << "4! = " << factorial(4) << endl;\n}\n`,
      c: `#include <stdio.h>\n\nint factorial(int n) {\n    if (n <= 1) return 1;\n    return n * factorial(n - 1);\n}\n\nint main(void) {\n    printf("4! = %d\\n", factorial(4));\n    return 0;\n}\n`,
    },
  },
  {
    id: 'bubble',
    title: 'Bubble sort',
    code: {
      python: `nums = [5, 2, 9, 1, 6]\nn = len(nums)\n\nfor i in range(n - 1):\n    for j in range(n - 1 - i):\n        if nums[j] > nums[j + 1]:\n            nums[j], nums[j + 1] = nums[j + 1], nums[j]\n\nprint(nums)\n`,
      java: `import java.util.Arrays;\n\npublic class Main {\n    public static void main(String[] args) {\n        int[] nums = {5, 2, 9, 1, 6};\n        int n = nums.length;\n        for (int i = 0; i < n - 1; i++) {\n            for (int j = 0; j < n - 1 - i; j++) {\n                if (nums[j] > nums[j + 1]) {\n                    int tmp = nums[j];\n                    nums[j] = nums[j + 1];\n                    nums[j + 1] = tmp;\n                }\n            }\n        }\n        System.out.println(Arrays.toString(nums));\n    }\n}\n`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {5, 2, 9, 1, 6};\n    int n = nums.size();\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - 1 - i; j++)\n            if (nums[j] > nums[j + 1]) swap(nums[j], nums[j + 1]);\n    for (int x : nums) cout << x << " ";\n    cout << endl;\n}\n`,
      c: `#include <stdio.h>\n\nint main(void) {\n    int nums[] = {5, 2, 9, 1, 6};\n    int n = 5;\n    for (int i = 0; i < n - 1; i++)\n        for (int j = 0; j < n - 1 - i; j++)\n            if (nums[j] > nums[j + 1]) {\n                int t = nums[j]; nums[j] = nums[j + 1]; nums[j + 1] = t;\n            }\n    for (int i = 0; i < n; i++) printf("%d ", nums[i]);\n    printf("\\n");\n    return 0;\n}\n`,
    },
  },
  {
    id: 'linked',
    title: 'Linked list: reverse',
    code: {
      python: `class Node:\n    def __init__(self, val):\n        self.val = val\n        self.next = None\n\nhead = Node(1)\nhead.next = Node(2)\nhead.next.next = Node(3)\n\nprev = None\ncurr = head\nwhile curr:\n    nxt = curr.next\n    curr.next = prev\n    prev = curr\n    curr = nxt\nhead = prev\n\nnode = head\nwhile node:\n    print(node.val, end=" ")\n    node = node.next\nprint()\n`,
      java: `public class Main {\n    static class Node {\n        int val;\n        Node next;\n        Node(int val) { this.val = val; }\n    }\n\n    public static void main(String[] args) {\n        Node head = new Node(1);\n        head.next = new Node(2);\n        head.next.next = new Node(3);\n\n        Node prev = null;\n        Node curr = head;\n        while (curr != null) {\n            Node nxt = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nxt;\n        }\n        head = prev;\n\n        for (Node n = head; n != null; n = n.next) {\n            System.out.print(n.val + " ");\n        }\n        System.out.println();\n    }\n}\n`,
      cpp: `#include <iostream>\nusing namespace std;\n\nstruct Node { int val; Node* next; Node(int v) : val(v), next(nullptr) {} };\n\nint main() {\n    Node* head = new Node(1);\n    head->next = new Node(2);\n    head->next->next = new Node(3);\n    Node *prev = nullptr, *curr = head;\n    while (curr) { Node* nxt = curr->next; curr->next = prev; prev = curr; curr = nxt; }\n    for (Node* n = prev; n; n = n->next) cout << n->val << " ";\n    cout << endl;\n}\n`,
      c: `#include <stdio.h>\n#include <stdlib.h>\n\ntypedef struct Node { int val; struct Node* next; } Node;\n\nNode* make(int v) { Node* n = malloc(sizeof(Node)); n->val = v; n->next = NULL; return n; }\n\nint main(void) {\n    Node* head = make(1);\n    head->next = make(2);\n    head->next->next = make(3);\n    Node *prev = NULL, *curr = head;\n    while (curr) { Node* nxt = curr->next; curr->next = prev; prev = curr; curr = nxt; }\n    for (Node* n = prev; n; n = n->next) printf("%d ", n->val);\n    printf("\\n");\n    return 0;\n}\n`,
    },
  },
  {
    id: 'binary-search',
    title: 'Binary search',
    code: {
      python: `def binary_search(nums, target):\n    lo, hi = 0, len(nums) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n\nnums = [1, 3, 5, 7, 9, 11, 13]\nprint(binary_search(nums, 9))\n`,
      java: `public class Main {\n    static int binarySearch(int[] nums, int target) {\n        int lo = 0, hi = nums.length - 1;\n        while (lo <= hi) {\n            int mid = lo + (hi - lo) / 2;\n            if (nums[mid] == target) {\n                return mid;\n            } else if (nums[mid] < target) {\n                lo = mid + 1;\n            } else {\n                hi = mid - 1;\n            }\n        }\n        return -1;\n    }\n\n    public static void main(String[] args) {\n        int[] nums = {1, 3, 5, 7, 9, 11, 13};\n        System.out.println(binarySearch(nums, 9));\n    }\n}\n`,
      cpp: `#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {1, 3, 5, 7, 9, 11, 13};\n    int target = 9, lo = 0, hi = nums.size() - 1, ans = -1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] == target) { ans = mid; break; }\n        if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;\n    }\n    cout << ans << endl;\n}\n`,
      c: `#include <stdio.h>\n\nint main(void) {\n    int nums[] = {1, 3, 5, 7, 9, 11, 13};\n    int target = 9, lo = 0, hi = 6, ans = -1;\n    while (lo <= hi) {\n        int mid = lo + (hi - lo) / 2;\n        if (nums[mid] == target) { ans = mid; break; }\n        if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;\n    }\n    printf("%d\\n", ans);\n    return 0;\n}\n`,
    },
  },
];
