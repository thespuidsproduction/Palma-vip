import { VipShell } from '@/components/vip/VipShell';
import { SignOutButton } from '@/components/vip/SignOut';
import { GlassEmpty } from '@/components/vip/desk';
import { JudgeOverviewView } from '@/components/vip/JudgeOverviewView';
import { buildMetadata } from '@/lib/seo';
import { requirePermission } from '@/lib/auth/guards';
import { getJudgeOverview } from '@/server/data/judging';
import { JUDGING_NAV, greeting } from '@/lib/judging-nav';
import { formatDate, formatShortDate } from '@/lib/format';
import { MIN_JUDGES_PER_CANDIDACY } from '@/domain/selection';
import { Gavel } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Judging',
  description: 'The PALMA judging room.',
  path: '/judge',
  noIndex: true,
});

export default async function JudgingOverviewPage() {
  const session = await requirePermission('judging:view_assignments', '/judge');
  const overview = session.user.judgeId
    ? await getJudgeOverview(session.user.judgeId, session.user.id)
    : null;

  if (!overview) {
    return (
      <VipShell title="PALMA Judging" userName={session.user.name} actions={<SignOutButton />}>
        <GlassEmpty
          icon={Gavel}
          title="No panel membership"
          description="This account is not currently seated on a PALMA panel."
        />
      </VipShell>
    );
  }

  const firstName = overview.judgeName.split(' ')[0] ?? overview.judgeName;

  return (
    <VipShell
      title="PALMA Judging"
      eyebrow={overview.season.title}
      userName={overview.judgeName}
      nav={[{ title: 'The room', items: JUDGING_NAV }]}
      activeHref="/judge"
      actions={<SignOutButton />}
    >
      <JudgeOverviewView
        greeting={greeting()}
        firstName={firstName}
        judgeName={overview.judgeName}
        counts={overview.counts}
        season={{
          title: overview.season.title,
          daysRemaining: overview.season.daysRemaining,
          closesAt: overview.season.closesAt ? formatDate(overview.season.closesAt) : null,
        }}
        categories={overview.categories}
        notifications={overview.notifications.map((notification) => ({
          id: notification.id,
          subject: notification.subject,
          body: notification.body,
          when: formatShortDate(notification.createdAt),
          href: notification.href,
        }))}
        isChair={overview.isChair}
        minJudges={MIN_JUDGES_PER_CANDIDACY}
      />
    </VipShell>
  );
}
