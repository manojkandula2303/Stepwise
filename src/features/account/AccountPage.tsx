import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, CloudOff, Database, Download, HardDrive, RefreshCw, ShieldCheck, Trash2, Wifi, WifiOff } from 'lucide-react';
import { actions, useStore } from '../../lib/store';
import { api } from '../../lib/api';
import { Button, Modal, ProgressBar } from '../../components/ui';
import { openAuth } from '../../components/layout/AppShell';
import { getOfflineStatus, prepareOfflinePython, requestPersistentStorage, storageEstimate, type OfflineStatus } from '../../lib/offline';
import { usePythonStatus } from '../../lib/runner';
import { toast } from '../../lib/toast';

const LABELS: Record<string, string> = {
  progress: 'Completed lessons and topics',
  bookmarks: 'Bookmarks',
  problems: 'Problem progress',
  submissions: 'Code submissions',
  snippets: 'Saved compiler snippets',
  tests: 'Prep test attempts',
  codingTests: 'Infosys coding tests',
  documents: 'Drafts, editor buffers and assessments',
};

const fmt = (b: number) => (b < 1024 ? `${b} B` : b < 1024 * 1024 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1024 / 1024).toFixed(2)} MB`);

interface Usage {
  used: number;
  quota: number;
  categories: Record<string, { count: number; bytes: number }>;
}

export function AccountPage() {
  const user = useStore((s) => s.user);
  const offline = useStore((s) => s.offline);
  const pending = useStore((s) => s.pending);
  const navigate = useNavigate();
  const py = usePythonStatus();
  const [usage, setUsage] = useState<Usage | null>(null);
  const [usageError, setUsageError] = useState(false);
  const [sw, setSw] = useState<OfflineStatus | null>(null);
  const [device, setDevice] = useState<{ usage: number; quota: number } | null>(null);
  const [persisted, setPersisted] = useState<boolean | null>(null);
  const [del, setDel] = useState(false);
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user)
      api<Usage>('/account/storage').then(
        (u) => {
          setUsage(u);
          setUsageError(false);
        },
        () => setUsageError(true)
      );
    getOfflineStatus().then(setSw);
    storageEstimate().then(setDevice);
    navigator.storage?.persisted?.().then(setPersisted).catch(() => {});
  }, [user, pending, offline]);

  useEffect(() => {
    if (py === 'ready') getOfflineStatus().then(setSw);
  }, [py]);

  async function deleteAccount() {
    setBusy(true);
    try {
      await api('/account/delete', { body: { password: pw } });
      actions.forgetAccount();
      toast('Your account and all of its data were deleted.', 'success');
      navigate('/');
    } catch (e) {
      toast((e as Error).message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function prepare() {
    prepareOfflinePython();
    const p = await requestPersistentStorage();
    setPersisted(p);
    toast('Downloading the Python runtime for offline use…', 'info');
  }

  return (
    <div className="page page-narrow page-enter">
      <div className="page-head">
        <h1>Account &amp; storage</h1>
        <p className="muted">Where your data lives, how much space it uses, and what works without an internet connection.</p>
      </div>

      {user ? (
        <section className="acct-card">
          <div className="acct-card-head">
            <Database size={18} />
            <div className="grow">
              <h2>Your storage space</h2>
              <p className="small muted">
                {user.name} · {user.email}
                {user.createdAt ? ` · member since ${new Date(user.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}` : ''}
              </p>
            </div>
          </div>
          <p className="small">
            Every account has its own private space in the Stepwise database. Every record (progress, code, drafts, tests) is tied to your account, so no other user can read or change it, and deleting your account removes all of it.
          </p>
          {usage ? (
            <>
              <div className="row" style={{ justifyContent: 'space-between', margin: '14px 0 6px' }}>
                <strong className="small">{fmt(usage.used)} used</strong>
                <span className="xs muted">of {fmt(usage.quota)}</span>
              </div>
              <ProgressBar value={usage.used / usage.quota} label="Storage used" />
              <div className="acct-table">
                {Object.entries(usage.categories).map(([k, v]) => (
                  <div key={k} className="acct-row">
                    <span className="grow">{LABELS[k] || k}</span>
                    <span className="xs muted tabular">{v.count} item{v.count === 1 ? '' : 's'}</span>
                    <span className="xs tabular" style={{ width: 72, textAlign: 'right' }}>{fmt(v.bytes)}</span>
                  </div>
                ))}
              </div>
            </>
          ) : usageError || offline ? (
            <p className="small muted" style={{ marginTop: 12 }}>
              <CloudOff size={13} style={{ verticalAlign: -2 }} /> The server can't be reached, so live usage isn't available. Your data is safe in this device's copy of your account.
            </p>
          ) : (
            <div className="skeleton" style={{ height: 120, marginTop: 12 }} />
          )}
          <div className="row" style={{ gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <a className="btn btn-secondary" href="/api/account/export" download>
              <Download size={15} /> Export my data (JSON)
            </a>
            <Button variant="ghost" icon={<Trash2 />} onClick={() => setDel(true)} disabled={offline}>
              Delete account
            </Button>
          </div>
        </section>
      ) : (
        <section className="acct-card">
          <div className="acct-card-head">
            <Database size={18} />
            <div className="grow">
              <h2>You're using Stepwise as a guest</h2>
              <p className="small muted">Your progress is stored only in this browser.</p>
            </div>
          </div>
          <p className="small">Create an account to get your own private storage space on the server. Your progress then follows you to any device, and anything you've done as a guest is merged in.</p>
          <Button variant="primary" style={{ marginTop: 12 }} onClick={() => openAuth.current('signup')}>
            Create an account
          </Button>
        </section>
      )}

      <section className="acct-card">
        <div className="acct-card-head">
          {offline ? <WifiOff size={18} /> : <Wifi size={18} />}
          <div className="grow">
            <h2>Sync</h2>
            <p className="small muted">{offline ? 'Offline: changes are saved on this device.' : 'Online: changes are saved to the server as you go.'}</p>
          </div>
          {user && (
            <Button size="sm" variant="secondary" icon={<RefreshCw />} disabled={!pending} onClick={() => actions.syncNow().then((ok) => toast(ok ? 'Everything is synced.' : 'Still offline. Will retry automatically.', ok ? 'success' : 'info'))}>
              Sync now
            </Button>
          )}
        </div>
        <ul className="acct-list small">
          <li>{user ? (pending ? `${pending} change(s) waiting to be sent to the server.` : 'All changes are synced.') : 'Sign in to sync across devices.'}</li>
          <li>Changes made offline are kept in order and sent automatically when the connection returns.</li>
          <li>Signing out removes this account's copy from the device. If unsynced changes exist, you're asked first.</li>
        </ul>
      </section>

      <section className="acct-card">
        <div className="acct-card-head">
          <HardDrive size={18} />
          <div className="grow">
            <h2>Offline use</h2>
            <p className="small muted">Install Stepwise from your browser's menu (Install app / Add to Home Screen) to use it like a native app.</p>
          </div>
        </div>
        <div className="acct-table">
          <div className="acct-row">
            <span className="grow">App, lessons, problems, prep and Infosys content</span>
            {sw?.active ? (
              <span className="xs tabular" style={{ color: 'var(--success)' }}>
                <Check size={12} style={{ verticalAlign: -2 }} /> {sw.appFiles}/{sw.total} files cached
              </span>
            ) : (
              <span className="xs muted">{sw?.supported === false ? 'Not supported by this browser' : import.meta.env.DEV ? 'Enabled in the production build' : 'Preparing…'}</span>
            )}
          </div>
          <div className="acct-row">
            <span className="grow">Run Python offline</span>
            {sw?.python || py === 'ready' ? (
              <span className="xs" style={{ color: 'var(--success)' }}>
                <Check size={12} style={{ verticalAlign: -2 }} /> Ready
              </span>
            ) : (
              <Button size="sm" variant="secondary" loading={py === 'loading'} onClick={prepare}>
                Prepare for offline
              </Button>
            )}
          </div>
          <div className="acct-row">
            <span className="grow">Run Java, C and C++</span>
            <span className="xs muted">Needs the Stepwise server</span>
          </div>
          <div className="acct-row">
            <span className="grow">Protected from automatic browser cleanup</span>
            <span className="xs muted">{persisted ? 'Yes' : persisted === false ? 'Not yet (allowed after installing or frequent use)' : 'Unknown'}</span>
          </div>
          {device && (
            <div className="acct-row">
              <span className="grow">Space used on this device</span>
              <span className="xs tabular">{fmt(device.usage)}</span>
            </div>
          )}
        </div>
      </section>

      <p className="xs muted row" style={{ gap: 6 }}>
        <ShieldCheck size={13} /> Passwords are hashed with scrypt; sessions use HttpOnly cookies. Code you run is executed in an isolated sandbox.
      </p>

      <Modal open={del} onClose={() => setDel(false)} title="Delete your account?">
        <p className="small">This permanently deletes your account and everything stored in it: progress, submissions, snippets, drafts and test results. This can't be undone. Consider exporting your data first.</p>
        <label className="field" style={{ marginTop: 12 }}>
          <span className="small">Confirm with your password</span>
          <input className="input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoComplete="current-password" />
        </label>
        <div className="row" style={{ justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          <Button variant="ghost" onClick={() => setDel(false)}>
            Cancel
          </Button>
          <Button variant="danger" loading={busy} disabled={!pw} onClick={deleteAccount}>
            Delete permanently
          </Button>
        </div>
      </Modal>
    </div>
  );
}
