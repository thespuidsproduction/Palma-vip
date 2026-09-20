import { headers } from 'next/headers';
import { VipShell } from '@/components/vip/VipShell';
import { SignOutButton } from '@/components/vip/SignOut';
import { CommandPalette } from '@/components/admin/CommandPalette';
import { navFor } from '@/lib/admin-nav';
import { roleSurface } from '@/components/account/RoleSurface';
import { ENTRANCES } from '@/lib/auth/entrances';

export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, panel } = await roleSurface(ENTRANCES.admin);
  if (!session) return panel;

  const activeHref = (await headers()).get('x-palma-pathname') ?? '/admin';
  const groups = navFor(session.user.role);

  return (
    <VipShell
      title="Administration"
      eyebrow="The Creator Honours"
      userName={session.user.email}
      nav={groups}
      activeHref={activeHref}
      actions={
        <>
          <CommandPalette groups={groups} />
          <SignOutButton />
        </>
      }
    >
      {children}
    </VipShell>
  );
}
