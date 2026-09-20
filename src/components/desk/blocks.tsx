import type { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { Card, CardLink, Glyph, Label, Tag, Meter, Ring, Kinetic } from './surface';
import { Counter } from './motion';
import { cn } from '@/lib/utils';

/* ───────────────────────────────────────────────────────────────────────────
   Desk blocks

   The composed pieces a desk is assembled from. A desk page should read as
   an arrangement of these and almost nothing else — that is what keeps four
   different rooms feeling like one building.
   ─────────────────────────────────────────────────────────────────────────── */

/**
 * The masthead.
 *
 * Who you are, what the desk is, and the one number that says whether
 * anything needs you — answered before the reader has read a word. The
 * number is repeated enormous and nearly invisible behind the card, which
 * gives the panel a subject and a sense of scale without adding information.
 */
export function Masthead({
  eyebrow,
  eyebrowIcon,
  title,
  statement,
  figure,
  aside,
  children,
}: {
  eyebrow: string;
  eyebrowIcon: LucideIcon;
  title: string;
  statement: React.ReactNode;
  figure?: { value: number; caption: string; tone?: 'accent' | 'neutral' };
  /** A dial or similar, in place of the plain figure. */
  aside?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <Card elevation="primary" index={0} className="p-6 sm:p-8">
      {/* Only when the plain figure is on show. With a dial in its place the
          watermark has nothing to echo, and becomes a smudge behind it. */}
      {figure && !aside ? (
        <span className="watermark" aria-hidden>
          {figure.value}
        </span>
      ) : null}

      <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="flex min-w-0 flex-col gap-3">
          <Label icon={eyebrowIcon} className="text-[color:var(--accent)]">
            {eyebrow}
          </Label>
          <h1 className="font-display text-[2rem] leading-[1.08] tracking-tight text-balance text-[color:var(--text)] sm:text-[2.6rem]">
            <Kinetic text={title} />
          </h1>
          <p className="max-w-[52ch] leading-relaxed text-[color:var(--text-soft)]">{statement}</p>
          {children ? (
            <div className="mt-3 flex flex-wrap items-center gap-2.5">{children}</div>
          ) : null}
        </div>

        {aside ??
          (figure ? (
            <div className="flex shrink-0 items-baseline gap-4 lg:flex-col lg:items-end lg:gap-1">
              <Counter
                value={figure.value}
                className={cn(
                  'figure text-6xl sm:text-7xl',
                  figure.tone !== 'neutral' && 'figure-accent',
                )}
              />
              <span className="label lg:text-right">{figure.caption}</span>
            </div>
          ) : null)}
      </div>
    </Card>
  );
}

/**
 * A figure on a card.
 *
 * The unit the command centre is built from. Linked tiles lift; unlinked
 * ones sit still. `attention` only shows when the value is non-zero — a red
 * tile reading "0 reports" teaches people to ignore red.
 */
export function Stat({
  icon,
  label,
  value,
  note,
  href,
  tone = 'neutral',
  index,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: number | string;
  note?: string;
  href?: string;
  tone?: 'neutral' | 'attention' | 'accent';
  index?: number;
  className?: string;
}) {
  const hot = tone === 'attention' && Number(value) > 0;
  const glyphTone = hot ? 'alert' : tone === 'accent' ? 'accent' : 'neutral';

  const body = (
    <div className="flex h-full flex-col justify-between gap-5 p-4">
      <div className="flex items-start justify-between gap-3">
        <Glyph icon={icon} size="sm" tone={glyphTone} />
        {href ? (
          <ArrowUpRight
            className="size-3.5 translate-y-0.5 text-[color:var(--text-quiet)] opacity-0 transition-all duration-400 group-hover:translate-y-0 group-hover:opacity-100"
            aria-hidden
          />
        ) : null}
      </div>
      <div className="flex flex-col gap-1">
        <Counter
          value={value}
          className={cn(
            'figure text-[1.9rem]',
            hot && 'figure-attention',
            tone === 'accent' && !hot && 'figure-accent',
          )}
        />
        <span className="label text-[10px] leading-snug">{label}</span>
        {note ? (
          <span className="text-[0.6875rem] leading-relaxed text-[color:var(--text-quiet)]">
            {note}
          </span>
        ) : null}
      </div>
    </div>
  );

  return href ? (
    <CardLink href={href} index={index} className={className}>
      {body}
    </CardLink>
  ) : (
    <Card index={index} className={className}>
      {body}
    </Card>
  );
}

/**
 * A queue row.
 *
 * The count leads, because the reader is scanning for the one that is not
 * zero. A cleared queue recedes rather than being hidden — that it is clear
 * is information too.
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
    <CardLink href={href} index={index} className={cn(!waiting && 'opacity-65')}>
      <div className="flex items-center gap-4 p-4 sm:gap-5">
        <span
          className={cn(
            'grid size-11 shrink-0 place-items-center rounded-[0.6rem] ring-1 ring-inset',
            waiting
              ? 'bg-[color:var(--accent-wash)] text-[color:var(--accent)] ring-[color:var(--accent)]/25'
              : 'bg-[color:var(--surface-0)] text-[color:var(--text-quiet)] ring-[color:var(--line)]',
          )}
        >
          <span className="font-display text-lg tabular-nums">{count}</span>
        </span>

        <Glyph icon={icon} size="sm" className="hidden sm:grid" />

        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="font-display text-[0.9375rem] leading-snug text-[color:var(--text)]">
            {label}
          </span>
          <span className="text-[0.8125rem] leading-relaxed text-[color:var(--text-quiet)]">
            {note}
          </span>
        </span>

        <ChevronRight
          className="ml-auto size-4 shrink-0 -translate-x-1 text-[color:var(--text-quiet)] opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100"
          aria-hidden
        />
      </div>
    </CardLink>
  );
}

/** A named thing with a completion meter. */
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
    <Card index={index} className="p-4 sm:p-5">
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
        <span className="font-display text-[0.9375rem] leading-snug text-[color:var(--text)]">
          {title}
        </span>
        {action}
      </div>
      <div className="flex items-center gap-3.5">
        <Meter value={done} total={total} className="flex-1" />
        <span className="label w-12 shrink-0 text-right text-[10px] tabular-nums">
          {done}/{total}
        </span>
      </div>
      {caption ? (
        <p className="mt-2.5 text-[0.6875rem] text-[color:var(--text-quiet)]">{caption}</p>
      ) : null}
    </Card>
  );
}

