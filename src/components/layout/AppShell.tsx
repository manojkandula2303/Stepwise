import { useEffect, useState, type ReactNode } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BookOpen, Code2, GraduationCap, LayoutGrid, ListChecks, LogIn, LogOut, Moon, PanelLeftClose, PanelLeftOpen, Sun, Target, User as UserIcon } from 'lucide-react';
import { actions, useStore } from '../../lib/store';
import { Button, IconButton, Menu, Tooltip } from '../ui';
import { AuthModal } from '../../features/auth/AuthModal';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutGrid, end: true },
  { to: '/learn', label: 'Learn', icon: BookOpen },
  { to: '/practice', label: 'Practice', icon: Target },
  { to: '/lc150', label: 'LeetCode 150', short: 'LC 150', icon: ListChecks },
  { to: '/prep', label: 'Placement Prep', short: 'Prep', icon: GraduationCap },
  { to: '/compiler', label: 'Compiler', icon: Code2 },
];

export function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden>
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 12.5h3.5V9h3.5V5.5h4" />
      </svg>
    </span>
  );
}

export function ThemeToggle() {
  const theme = useStore((s) => s.prefs.theme || 'light');
  const next = theme === 'dark' ? 'light' : 'dark';
  return <IconButton label={`Switch to ${next} theme`} icon={theme === 'dark' ? <Sun /> : <Moon />} onClick={() => actions.setTheme(next)} />;
}

export const openAuth = { current: (_mode?: 'login' | 'signup') => {} };

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function AccountControl({ compact }: { compact?: boolean }) {
  const user = useStore((s) => s.user);
  if (!user)
    return compact ? (
      <Button size="sm" variant="secondary" icon={<LogIn />} onClick={() => openAuth.current('login')}>
        Sign in
      </Button>
    ) : (
      <button className="account-btn" onClick={() => openAuth.current('login')}>
        <span className="avatar">
          <UserIcon size={13} />
        </span>
        <span className="hide-collapsed col" style={{ lineHeight: 1.25 }}>
          <span className="small" style={{ fontWeight: 500 }}>
            Sign in
          </span>
          <span className="xs muted">Sync your progress</span>
        </span>
      </button>
    );
  return (
    <Menu
      align={compact ? 'right' : 'left'}
      trigger={({ toggle }) =>
        compact ? (
          <button className="account-btn" style={{ width: 'auto', padding: '0 6px' }} onClick={toggle} aria-label="Account">
            <span className="avatar">{initials(user.name)}</span>
          </button>
        ) : (
          <button className="account-btn" onClick={toggle}>
            <span className="avatar">{initials(user.name)}</span>
            <span className="hide-collapsed col grow" style={{ lineHeight: 1.25 }}>
              <span className="small truncate" style={{ fontWeight: 500 }}>
                {user.name}
              </span>
              <span className="xs muted truncate">{user.email}</span>
            </span>
          </button>
        )
      }
      items={[{ label: user.email, heading: true }, { label: 'Sign out', icon: <LogOut />, onSelect: actions.signOut }]}
    />
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sw-sidebar') === '1';
    } catch {
      return false;
    }
  });
  const [auth, setAuth] = useState<null | 'login' | 'signup'>(null);
  const loc = useLocation();
  openAuth.current = (m = 'login') => setAuth(m);
  const focus = /^\/((practice|lc150)\/[^/]+|prep\/test\/)/.test(loc.pathname);

  useEffect(() => {
    try {
      localStorage.setItem('sw-sidebar', collapsed ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [collapsed]);

  return (
    <div className={`shell${focus ? ' focus-mode' : ''}`} data-collapsed={collapsed}>
      <aside className="sidebar" aria-label="Main navigation">
        <div className="brand">
          <BrandMark />
          <span className="brand-name">Stepwise</span>
        </div>
        <nav className="nav">
          {NAV.map(({ to, label, icon: Icon, end }) => {
            const link = (
              <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
                <Icon />
                <span className="nav-label">{label}</span>
              </NavLink>
            );
            return collapsed ? (
              <Tooltip key={to} label={label}>
                {link}
              </Tooltip>
            ) : (
              link
            );
          })}
        </nav>
        <div className="sidebar-foot">
          <div className="row" style={{ justifyContent: collapsed ? 'center' : 'space-between', flexDirection: collapsed ? 'column' : 'row' }}>
            <ThemeToggle />
            <IconButton label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} icon={collapsed ? <PanelLeftOpen /> : <PanelLeftClose />} onClick={() => setCollapsed((c) => !c)} />
          </div>
          <AccountControl />
        </div>
      </aside>

      <div className="main">
        <header className="topbar">
          <div className="brand">
            <BrandMark />
            <span>Stepwise</span>
          </div>
          <div className="row" style={{ gap: 4 }}>
            <ThemeToggle />
            <AccountControl compact />
          </div>
        </header>
        <div className="main-scroll" id="main-scroll">
          {children}
        </div>
        <nav className="tabbar" aria-label="Main navigation">
          {NAV.map(({ to, label, short, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}>
              <Icon />
              <span>{short || label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <AuthModal mode={auth} onClose={() => setAuth(null)} onSwitch={setAuth} />
    </div>
  );
}
