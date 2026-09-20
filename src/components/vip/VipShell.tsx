import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Wordmark } from '@/components/brand/Wordmark';
import { VipBackdrop, ScrollRail, Pulse } from './surface';
import { cn } from '@/lib/utils';

/* ───────────────────────────────────────────────────────────────────────────
   The VIP shell

   One frame for all four desks. A floating chrome that condenses as you
   scroll, a glass rail that sticks beside the page, and the aurora behind
   the lot.

   A server component on purpose: the chrome's condense, the rail's active
   pill and the scroll progress hairline are all CSS scroll-driven animations,
   so none of this needs to hydrate. The only client code on a desk is the
   handful of glass primitives that genuinely track a pointer.
   ─────────────────────────────────────────────────────────────────────────── */

export type VipNavItem = { href: string; label: string; icon?: LucideIcon; badge?: number };
export type VipNavGroup = { title: string; items: VipNavItem[] };

function isActive(activeHref: string, href: string, roots: string[]) {
  if (activeHref === href) return true;
  // A root ("/admin", "/portal") must not light up for every page beneath it,
  // or the rail shows two active items on every sub-page.
  if (roots.includes(href)) return false;
  return activeHref.startsWith(`${href}/`);
}

export function VipShell({
  title,
  eyebrow,
  userName,
  nav,
  activeHref,
  actions,
  children,
}: {
  /** The desk's name, set in champagne beside the wordmark. */
  title: string;
  /** A line under the title in the chrome — usually the season or the role. */
  eyebrow?: string;
  userName?: string;
  nav?: VipNavGroup[];
  activeHref?: string;
  /** Sign-out, command palette — anything that needs a server action. */
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const active = activeHref ?? '';
  const roots = (nav ?? []).flatMap((group) => group.items.slice(0, 1).map((item) => item.href));

  return (
    <div className="vip flex min-h-dvh flex-col">
      <VipBackdrop />

      {/* ── Chrome ──────────────────────────────────────────────────────── */}
      <header className="vip-chrome vip-condense sticky top-0 z-50 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-[104rem] min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <div className="flex min-w-0 items-center gap-4">
            <Link
              href="/"
              className="focus-visible:outline-champagne rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4"
            >
              {/* `href={null}` because the shell supplies the link: a Wordmark
                  that links itself would nest one anchor inside another. */}
              <Wordmark size="sm" variant="lockup" href={null} />
            </Link>
            <span
              className="hidden h-7 w-px bg-[color:var(--glass-rim-soft)] sm:block"
              aria-hidden
            />
            <span className="flex min-w-0 flex-col gap-0.5">
              <span className="vip-label text-champagne">{title}</span>
              {eyebrow ? (
                <span className="truncate text-xs text-[color:var(--glass-ink-quiet)]">
                  {eyebrow}
                </span>
              ) : null}
            </span>
          </div>

          <div className="flex min-w-0 items-center gap-3">
            {userName ? (
              <span className="vip-glass-quiet hidden items-center gap-2 rounded-full px-3.5 py-1.5 md:inline-flex">
                <Pulse />
                <span className="max-w-52 truncate text-xs text-[color:var(--glass-ink-soft)]">
                  {userName}
                </span>
              </span>
            ) : null}
            {actions}
          </div>
        </div>

        <ScrollRail />
      </header>

      <div className="mx-auto flex w-full max-w-[104rem] min-w-0 flex-1 gap-8 px-4 py-8 sm:px-6 lg:gap-10 lg:px-8 lg:py-12">
        {/* ── Rail ──────────────────────────────────────────────────────── */}
        {nav && nav.length > 0 ? (
          <nav aria-label={`${title} sections`} className="hidden w-60 shrink-0 lg:block xl:w-64">
            <div className="vip-glass sticky top-28 flex flex-col gap-6 p-4">
              {nav.map((group) => (
                <div key={group.title} className="flex flex-col gap-1">
                  <h2 className="vip-label px-3 pt-1 pb-2 text-[10px]">{group.title}</h2>
                  <ul className="flex flex-col gap-0.5">
                    {group.items.map((item) => {
                      const on = isActive(active, item.href, roots);
                      const Icon = item.icon;
                      return (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            aria-current={on ? 'page' : undefined}
                            data-active={on || undefined}
                            className={cn(
                              'vip-nav-item flex items-center gap-3 px-3 py-2 text-sm',
                              'focus-visible:outline-champagne focus-visible:outline-2 focus-visible:outline-offset-2',
                              on
                                ? 'font-medium text-[color:var(--glass-ink)]'
                                : 'text-[color:var(--glass-ink-quiet)] hover:text-[color:var(--glass-ink)]',
                            )}
                          >
                            {Icon ? (
                              <Icon
                                className={cn('size-4 shrink-0', on && 'text-champagne')}
                                strokeWidth={on ? 2 : 1.6}
                              />
                            ) : null}
                            <span className="truncate">{item.label}</span>
                            {item.badge ? (
                              <span className="bg-oxblood/85 text-ivory ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums">
                                {item.badge}
                              </span>
                            ) : null}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </nav>
        ) : null}

        <main className="min-w-0 flex-1">
          {/* The rail collapses into a scrolling strip of glass on narrow
              screens rather than disappearing into a menu nobody opens. */}
          {nav && nav.length > 0 ? (
            <nav
              aria-label={`${title} sections`}
              className="-mx-4 mb-8 overflow-x-auto px-4 pb-1 lg:hidden"
            >
              <ul className="flex w-max gap-2">
                {nav.flatMap((group) =>
                  group.items.map((item) => {
                    const on = isActive(active, item.href, roots);
                    const Icon = item.icon;
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          aria-current={on ? 'page' : undefined}
                          data-active={on || undefined}
                          className={cn(
                            'vip-nav-item flex items-center gap-2 px-3.5 py-2 text-sm whitespace-nowrap',
                            on
                              ? 'font-medium text-[color:var(--glass-ink)]'
                              : 'text-[color:var(--glass-ink-quiet)]',
                          )}
                        >
                          {Icon ? <Icon className="size-4" strokeWidth={on ? 2 : 1.6} /> : null}
                          {item.label}
                        </Link>
                      </li>
                    );
                  }),
                )}
              </ul>
            </nav>
          ) : null}

          {children}
        </main>
      </div>
    </div>
  );
}
