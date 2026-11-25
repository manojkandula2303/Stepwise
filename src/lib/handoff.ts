import type { NavigateFunction } from 'react-router-dom';
import type { CodeLang } from './types';

const KEY = 'sw-handoff';

/** Pass code from a lesson to the compiler or visualizer without putting it in the URL. */
export function openInTool(navigate: NavigateFunction, tool: 'compiler' | 'visualize', lang: CodeLang, code: string, stdin = '') {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ lang, code, stdin, at: Date.now() }));
  } catch {
    /* ignore */
  }
  navigate(tool === 'compiler' ? '/compiler?from=lesson' : '/visualize');
}

export function takeHandoff(): { lang: CodeLang; code: string; stdin: string } | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    sessionStorage.removeItem(KEY);
    const d = JSON.parse(raw);
    return Date.now() - d.at < 60_000 ? d : null;
  } catch {
    return null;
  }
}