/** A side panel: glyph, title, prose, and usually one thing to do. */
export function Panel({
  icon,
  title,
  tone = 'neutral',
  badge,
  children,
  index,
  reveal,
  className,
}: {
  icon: LucideIcon;
  title: string;
  tone?: 'neutral' | 'accent' | 'positive' | 'alert';
  badge?: React.ReactNode;
  children: React.ReactNode;
  index?: number;
  reveal?: boolean;
  className?: string;
}) {
  return (
    <Card index={index} reveal={reveal} className={cn('p-5', className)}>
      <div className="mb-3 flex items-center gap-2.5">
        <Glyph icon={icon} size="sm" tone={tone} />
        <h3 className="font-display text-[0.9375rem] text-[color:var(--text)]">{title}</h3>
        {badge ? <span className="ml-auto">{badge}</span> : null}
      </div>
      <div className="text-[0.8125rem] leading-relaxed text-[color:var(--text-soft)]">
        {children}
      </div>
    </Card>
  );
}

/**
 * A dial with its reading.
 *
 * For the single proportion a card exists to show: a ring is read at a
 * glance where a bar has to be measured.
 */
export function Dial({
  value,
  total,
  caption,
  tone = 'accent',
  size = 116,
}: {
  value: number;
  total: number;
  caption: string;
  tone?: 'accent' | 'positive' | 'alert';
  size?: number;
}) {
  const pct = Math.round((value / Math.max(1, total)) * 100);

  return (
    <div className="flex shrink-0 flex-col items-center gap-2">
      <Ring value={value} total={total} size={size} tone={tone}>
        <span className="flex flex-col items-center gap-0.5">
          <span className="figure text-2xl">{pct}%</span>
          <span className="text-[0.625rem] text-[color:var(--text-quiet)] tabular-nums">
            {value}/{total}
          </span>
        </span>
      </Ring>
      <span className="label text-[10px]">{caption}</span>
    </div>
  );
}

/**
 * The activity stream.
 *
 * A vertical rail with a node per entry. The rail is what makes a list of
 * audit rows read as a chronology rather than as a table.
 */
export function Stream({
  entries,
}: {
  entries: { id: string; when: string; title: string; detail: string }[];
}) {
  return (
    <ol className="relative flex flex-col">
      <span
        className="absolute top-3 bottom-3 left-[0.1875rem] w-px bg-[color:var(--line)]"
        aria-hidden
      />
      {entries.map((entry) => (
        <li key={entry.id} className="relative flex gap-4 py-2.5 pl-5">
          <span
            className="absolute top-[0.9rem] left-0 size-[0.4375rem] rounded-full bg-[color:var(--accent)] ring-4 ring-[color:var(--surface-1)]"
            aria-hidden
          />
          <span className="label w-16 shrink-0 pt-px text-[10px]">{entry.when}</span>
          <span className="flex min-w-0 flex-col gap-0.5">
            <span className="text-[0.8125rem] font-medium text-[color:var(--text)]">
              {entry.title}
            </span>
            <span className="text-[0.75rem] leading-relaxed text-[color:var(--text-quiet)]">
              {entry.detail}
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}

export { Tag };
