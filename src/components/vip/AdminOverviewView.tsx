import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { Monitor, AlertTriangle, ChevronRight, GitBranch, Activity } from 'lucide-react';
import { Glass } from './glass';
import { SectionHead, Label, Chip, Pulse } from './surface';
import { DeskHero, StatTile, GlassNotice } from './desk';

/* ───────────────────────────────────────────────────────────────────────────
   The command centre

   The institution in one screen. Four constellations of figures, each a grid
   of glass tiles — a linked tile is a door, an unlinked one is a reading.

   Deliberately not a chart wall: the administrator's question here is "is
   anything wrong and where", which a number answers faster than a line.
   ─────────────────────────────────────────────────────────────────────────── */

export type AdminStat = {
  label: string;
  value: number | string;
  note?: string;
  href?: string;
  tone?: 'default' | 'attention' | 'gold';
  icon: LucideIcon;
};

export type AdminGroupBlock = { title: string; icon: LucideIcon; stats: AdminStat[] };

export function AdminOverviewView({
  greeting,
  firstName,
  periodLabel,
  outstanding,
  since,
  degraded,
  groups,
  filter,
  seasonLine,
  advance,
}: {
  greeting: string;
  firstName: string;
  periodLabel: string;
  outstanding: number;
  since?: string | null;
  degraded: string[];
  groups: AdminGroupBlock[];
  /** The period switcher, passed in so this view stays presentational. */
  filter?: React.ReactNode;
  seasonLine?: string | null;
  /** The advance-season form, which owns a server action of its own. */
  advance?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10">
      <DeskHero
        eyebrow="Command centre"
        eyebrowIcon={Monitor}
        greeting={`${greeting}, ${firstName}.`}
        statement={
          <>
            {outstanding === 0
              ? 'Nothing is waiting on a person across the institution.'
              : `${outstanding} item${outstanding === 1 ? '' : 's'} across the queues need a decision.`}{' '}
            Figures below cover{' '}
            <strong className="text-[color:var(--glass-ink)]">{periodLabel.toLowerCase()}</strong>
            {since ? `, counted since ${since}` : ''}.
          </>
        }
        figure={{
          value: outstanding,
          caption: 'open decisions',
          tone: outstanding > 0 ? 'gold' : 'default',
        }}
      >
        {seasonLine ? (
          <Chip tone="gold">
            <Pulse tone="gold" />
            {seasonLine}
          </Chip>
        ) : null}
        {degraded.length === 0 ? (
          <Chip tone="live">
            <Pulse />
            All services operational
          </Chip>
        ) : null}
      </DeskHero>

      {filter ? (
        <div className="flex flex-wrap items-center gap-4">
          <Label icon={Activity}>Period</Label>
          {filter}
        </div>
      ) : null}

      {degraded.length > 0 ? (
        <GlassNotice icon={AlertTriangle} tone="alert">
          <p className="vip-label text-oxblood mb-1">A service is not healthy</p>
          {degraded.join(', ')}{' '}
          <Link
            href="/admin/health"
            className="text-champagne inline-flex items-center gap-0.5 font-medium underline-offset-4 hover:underline"
          >
            view system health
            <ChevronRight className="size-3.5" />
          </Link>
        </GlassNotice>
      ) : null}

      {groups.map((group) => (
        <section key={group.title}>
          <SectionHead
            icon={group.icon}
            title={group.title}
            action={<Label>{group.stats.length} figures</Label>}
          />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
            {group.stats.map((stat, i) => (
              <StatTile
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                value={stat.value}
                note={stat.note}
                href={stat.href}
                tone={stat.tone}
                index={i}
              />
            ))}
          </div>
        </section>
      ))}

      {advance ? (
        <section>
          <SectionHead icon={GitBranch} title="Advance the season" />
          <Glass spotlight ceremonial className="max-w-2xl p-6 sm:p-8">
            {advance}
          </Glass>
        </section>
      ) : null}
    </div>
  );
}
