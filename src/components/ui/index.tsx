import { useEffect, useLayoutEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, CircleAlert, CircleCheck, Info, X } from 'lucide-react';
import { useToasts } from '../../lib/toast';
import type { Difficulty as Diff } from '../../lib/types';

// ---------------- Button ----------------
type BtnVariant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  loading?: boolean;
  active?: boolean;
}
export function Button({ variant = 'secondary', size = 'md', icon, loading, active, className = '', children, disabled, ...rest }: BtnProps) {
  const cls = ['btn', `btn-${variant}`, size !== 'md' && `btn-${size}`, !children && 'btn-icon', active && 'is-active', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} disabled={disabled || loading} {...rest}>
      {loading ? <span className="spinner" /> : icon}
      {children}
    </button>
  );
}

export function IconButton({ label, tip = true, ...p }: BtnProps & { label: string; tip?: boolean }) {
  const b = <Button variant="ghost" aria-label={label} {...p} />;
  return tip ? <Tooltip label={label}>{b}</Tooltip> : b;
}

// ---------------- Tooltip ----------------
export function Tooltip({ label, children, below }: { label: string; children: ReactNode; below?: boolean }) {
  return (
    <span className={`tip${below ? ' below' : ''}`}>
      {children}
      <span className="tip-bubble" role="tooltip">
        {label}
      </span>
    </span>
  );
}

