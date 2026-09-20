import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { Glass, GlassLink, Figure } from './glass';
import { Plate, Meter, Label } from './surface';
import { cn } from '@/lib/utils';

/* ───────────────────────────────────────────────────────────────────────────
   Desk furniture

   The pieces every desk is assembled from. A desk page should read as a
   composition of these and almost nothing else — that is what keeps four
   different rooms feeling like one building.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * The hero.
 *
 * One ceremonial panel at the top of every desk: who you are, what the desk
 * is, and the single number that says whether anything needs you. The big
 * figure on the right is the whole point — it answers the question the reader
 * arrived with before they have read a word.
 */
export function DeskHero({
  eyebrow,
  eyebrowIcon,
  greeting,
  statement,
  figure,
  children,
}: {
  eyebrow: string;
  eyebrowIcon: LucideIcon;
  greeting: string;
  statement: React.ReactNode;
  /** The headline count, with its caption and tone. */
  figure?: { value: number | string; caption: string; tone?: 'gold' | 'default' };
  children?: React.ReactNode;
}) {
  return (
    <Glass ceremonial spotlight index={0} className="overflow-hidden p-7 sm:p-10">
      {/* A soft champagne bloom in the corner behind the type. Gives the
          ceremonial panel a light source the others do not have. */}
      <div
        className="from-champagne/22 pointer-events-none absolute -top-28 -right-24 size-80 rounded-full bg-radial to-transparent blur-2xl"
        aria-hidden
      />

      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-14">
        <div className="flex min-w-0 flex-col gap-4">
          <Label icon={eyebrowIcon} className="text-champagne">
            {eyebrow}
          </Label>
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-balance text-[color:var(--glass-ink)] sm:text-5xl lg:text-[3.4rem]">
            {greeting}
          </h1>
          <p className="max-w-[46ch] text-lg leading-relaxed text-[color:var(--glass-ink-soft)]">
            {statement}
          </p>
          {children ? <div className="mt-2 flex flex-wrap gap-3">{children}</div> : null}
        </div>

        {figure ? (
          <div className="flex shrink-0 items-end gap-5 lg:flex-col lg:items-end lg:gap-2">
            <Figure
              value={figure.value}
              gold={figure.tone === 'gold'}
              className="text-7xl sm:text-8xl lg:text-[7rem]"
            />
            <span className="vip-label pb-3 lg:pb-0 lg:text-right">{figure.caption}</span>
          </div>
        ) : null}
      </div>
    </Glass>
  );
}

/**
 * A stat tile.
 *
 * The unit the command centre is built from. Linked tiles lift; unlinked ones
 * sit still. `tone: 'attention'` only actually shows when the value is
 * non-zero — a red tile reading "0 reports" trains people to ignore red.
 */
