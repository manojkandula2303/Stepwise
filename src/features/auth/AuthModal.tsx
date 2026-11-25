import { useState, type FormEvent } from 'react';
import { actions } from '../../lib/store';
import { Button, Modal } from '../../components/ui';

export function AuthModal({ mode, onClose, onSwitch }: { mode: null | 'login' | 'signup'; onClose: () => void; onSwitch: (m: 'login' | 'signup') => void }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const signup = mode === 'signup';

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    if (signup && password.length < 8) return setError('Password must be at least 8 characters.');
    setBusy(true);
    try {
      await actions.signIn(signup ? 'signup' : 'login', { email, password, name });
      setPassword('');
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={!!mode} onClose={onClose} title={signup ? 'Create your account' : 'Welcome back'}>
      <p className="small muted" style={{ marginBottom: 20 }}>
        {signup ? 'Your progress, bookmarks and code are saved to your account and follow you across devices.' : 'Sign in to sync your progress across devices.'}
      </p>
      <form onSubmit={submit} className="col" style={{ gap: 14 }}>
        {signup && (
          <div className="field">
            <label htmlFor="au-name">Name</label>
            <input id="au-name" className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required maxLength={80} />
          </div>
        )}
        <div className="field">
          <label htmlFor="au-email">Email</label>
          <input id="au-email" className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required />
        </div>
        <div className="field">
          <label htmlFor="au-pw">Password</label>
          <input
            id="au-pw"
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={signup ? 'new-password' : 'current-password'}
            required
            minLength={signup ? 8 : undefined}
          />
          {signup && <span className="xs muted">At least 8 characters.</span>}
        </div>
        {error && (
          <div className="small" role="alert" style={{ color: 'var(--danger)' }}>
            {error}
          </div>
        )}
        <Button type="submit" variant="primary" size="lg" loading={busy} style={{ marginTop: 4 }}>
          {signup ? 'Create account' : 'Sign in'}
        </Button>
        <p className="small muted" style={{ textAlign: 'center' }}>
          {signup ? 'Already have an account? ' : 'New here? '}
          <button
            type="button"
            className="small"
            style={{ border: 0, background: 'none', color: 'var(--accent-text)', cursor: 'pointer', fontWeight: 500, padding: 0 }}
            onClick={() => {
              setError('');
              onSwitch(signup ? 'login' : 'signup');
            }}
          >
            {signup ? 'Sign in' : 'Create an account'}
          </button>
        </p>
        <p className="xs muted" style={{ textAlign: 'center' }}>
          Anything you did as a guest is merged into your account.
        </p>
      </form>
    </Modal>
  );
}
