import type { CodeLang } from '../../lib/types';

/** Starter templates for stdin/stdout problems (Infosys style). */
export const STARTER: Record<CodeLang, string> = {
  python: `import sys

def main():
    data = sys.stdin.read().split()
    # data holds every input token as a string, e.g. n = int(data[0])
    # Write your solution here and print the answer.


main()
`,
  java: `import java.util.*;
import java.io.*;

public class Main {
    public static void main(String[] args) throws IOException {
        StringTokenizer st = new StringTokenizer(new String(System.in.readAllBytes()));
        // Read tokens with st.nextToken(), e.g. int n = Integer.parseInt(st.nextToken());
        // Write your solution here and print the answer.

    }
}
`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    // Read input with cin, e.g. int n; cin >> n;
    // Write your solution here and print the answer.

    return 0;
}
`,
  c: `#include <stdio.h>
#include <stdlib.h>

int main(void) {
    /* Read input with scanf, e.g. int n; scanf("%d", &n); */
    /* Write your solution here and print the answer. */

    return 0;
}
`,
};
