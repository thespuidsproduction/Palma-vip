import { notFound } from 'next/navigation';
import { VipShell } from '@/components/vip/VipShell';
import { PortalOverviewView } from '@/components/vip/PortalOverviewView';
import { AdminOverviewView } from '@/components/vip/AdminOverviewView';
import { JudgeOverviewView } from '@/components/vip/JudgeOverviewView';
import { CreatorOverviewView } from '@/components/vip/CreatorOverviewView';
import { CopyLink } from '@/components/palma/CopyLink';
import { MODERATION_NAV, ADMIN_NAV } from '@/lib/admin-nav';
import { CREATOR_NAV } from '@/lib/creator-nav';
import { JUDGING_NAV } from '@/lib/judging-nav';
import { PORTAL_FIXTURE, ADMIN_FIXTURE, JUDGE_FIXTURE, CREATOR_FIXTURE } from '../fixtures';

/* ───────────────────────────────────────────────────────────────────────────
   Design preview

   The four desks rendered from fixtures, for reviewing the design without a
   database, a session or a seeded season behind them. Development only: in
   production the route does not exist.
   ─────────────────────────────────────────────────────────────────────────── */

export const dynamic = 'force-static';

export const metadata = { robots: { index: false, follow: false } };

const DESKS = ['portal', 'admin', 'judge', 'creator'] as const;
type Desk = (typeof DESKS)[number];

/**
 * Nothing is prerendered in production, so the preview costs a production
 * build nothing and the route 404s there. Returning the four desks and then
 * calling `notFound()` would instead make the build render four pages only to
 * throw on each.
 */
export function generateStaticParams() {
  if (process.env.NODE_ENV === 'production') return [];
  return DESKS.map((desk) => ({ desk }));
}

function isDesk(value: string): value is Desk {
  return (DESKS as readonly string[]).includes(value);
}

export default async function DesignPreviewPage({ params }: { params: Promise<{ desk: string }> }) {
  if (process.env.NODE_ENV === 'production') notFound();

  const { desk } = await params;
  if (!isDesk(desk)) notFound();

  if (desk === 'portal') {
    return (
      <VipShell
        title="Moderation"
        eyebrow="The Creator Honours"
        userName="ines.moreau@palmaawards.com"
        nav={MODERATION_NAV}
        activeHref="/portal"
      >
        <PortalOverviewView {...PORTAL_FIXTURE} />
      </VipShell>
    );
  }

  if (desk === 'admin') {
    return (
      <VipShell
        title="Administration"
        eyebrow="The Creator Honours"
        userName="ines.moreau@palmaawards.com"
        nav={ADMIN_NAV}
        activeHref="/admin"
      >
        <AdminOverviewView {...ADMIN_FIXTURE} />
      </VipShell>
    );
  }

  if (desk === 'judge') {
    return (
      <VipShell
        title="PALMA Judging"
        eyebrow={JUDGE_FIXTURE.season.title}
        userName={JUDGE_FIXTURE.judgeName}
        nav={[{ title: 'The room', items: JUDGING_NAV }]}
        activeHref="/judge"
      >
        <JudgeOverviewView {...JUDGE_FIXTURE} />
      </VipShell>
    );
  }

  return (
    <VipShell
      title="PALMA Portal"
      eyebrow="Your record, your standing"
      userName="marisol@example.com"
      nav={[{ title: 'Your portal', items: CREATOR_NAV }]}
      activeHref="/creator"
    >
      <CreatorOverviewView
        {...CREATOR_FIXTURE}
        copySlot={(code) => (
          <CopyLink
            value={`https://palmaawards.com/verify/${code}`}
            label="Copy verification link"
          />
        )}
      />
    </VipShell>
  );
}
