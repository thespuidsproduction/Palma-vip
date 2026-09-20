import {
  LayoutDashboard,
  FileCheck,
  ShieldAlert,
  Flag,
  AlertTriangle,
  FileText,
  Clock,
  Info,
  ShieldOff,
  History,
  Inbox,
  CheckCircle2,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Glass } from './glass';
import { SectionHead, Label } from './surface';
import { DeskHero, QueueRow, SidePanel, Stream, GlassNotice } from './desk';

/* ───────────────────────────────────────────────────────────────────────────
   The moderation desk

   One question: is anything waiting on a person? The hero answers it with a
   number, the queues say what and where, and the chronology on the left shows
   what the desk has already settled.
   ─────────────────────────────────────────────────────────────────────────── */

const QUEUE_ICONS: Record<string, LucideIcon> = {
  '/portal/claims': FileCheck,
  '/portal/verification': ShieldAlert,
  '/portal/reports': Flag,
  '/portal/claims?filter=escalated': AlertTriangle,
  '/portal/creators?filter=unpublished': FileText,
};

export type PortalWorkItem = { href: string; label: string; count: number; note: string };
export type PortalStreamEntry = { id: string; when: string; title: string; detail: string };

export function PortalOverviewView({
  greeting,
  firstName,
  work,
  activity,
}: {
  greeting: string;
  firstName: string;
  work: PortalWorkItem[];
  activity: PortalStreamEntry[];
}) {
  const outstanding = work.reduce((sum, item) => sum + item.count, 0);
  // Queues that need someone lead; cleared ones fall to the bottom rather than
  // being hidden, so the desk can still see that they are clear.
  const ordered = [...work].sort((a, b) => b.count - a.count);

  return (
    <div className="flex flex-col gap-10">
      <DeskHero
        eyebrow="Moderation"
        eyebrowIcon={LayoutDashboard}
        greeting={`${greeting}, ${firstName}.`}
        statement={
          outstanding === 0
            ? 'Your queues are clear. Nothing is waiting on a person.'
            : `${outstanding} item${outstanding === 1 ? '' : 's'} need a decision. Everything else is settled.`
        }
        figure={{
          value: outstanding,
          caption: outstanding === 1 ? 'awaiting you' : 'awaiting you',
          tone: outstanding > 0 ? 'gold' : 'default',
        }}
      />

      {outstanding > 0 ? (
        <GlassNotice icon={Clock}>
          <strong className="text-[color:var(--glass-ink)]">{outstanding}</strong> outstanding{' '}
          {outstanding === 1 ? 'item requires' : 'items require'} your attention across the queues
          below. Each decision is recorded against the thing it concerns, with your name on it.
        </GlassNotice>
      ) : (
        <GlassNotice icon={CheckCircle2} tone="live">
          Every queue on this desk is clear. PALMA will write to you when something new arrives.
        </GlassNotice>
      )}

      <section>
        <SectionHead
          icon={Inbox}
          title="Needs attention"
          action={<Label>{work.length} queues</Label>}
        />
        <div className="grid gap-3">
          {ordered.map((item, i) => (
            <QueueRow
              key={item.href}
              href={item.href}
              icon={QUEUE_ICONS[item.href] ?? FileText}
              label={item.label}
              note={item.note}
              count={item.count}
              index={i + 1}
            />
          ))}
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-12">
        <section className="min-w-0 xl:col-span-7">
          <SectionHead icon={History} title="Recently recorded" />
          <Glass spotlight className="p-5 sm:p-6">
            {activity.length === 0 ? (
              <p className="py-6 text-center text-sm text-[color:var(--glass-ink-quiet)]">
                Nothing has been recorded yet.
              </p>
            ) : (
              <Stream entries={activity} />
            )}
          </Glass>
        </section>

        <aside className="flex min-w-0 flex-col gap-5 xl:col-span-5">
          <SidePanel icon={Info} title="What this desk decides">
            Whether a person should control a PALMA record, whether a creator has been verified as
            an adult, and whether something reported breaches the content policy. Each decision is
            recorded against the thing it concerns, with your name on it.
          </SidePanel>

          <SidePanel icon={ShieldOff} title="What it never decides" tone="alert" parallax>
            An outcome. Selection, revocation and score correction are administrator actions.
            Moderation maintains the accuracy of the record and never its results.
          </SidePanel>
        </aside>
      </div>
    </div>
  );
}