export function StatTile({
  icon,
  label,
  value,
  note,
  href,
  tone = 'default',
  index,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  note?: string;
  href?: string;
  tone?: 'default' | 'attention' | 'gold';
  index?: number;
}) {
  const hot = tone === 'attention' && Number(value) > 0;
  const plate = hot ? 'alert' : tone === 'gold' ? 'gold' : 'default';

  const body = (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex items-start justify-between gap-3">
        <Plate icon={icon} size="sm" tone={plate} />
        {href ? (
          <ArrowUpRight
            className="size-4 translate-y-1 text-[color:var(--glass-ink-quiet)] opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
            aria-hidden
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1.5">
        <Figure
          value={value}
          gold={tone === 'gold'}
          className={cn('text-4xl', hot && 'vip-figure-alert')}
        />
        <span className="vip-label text-[10px] leading-relaxed">{label}</span>
        {note ? (
          <span className="text-xs leading-relaxed text-[color:var(--glass-ink-quiet)]">
            {note}
          </span>
        ) : null}
      </div>
    </div>
  );

  return href ? (
    <GlassLink href={href} index={index}>
      {body}
    </GlassLink>
  ) : (
    <Glass index={index} spotlight>
      {body}
    </Glass>
  );
}

/**
 * A queue row.
 *
 * The count leads, because the reader is scanning for the one that is not
 * zero. A row with nothing in it visibly recedes rather than being hidden:
 * a cleared queue is information too.
 */
export function QueueRow({
  href,
  icon,
  label,
  note,
  count,
  index,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  note: string;
  count: number;
  index?: number;
}) {
  const waiting = count > 0;

  return (
    <GlassLink
      href={href}
      index={index}
      tone={waiting ? 'default' : 'quiet'}
      className={cn(!waiting && 'opacity-72')}
    >
      <div className="flex items-center gap-5 p-5 sm:gap-6 sm:p-6">
        <span
          className={cn(
            'vip-plate flex size-14 shrink-0 flex-col items-center justify-center',
            waiting && 'vip-plate-gold',
          )}
        >
          <span
            className={cn(
              'font-display text-2xl tabular-nums',
              waiting ? 'text-champagne' : 'text-[color:var(--glass-ink-quiet)]',
            )}
          >
            {count}
          </span>
        </span>

        <Plate
          icon={icon}
          size="sm"
          tone={waiting ? 'default' : 'default'}
          className="hidden sm:inline-flex"
        />

        <span className="flex min-w-0 flex-col gap-1">
          <span className="font-display text-lg leading-tight text-[color:var(--glass-ink)]">
            {label}
          </span>
          <span className="text-sm leading-relaxed text-[color:var(--glass-ink-quiet)]">
            {note}
          </span>
        </span>

        <ChevronRight
          className="ml-auto size-5 shrink-0 -translate-x-1 text-[color:var(--glass-ink-quiet)] opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden
        />
      </div>
    </GlassLink>
  );
}

/**
 * A progress row: a named thing with a completion meter.
 *
 * Used for a judge's categories, and for anything else that is part-done.
 */
export function ProgressRow({
  title,
  done,
  total,
  action,
  caption,
  index,
}: {
  title: string;
  done: number;
  total: number;
  action?: React.ReactNode;
  caption?: string;
  index?: number;
}) {
  return (
    <Glass spotlight index={index} className="p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span className="font-display text-lg leading-tight text-[color:var(--glass-ink)]">
          {title}
        </span>
        {action}
      </div>
      <div className="flex items-center gap-4">
        <Meter value={done} total={total} className="flex-1" />
        <span className="vip-label w-14 shrink-0 text-right text-[10px] tabular-nums">
          {done}/{total}
        </span>
      </div>
      {caption ? (
        <p className="mt-3 text-xs text-[color:var(--glass-ink-quiet)]">{caption}</p>
      ) : null}
    </Glass>
  );
}

/** A side panel: icon, title, prose, and usually one thing to do. */
export function SidePanel({
  icon,
  title,
  tone = 'default',
  badge,
  children,
  index,
  parallax,
}: {
  icon: LucideIcon;
  title: string;
  tone?: 'default' | 'gold' | 'alert' | 'live';
  badge?: React.ReactNode;
  children: React.ReactNode;
  index?: number;
  /** Drifts slightly against the scroll. For sidebar furniture only. */
  parallax?: boolean;
}) {
  return (
    <Glass
      spotlight
      index={index}
      ceremonial={tone === 'gold'}
      className={cn('p-6', parallax && 'vip-parallax')}
    >
      <div className="mb-4 flex items-center gap-3">
        <Plate icon={icon} size="sm" tone={tone} />
        <h3 className="font-display text-base text-[color:var(--glass-ink)]">{title}</h3>
        {badge ? <span className="ml-auto">{badge}</span> : null}
      </div>
      <div className="text-sm leading-relaxed text-[color:var(--glass-ink-soft)]">{children}</div>
    </Glass>
  );
}

/**
 * The activity stream.
 *
 * A vertical rail with a node per entry, rather than a table. The rail is
 * what makes a list of audit rows read as a chronology.
 */
export function Stream({
  entries,
}: {
  entries: { id: string; when: string; title: string; detail: string }[];
}) {
  return (
    <ol className="relative flex flex-col">
      <span
        className="absolute top-2 bottom-2 left-[0.3125rem] w-px bg-gradient-to-b from-transparent via-[color:var(--glass-rim-soft)] to-transparent"
        aria-hidden
      />
      {entries.map((entry, i) => (
        <li
          key={entry.id}
          className="vip-reveal-soft relative flex gap-5 py-3.5 pl-6"
          style={{ ['--i' as string]: i } as React.CSSProperties}
        >
          <span
            className="bg-champagne/70 ring-champagne/15 absolute top-[1.35rem] left-0 size-2.5 rounded-full ring-4"
            aria-hidden
          />
          <span className="vip-label w-20 shrink-0 pt-0.5 text-[10px]">{entry.when}</span>
          <span className="flex min-w-0 flex-col gap-1">
            <span className="text-sm font-medium text-[color:var(--glass-ink)]">{entry.title}</span>
            <span className="text-xs leading-relaxed text-[color:var(--glass-ink-quiet)]">
              {entry.detail}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** A quiet call to action rendered as glass. */
export function GlassButton({
  href,
  icon: Icon,
  children,
  tone = 'default',
  className,
}: {
  href: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  tone?: 'default' | 'gold';
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'vip-glass vip-lift vip-sheen group inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-sm font-medium',
        'focus-visible:outline-champagne focus-visible:outline-2 focus-visible:outline-offset-2',
        tone === 'gold' ? 'vip-rim-gold text-champagne' : 'text-[color:var(--glass-ink)]',
        className,
      )}
    >
      <span className="vip-sheen-band" aria-hidden />
      {Icon ? (
        <Icon
          className="size-4 transition-transform duration-500 group-hover:scale-110"
          strokeWidth={1.75}
        />
      ) : null}
      {children}
    </Link>
  );
}

/** An empty state that still looks like something. */
export function GlassEmpty({
  icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <Glass tone="quiet" className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      <Plate icon={icon} size="lg" />
      <h3 className="font-display mt-1 text-lg text-[color:var(--glass-ink)]">{title}</h3>
      <p className="max-w-[46ch] text-sm leading-relaxed text-[color:var(--glass-ink-quiet)]">
        {description}
      </p>
    </Glass>
  );
}

/** An inline alert on glass. */
export function GlassNotice({
  icon,
  tone = 'gold',
  children,
}: {
  icon: LucideIcon;
  tone?: 'gold' | 'alert' | 'live';
  children: React.ReactNode;
}) {
  return (
    <Glass
      tone="quiet"
      className={cn(
        'flex items-center gap-4 p-4 ring-1 ring-inset',
        tone === 'gold' && 'ring-champagne/25',
        tone === 'alert' && 'ring-oxblood/25',
        tone === 'live' && 'ring-laurel/25',
      )}
    >
      <Plate icon={icon} size="sm" tone={tone} />
      <div className="text-sm leading-relaxed text-[color:var(--glass-ink-soft)]">{children}</div>
    </Glass>
  );
}
