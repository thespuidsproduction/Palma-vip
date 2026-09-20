import { VipShell } from '@/components/vip/VipShell';
import { SignOutButton } from '@/components/vip/SignOut';
import { CreatorOverviewView } from '@/components/vip/CreatorOverviewView';
import { GlassEmpty } from '@/components/vip/desk';
import { CopyLink } from '@/components/palma/CopyLink';
import { buildMetadata, absoluteUrl } from '@/lib/seo';
import { requireSession } from '@/lib/auth/guards';
import { getCreatorPortal } from '@/server/data/portal';
import { titleCase } from '@/lib/utils';
import { isStaff } from '@/lib/auth/rbac';
import { CREATOR_NAV } from '@/lib/creator-nav';
import { UserX } from 'lucide-react';

export const dynamic = 'force-dynamic';

export const metadata = buildMetadata({
  title: 'Creator portal',
  description: 'Manage your PALMA creator record.',
  path: '/creator',
  noIndex: true,
});

export default async function PortalPage() {
  const session = await requireSession('/creator');
  const portal = await getCreatorPortal(session.user.id);

  if (!portal) {
    return (
      <VipShell title="PALMA Portal" userName={session.user.name} actions={<SignOutButton />}>
        <GlassEmpty
          icon={UserX}
          title="Account not found"
          description="This account could not be loaded. Sign out and in again, or contact PALMA."
        />
      </VipShell>
    );
  }

  const verified = portal.verification.status === 'verified';

  return (
    <VipShell
      title="PALMA Portal"
      eyebrow="Your record, your standing"
      userName={session.user.email}
      nav={[{ title: 'Your portal', items: CREATOR_NAV }]}
      activeHref="/creator"
      actions={<SignOutButton />}
    >
      <CreatorOverviewView
        displayName={portal.displayName ?? session.user.name}
        honours={portal.achievements.map((achievement) => ({
          code: achievement.code,
          categoryName: achievement.categoryName,
          kind: titleCase(achievement.kind),
          year: achievement.year,
          revoked: achievement.state === 'revoked',
          verifyHref: `/verify/${achievement.code}`,
        }))}
        candidacies={portal.candidacies.map((candidacy) => ({
          id: candidacy.id,
          reference: candidacy.reference,
          categoryName: candidacy.categoryName,
          year: candidacy.year,
          status: titleCase(candidacy.status),
          winner: candidacy.status === 'winner',
        }))}
        verificationStatus={titleCase(portal.verification.status)}
        verified={verified}
        published={portal.isPublished}
        hasProfile={portal.hasProfile}
        hasProfileRecord={Boolean(portal.profile)}
        dossier={portal.dossier}
        isJudge={Boolean(session.user.judgeId)}
        isStaff={isStaff(session.user.role)}
        copySlot={(code) => (
          <CopyLink value={absoluteUrl(`/verify/${code}`)} label="Copy verification link" />
        )}
      />
    </VipShell>
  );
}