// ---------------- Segmented control ----------------
export interface SegOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}
export function Segmented<T extends string>({ options, value, onChange, size, label }: { options: SegOption<T>[]; value: T; onChange: (v: T) => void; size?: 'sm'; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState<{ x: number; w: number } | null>(null);
  useLayoutEffect(() => {
    const el = ref.current?.querySelector<HTMLButtonElement>(`button[aria-checked="true"]`);
    if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth });
  }, [value, options.length]);
  return (
    <div className={`seg${size ? ' seg-sm' : ''}`} role="radiogroup" aria-label={label} ref={ref}>
      {ind && <span className="seg-indicator" style={{ width: ind.w, transform: `translateX(${ind.x - 0}px)` }} />}
      {options.map((o) => (
        <button
          key={o.value}
          role="radio"
          aria-checked={o.value === value}
          disabled={o.disabled}
          onClick={() => onChange(o.value)}
          onKeyDown={(e) => {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            const enabled = options.filter((x) => !x.disabled);
            const i = enabled.findIndex((x) => x.value === value);
            const n = enabled[(i + (e.key === 'ArrowRight' ? 1 : enabled.length - 1)) % enabled.length];
            onChange(n.value);
            (e.currentTarget.parentElement?.querySelector(`button:nth-of-type(${options.indexOf(n) + 1})`) as HTMLElement)?.focus();
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ---------------- Tabs ----------------
export function Tabs<T extends string>({ tabs, value, onChange, className = '' }: { tabs: { value: T; label: ReactNode; icon?: ReactNode }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={`tabs ${className}`} role="tablist">
      {tabs.map((t) => (
        <button key={t.value} className="tab" role="tab" aria-selected={t.value === value} onClick={() => onChange(t.value)}>
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ---------------- Badges ----------------
export function Badge({ tone, children, icon }: { tone?: 'success' | 'danger' | 'warning' | 'accent'; children: ReactNode; icon?: ReactNode }) {
  return (
    <span className={`badge ${tone || ''}`}>
      {icon}
      {children}
    </span>
  );
}
export function DifficultyLabel({ value }: { value: Diff }) {
  return <span className={`diff diff-${value.toLowerCase()}`}>{value}</span>;
}

// ---------------- Progress ----------------
export function ProgressBar({ value, tone, label }: { value: number; tone?: 'accent' | 'success'; label?: string }) {
  const pct = Math.max(0, Math.min(100, value * 100));
  return (
    <div className={`progress ${tone || ''}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div style={{ width: `${pct}%` }} />
    </div>
  );
}
export function ProgressRing({ value, size = 40, stroke = 3.5, color = 'var(--text)', children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const [shown, setShown] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value));
    return () => cancelAnimationFrame(id);
  }, [value]);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg className="ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-active)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, shown))} />
      </svg>
      {children && <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>{children}</div>}
    </div>
  );
}

// ---------------- Modal ----------------
export function Modal({ open, onClose, title, children, width }: { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    setTimeout(() => ref.current?.querySelector<HTMLElement>('input, button:not([aria-label="Close"])')?.focus(), 30);
    return () => {
      document.removeEventListener('keydown', onKey);
      prev?.focus?.();
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title} ref={ref} style={width ? { maxWidth: width } : undefined}>
        <div className="modal-head">
          <h2>{title}</h2>
          <IconButton label="Close" tip={false} size="sm" icon={<X />} onClick={onClose} />
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}

// ---------------- Dropdown menu ----------------
export interface MenuItem {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  checked?: boolean;
  separator?: boolean;
  heading?: boolean;
  danger?: boolean;
}
export function Menu({ trigger, items, align = 'right' }: { trigger: (p: { open: boolean; toggle: () => void }) => ReactNode; items: MenuItem[]; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', key);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', key);
    };
  }, [open]);
  return (
    <div className="menu-wrap" ref={ref}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div className={`menu ${align}`} role="menu">
          {items.map((it, i) =>
            it.separator ? (
              <div key={i} className="menu-sep" />
            ) : it.heading ? (
              <div key={i} className="menu-label">
                {it.label}
              </div>
            ) : (
              <button
                key={i}
                role="menuitem"
                className={`menu-item${it.danger ? ' btn-danger' : ''}`}
                onClick={() => {
                  setOpen(false);
                  it.onSelect?.();
                }}
              >
                {it.icon}
                {it.label}
                {it.checked && <Check className="check" />}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}

/** Compact select built on Menu so it matches the rest of the UI. */
export function Select<T extends string>({ value, options, onChange, label, size = 'sm' }: { value: T; options: { value: T; label: string; icon?: ReactNode }[]; onChange: (v: T) => void; label: string; size?: 'sm' | 'md' }) {
  const cur = options.find((o) => o.value === value);
  return (
    <Menu
      align="left"
      trigger={({ toggle, open }) => (
        <Button size={size} variant="secondary" onClick={toggle} aria-haspopup="menu" aria-expanded={open} aria-label={label}>
          {cur?.icon}
          {cur?.label ?? label}
          <ChevronDown style={{ marginLeft: 2, opacity: 0.6 }} />
        </Button>
      )}
      items={options.map((o) => ({ label: o.label, icon: o.icon, checked: o.value === value, onSelect: () => onChange(o.value) }))}
    />
  );
}

// ---------------- Collapsible ----------------
export function Collapsible({ title, icon, children, defaultOpen = false }: { title: ReactNode; icon?: ReactNode; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="collapse" data-open={open}>
      <button className="collapse-head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {icon}
        {title}
        <ChevronDown className="chev" />
      </button>
      <div className="collapse-body">
        <div>
          <div className="collapse-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}

// ---------------- Empty state ----------------
export function EmptyState({ icon, title, children, action }: { icon?: ReactNode; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="empty">
      {icon}
      <strong>{title}</strong>
      {children && <div>{children}</div>}
      {action && <div style={{ marginTop: 8 }}>{action}</div>}
    </div>
  );
}

// ---------------- Toasts ----------------
export function Toaster() {
  const items = useToasts();
  return createPortal(
    <div className="toasts" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`toast ${t.kind}`}>
          {t.kind === 'success' ? <CircleCheck /> : t.kind === 'error' ? <CircleAlert /> : <Info />}
          <span>{t.message}</span>
        </div>
      ))}
    </div>,
    document.body
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return <kbd className="kbd">{children}</kbd>;
}

export function useMediaQuery(q: string) {
  const [m, setM] = useState(() => matchMedia(q).matches);
  useEffect(() => {
    const mq = matchMedia(q);
    const f = () => setM(mq.matches);
    mq.addEventListener('change', f);
    return () => mq.removeEventListener('change', f);
  }, [q]);
  return m;
}
export const useIsMobile = () => useMediaQuery('(max-width: 767px)');
