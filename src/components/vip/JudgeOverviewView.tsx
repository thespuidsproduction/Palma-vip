import Link from 'next/link';
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  XCircle,
  Calendar,
  Bell,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Play,
  Scale,
  Gavel,
} from 'lucide-react';
import { Glass, Figure } from './glass';
import { SectionHead, Chip, Pulse, Plate } from './surface';
import { DeskHero, ProgressRow, SidePanel, GlassEmpty, GlassButton, GlassNotice } from './desk';
import { cn } from '@/lib/utils';

/* ───────────────────────────────────────────────────────────────────────────
   The judging room

   A judge arrives with one question — what is left — and the room is laid out
   to answer it and then get out of the way. The four counts across the top,
   the categories as meters beneath them, and the deadline held in the corner
   where it can be glanced at without being alarming.
   ─────────────────────────────────────────────────────────────────────────── */

export type JudgeCategory = {
  categoryId: string;
  categoryName: string;
  assigned: number;
  completed: number;
  nextAssignmentId: string | null;
};

export type JudgeNotice = {
  id: string;
  subject: string;
  body: string;
  when: string;
  href?: string | null;
};

export function JudgeOverviewView({
  greeting,
  firstName,
  judgeName,
  counts,
  season,
  categories,
  notifications,
  isChair,
  minJudges,
}: {
  greeting: string;
  firstName: string;
  judgeName: string;
  counts: { assigned: number; completed: number; remaining: number; recused: number };
  season: { title: string; daysRemaining: number | null; closesAt: string | null };
  categories: JudgeCategory[];
  notifications: JudgeNotice[];
  isChair: boolean;
  minJudges: number;
}) {
  const nextId = categories.find((category) => category.nextAssignmentId)?.nextAssignmentId ?? null;
  const pct = Math.round((counts.completed / Math.max(1, counts.assigned)) * 100);
  const closingSoon =
    season.daysRemaining !== null && season.daysRemaining <= 7 && season.daysRemaining > 0;

  const stats = [
    { icon: ClipboardList, label: 'Assigned', value: counts.assigned, tone: 'default' as const },
    { icon: CheckCircle2, label: 'Completed', value: counts.completed, tone: 'live' as const },
    { icon: Clock, label: 'Remaining', value: counts.remaining, tone: 'gold' as const },
    { icon: XCircle, label: 'Recused', value: counts.recused, tone: 'default' as const },
  ];

  return (
    <div className="flex flex-col gap-10">
      <DeskHero
        eyebrow="The judging room"
        eyebrowIcon={Gavel}
        greeting={`${greeting}, ${firstName}.`}
        statement={
          counts.remaining === 0
            ? 'Your panel is clear. Every case assigned to you this season has been assessed.'
            : `${counts.remaining} case${counts.remaining === 1 ? '' : 's'} left to assess. You are ${pct}% of the way through your panel.`
        }
        figure={{
          value: counts.remaining,
          caption: 'cases remaining',
          tone: counts.remaining > 0 ? 'gold' : 'default',
        }}
      >
        {nextId ? (
          <GlassButton href={`/judge/${nextId}`} icon={ArrowRight} tone="gold">
            Open the next case
          </GlassButton>
        ) : null}
        {isChair ? (
          <Chip tone="gold">
            <ShieldCheck className="size-3.5" />
            You chair this panel
          </Chip>
        ) : null}
      </DeskHero>

      {/* ── The four counts ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Glass
            key={stat.label}
            spotlight
            index={i + 1}
            className="flex flex-col gap-4 p-5"
            ceremonial={stat.tone === 'gold' && stat.value > 0}
          >
            <div className="flex items-center gap-3">
              <Plate icon={stat.icon} size="sm" tone={stat.value > 0 ? stat.tone : 'default'} />
              <span className="vip-label text-[10px]">{stat.label}</span>
            </div>
            <Figure
              value={stat.value}
              gold={stat.tone === 'gold' && stat.value > 0}
              className="text-5xl"
            />
          </Glass>
        ))}
      </div>

      <div className="grid gap-8 xl:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-6 xl:col-span-8">
          <section>
            <SectionHead
              icon={ClipboardList}
              title="Your assignments"
              action={
                <Link
                  href="/judge/assignments"
                  className="text-champagne inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline"
                >
                  Open the workspace
                  <ChevronRight className="size-3.5" />
                </Link>
              }
            />

            {categories.length === 0 ? (
              <GlassEmpty
                icon={ClipboardList}
                title="Nothing assigned yet"
                description="Cases are assigned once screening closes. You will be notified."
              />
            ) : (
              <div className="grid gap-3">
                {categories.map((category, i) => {
                  const done = category.completed >= category.assigned;
                  const started = category.completed > 0;

                  return (
                    <ProgressRow
                      key={category.categoryId}
                      index={i}
                      title={category.categoryName}
                      done={category.completed}
                      total={category.assigned}
                      caption={`${category.assigned} case${category.assigned === 1 ? '' : 's'} assigned`}
                      action={
                        done ? (
                          <Chip tone="live">
                            <CheckCircle2 className="size-3.5" />
                            Complete
                          </Chip>
                        ) : category.nextAssignmentId ? (
                          <Link
                            href={`/judge/${category.nextAssignmentId}`}
                            className={cn(
                              'vip-glass-quiet ring-champagne/30 text-champagne inline-flex items-center gap-1.5',
                              'rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 ring-inset',
                              'transition-transform duration-500 hover:-translate-y-0.5',
                            )}
                          >
                            {started ? (
                              <>
                                <Play className="size-3" />
                                Continue
                              </>
                            ) : (
                              <>
                                <ArrowRight className="size-3.5" />
                                Begin
                              </>
                            )}
                          </Link>
                        ) : null
                      }
                    />
                  );
                })}
              </div>
            )}
          </section>

          {closingSoon ? (
            <GlassNotice icon={Clock}>
              <strong className="text-[color:var(--glass-ink)]">
                {season.daysRemaining} day{season.daysRemaining === 1 ? '' : 's'}
              </strong>{' '}
              remain before judging closes for {season.title}.
            </GlassNotice>
          ) : null}
        </div>

        <aside className="flex min-w-0 flex-col gap-5 xl:col-span-4">
          {/* ── The deadline ──────────────────────────────────────────── */}
          <Glass spotlight ceremonial className="p-6">
            <div className="mb-4 flex items-center gap-3">
              <Plate icon={Calendar} size="sm" tone="gold" />
              <span className="vip-label">{season.title}</span>
              {closingSoon ? <Pulse tone="gold" /> : null}
            </div>
            <p className="font-display text-2xl leading-tight text-[color:var(--glass-ink)]">
              {season.daysRemaining === null
                ? 'No deadline published yet'
                : season.daysRemaining === 0
                  ? 'Judging closes today'
                  : `Judging closes in ${season.daysRemaining} day${season.daysRemaining === 1 ? '' : 's'}`}
            </p>
            {season.closesAt ? (
              <p className="mt-2 text-sm text-[color:var(--glass-ink-quiet)]">{season.closesAt}</p>
            ) : null}

            {isChair ? (
              <p className="mt-5 border-t border-t-[color:var(--glass-rim-soft)] pt-5 text-xs leading-relaxed text-[color:var(--glass-ink-quiet)]">
                You chair this panel. You see the spread of scores before any list is confirmed, and
                you score nothing yourself.
              </p>
            ) : null}
          </Glass>

          {/* ── Notices ───────────────────────────────────────────────── */}
          <Glass spotlight className="overflow-hidden">
            <div className="flex items-center gap-3 p-5">
              <Plate icon={Bell} size="sm" />
              <h3 className="font-display text-base text-[color:var(--glass-ink)]">Notices</h3>
              {notifications.length > 0 ? (
                <Chip className="ml-auto">{notifications.length}</Chip>
              ) : null}
            </div>
            <hr className="vip-divider" />
            {notifications.length === 0 ? (
              <p className="p-5 text-sm leading-relaxed text-[color:var(--glass-ink-quiet)]">
                Nothing outstanding. PALMA only writes to you about assignments, reassignments,
                conflict decisions, deadlines and the opening and closing of judging.
              </p>
            ) : (
              <ul className="flex flex-col">
                {notifications.map((notice) => (
                  <li
                    key={notice.id}
                    className="flex flex-col gap-1.5 border-b border-b-[color:var(--glass-rim-soft)] p-5 last:border-none"
                  >
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-display text-base text-[color:var(--glass-ink)]">
                        {notice.subject}
                      </span>
                      <span className="vip-label shrink-0 text-[10px]">{notice.when}</span>
                    </span>
                    <span className="text-sm leading-relaxed text-[color:var(--glass-ink-soft)]">
                      {notice.body}
                    </span>
                    {notice.href ? (
                      <Link
                        href={notice.href}
                        className="text-champagne mt-1 inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline"
                      >
                        Open <ChevronRight className="size-3" />
                      </Link>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </Glass>

          <SidePanel icon={Scale} title="How PALMA treats your work" parallax>
            Every case is scored independently by at least {minJudges} judges. You are never shown
            another judge&rsquo;s score, and never shown how many people nominated a creator.
            Submitted assessments are immutable.
          </SidePanel>

          <p className="vip-label px-2 text-center text-[10px]">Seated as {judgeName}</p>
        </aside>
      </div>
    </div>
  );
}
