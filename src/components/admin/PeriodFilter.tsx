import Link from 'next/link';
import { PERIODS, PERIOD_LABEL, type Period } from '@/server/data/command-centre';
import { cn } from '@/lib/utils';

/** One row of filters above the figures, never buried in a dropdown. */
export function PeriodFilter({
  period,
  basePath,
  variant = 'rule',
}: {
  period: Period;
  basePath: string;
  /** `glass` for the desks, which carry their own surface. */
  variant?: 'rule' | 'glass';
}) {
  if (variant === 'glass') {
    return (
      <nav
        aria-label="Period"
        className="vip-glass-quiet inline-flex flex-wrap gap-1 rounded-full p-1"
      >
        {PERIODS.map((entry) => (
          <Link
            key={entry}
            href={entry === '30d' ? basePath : `${basePath}?period=${entry}`}
            aria-current={entry === period ? 'true' : undefined}
            data-active={entry === period || undefined}
            className={cn(
              'vip-nav-item rounded-full px-4 py-1.5 text-xs font-medium tracking-wide whitespace-nowrap',
              'focus-visible:outline-champagne focus-visible:outline-2 focus-visible:outline-offset-2',
              entry === period
                ? 'text-[color:var(--glass-ink)]'
                : 'text-[color:var(--glass-ink-quiet)] hover:text-[color:var(--glass-ink)]',
            )}
          >
            {PERIOD_LABEL[entry]}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Period" className="flex flex-wrap gap-x-5 gap-y-2">
      {PERIODS.map((entry) => (
        <Link
          key={entry}
          href={entry === '30d' ? basePath : `${basePath}?period=${entry}`}
          aria-current={entry === period ? 'true' : undefined}
          className={cn(
            'palma-label border-b-2 pb-1 transition-colors',
            entry === period
              ? 'border-ink text-ink'
              : 'text-taupe hover:text-ink border-transparent',
          )}
        >
          {PERIOD_LABEL[entry]}
        </Link>
      ))}
    </nav>
  );
}
