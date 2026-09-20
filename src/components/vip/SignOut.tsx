import { LogOut } from 'lucide-react';
import { signOut } from '@/server/actions/auth';

/** Sign out, as glass. Keeps the server action where it already lived. */
export function SignOutButton() {
  return (
    <form action={signOut}>
      <button
        type="submit"
        className="vip-glass-quiet vip-lift focus-visible:outline-champagne inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-[color:var(--glass-ink-soft)] focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <LogOut className="size-3.5" strokeWidth={2} />
        Sign out
      </button>
    </form>
  );
}
