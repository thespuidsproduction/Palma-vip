import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ───────────────────────────────────────────────────────────────────────────
   PALMA VIP — the CSS-only primitives

   Everything in here is a surface and nothing in here is interactive: the
   plates, labels, chips, meters and rules are pure markup over the rules in
   `vip.css`. That is why this file has no `'use client'` — and why it must
   not get one.

   The split is load-bearing rather than tidiness. A Lucide icon is a function
   component, and a function cannot be serialised across the server/client
   boundary: the moment a component that takes an `icon` prop becomes a client
   component, every server page that passes it one fails to render. The pieces
   that genuinely need the browser — pointer tracking, the counting figure —
   live in `glass.tsx` and take only serialisable props.
   ─────────────────────────────────────────────────────────────────────────── */

/** An icon on a lit plate. Never render a bare icon on glass. */
export function Plate({
  icon: Icon,
  tone = 'default',
  size = 'md',
  className,
}: {
  icon: LucideIcon;
  tone?: 'default' | 'gold' | 'alert' | 'live';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const box = size === 'sm' ? 'size-9' : size === 'lg' ? 'size-14' : 'size-11';
  const glyph = size === 'sm' ? 'size-4' : size === 'lg' ? 'size-6' : 'size-5';
  const ink =
    tone === 'gold'
      ? 'text-champagne'
      : tone === 'alert'
        ? 'text-oxblood'
        : tone === 'live'
          ? 'text-laurel'
          : 'text-[color:var(--glass-ink-soft)]';

  return (
    <span
      className={cn(
        'vip-plate shrink-0',
        box,
        tone === 'gold' && 'vip-plate-gold',
        tone === 'alert' && 'vip-plate-alert',
        tone === 'live' && 'vip-plate-live',
        className,
      )}
    >
      <Icon className={cn(glyph, ink)} strokeWidth={1.75} />
    </span>
  );
}

/** A glass progress track. */
export function Meter({
  value,
  total,
  className,
}: {
  value: number;
  total: number;
  className?: string;
}) {
  const pct = Math.min(100, Math.round((value / Math.max(1, total)) * 100));
  const complete = value >= total && total > 0;

  return (
    <div
      className={cn('vip-meter', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={total}
    >
      <div
        className="vip-meter-fill"
        data-complete={complete || undefined}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** A pulsing status dot, for anything the system considers current. */
export function Pulse({ tone = 'live' }: { tone?: 'live' | 'gold' | 'alert' }) {
  return <span className="vip-pulse" data-tone={tone === 'live' ? undefined : tone} aria-hidden />;
}

/** The small-caps annotation used above every panel title. */
export function Label({
  children,
  className,
  icon: Icon,
}: {
  children: React.ReactNode;
  className?: string;
  icon?: LucideIcon;
}) {
  return (
    <span className={cn('vip-label inline-flex items-center gap-2', className)}>
      {Icon ? <Icon className="size-3.5" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

/** A glass pill. Status, counts, tags. */
export function Chip({
  children,
  tone = 'default',
  className,
}: {
  children: React.ReactNode;
  tone?: 'default' | 'gold' | 'alert' | 'live';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'vip-glass-quiet inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap',
        tone === 'gold' && 'text-champagne ring-champagne/30 ring-1 ring-inset',
        tone === 'alert' && 'text-oxblood ring-oxblood/30 ring-1 ring-inset',
        tone === 'live' && 'text-laurel ring-laurel/30 ring-1 ring-inset',
        tone === 'default' && 'text-[color:var(--glass-ink-soft)]',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** A section heading with its icon plate and a hairline that fades out. */
export function SectionHead({
  icon,
  title,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('mb-5 flex flex-wrap items-center gap-4', className)}>
      <Plate icon={icon} size="sm" />
      <h2 className="font-display text-xl tracking-tight text-[color:var(--glass-ink)]">{title}</h2>
      <hr className="vip-divider hidden min-w-8 flex-1 sm:block" />
      {action}
    </div>
  );
}

/** The aurora ground and its grain. One per desk, behind everything. */
export function VipBackdrop() {
  return (
    <>
      <div className="vip-aurora" aria-hidden />
      <div className="vip-grain" aria-hidden />
    </>
  );
}

/** The document-scroll progress hairline, pinned under the chrome. */
export function ScrollRail() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-px overflow-hidden"
      aria-hidden
    >
      <div className="vip-progress-rail via-champagne h-full w-full bg-gradient-to-r from-transparent to-transparent" />
    </div>
  );
}
