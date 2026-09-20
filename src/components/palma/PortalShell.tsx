import { VipShell, type VipNavItem } from '@/components/vip/VipShell';
import { SignOutButton } from '@/components/vip/SignOut';

export type PortalNavItem = VipNavItem;

/**
 * The authenticated shell.
 *
 * Now a thin adapter over `VipShell`: every page that already asked for a
 * portal frame gets the glass one, so a creator moving from the overview to
 * their profile does not walk from one design into another. The shell's own
 * job — title, nav, who you are signed in as, sign out — has not changed.
 */
export function PortalShell({
  title,
  subtitle,
  nav,
  activeHref,
  userName,
  children,
}: {
  title: string;
  subtitle?: string;
  nav?: PortalNavItem[];
  activeHref?: string;
  userName?: string;
  children: React.ReactNode;
}) {
  return (
    <VipShell
      title={title}
      eyebrow={subtitle}
      userName={userName}
      nav={nav && nav.length > 0 ? [{ title: 'Sections', items: nav }] : undefined}
      activeHref={activeHref}
      actions={<SignOutButton />}
    >
      {children}
    </VipShell>
  );
}
