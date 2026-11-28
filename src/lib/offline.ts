/**
 * Offline support: registers the service worker (production builds only) and reports what is
 * available without a network connection.
 *
 * What works offline after the first visit:
 *  - the whole app, every lesson, problem, prep topic and Infosys problem (precached)
 *  - your data: each signed-in account has its own cache on this device, and changes are queued
 *    and synced when the server is reachable again
 *  - running Python (Pyodide runs in the browser; cached after first use or via prepareOffline())
 * What needs the server: running Java, C and C++, and signing in for the first time on a device.
 */
import { toast } from './toast';
import { warmPython } from './runner';

export function registerServiceWorker() {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        reg.addEventListener('updatefound', () => {
          const sw = reg.installing;
          sw?.addEventListener('statechange', () => {
            if (sw.state === 'activated' && hadController) toast('Stepwise was updated. Reload the page to get the latest version.', 'info', 6000);
            if (sw.state === 'activated' && !hadController) toast('Stepwise is ready to work offline.', 'success', 4000);
          });
        });
      })
      .catch(() => {
        /* offline support is optional */
      });
  });
}

export interface OfflineStatus {
  supported: boolean;
  active: boolean;
  appFiles: number;
  total: number;
  python: boolean;
  version?: string;
}

export async function getOfflineStatus(): Promise<OfflineStatus> {
  const none = { supported: 'serviceWorker' in navigator, active: false, appFiles: 0, total: 0, python: false };
  if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) return none;
  const ctl = navigator.serviceWorker.controller;
  return new Promise((resolve) => {
    const ch = new MessageChannel();
    const timer = setTimeout(() => resolve(none), 2000);
    ch.port1.onmessage = (e) => {
      clearTimeout(timer);
      resolve({ supported: true, active: true, ...e.data });
    };
    ctl.postMessage({ type: 'status' }, [ch.port2]);
  });
}

/** Download the Python runtime now so Python code runs offline later. */
export function prepareOfflinePython() {
  warmPython();
}

/** Ask the browser not to evict this site's storage under pressure. */
export async function requestPersistentStorage() {
  try {
    return (await navigator.storage?.persist?.()) ?? false;
  } catch {
    return false;
  }
}

export async function storageEstimate() {
  try {
    const e = await navigator.storage?.estimate?.();
    return e ? { usage: e.usage || 0, quota: e.quota || 0 } : null;
  } catch {
    return null;
  }
}
