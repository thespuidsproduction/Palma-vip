import Link from 'next/link';
import {
  Award,
  Trophy,
  ShieldCheck,
  Globe,
  User,
  Link as LinkIcon,
  Inbox,
  Mail,
  Scale,
  Settings,
  Search,
  PenLine,
  ExternalLink,
  Eye,
  Sparkles,
} from 'lucide-react';
import { Glass, GlassLink } from './glass';
import { SectionHead, Label, Chip, Plate, Pulse } from './surface';
import { DeskHero, SidePanel, GlassEmpty, GlassButton, GlassNotice } from './desk';
import { cn } from '@/lib/utils';

/* ───────────────────────────────────────────────────────────────────────────
   The creator portal

   Where a creator stands, in the order they care about it: what they hold,
   what they are in contention for, and then the machinery — profile,
   verification, links, dossier.

   The honours are the one place on this desk where champagne is allowed to
   run: an honour is the institution's ceremonial mark, and this is a
   creator's own record of holding one.
   ─────────────────────────────────────────────────────────────────────────── */

export type CreatorAchievement = {
  code: string;
  categoryName: string;
  kind: string;
  year: number;
  revoked: boolean;
  verifyHref: string;
};

export type CreatorCandidacy = {
  id: string;
  reference: string;
  categoryName: string;
  year: number;
  status: string;
  winner: boolean;
};

export function CreatorOverviewView({
  displayName,
  honours,
  candidacies,
  verificationStatus,
  verified,
  published,
  hasProfile,
  hasProfileRecord,
  dossier,
  isJudge,
  isStaff,
  copySlot,
}: {
  displayName: string;
  honours: CreatorAchievement[];
  candidacies: CreatorCandidacy[];
  verificationStatus: string;
  verified: boolean;
  published: boolean;
  hasProfile: boolean;
  hasProfileRecord: boolean;
  dossier: { unread: number; important: number };
  isJudge: boolean;
  isStaff: boolean;
  /** Renders a copy-link control for an honour code. Owns its own clipboard state. */
  copySlot?: (code: string) => React.ReactNode;
}) {
  const live = honours.filter((honour) => !honour.revoked).length;

  const tiles = [
    { icon: Award, label: 'PALMA honours', value: honours.length, tone: 'gold' as const },
    { icon: Trophy, label: 'Candidacies', value: candidacies.length, tone: 'default' as const },
    {
      icon: ShieldCheck,
      label: 'Verification',
      value: verificationStatus,
      tone: verified ? ('live' as const) : ('default' as const),
    },
    {
      icon: Globe,
      label: 'Profile',
      value: published ? 'Published' : 'Unpublished',
      tone: published ? ('live' as const) : ('default' as const),
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <DeskHero
        eyebrow="Creator portal"
        eyebrowIcon={Sparkles}
        greeting={displayName}
        statement={
          live > 0
            ? `You hold ${live} PALMA honour${live === 1 ? '' : 's'}. Each carries a permanent verification link that proves it, for as long as PALMA keeps the record.`
            : 'Your record, your candidacies and everything PALMA has told you — kept in one place.'
        }
        figure={
          live > 0
            ? { value: live, caption: live === 1 ? 'honour held' : 'honours held', tone: 'gold' }
            : undefined
        }
      >
        {verified ? (
          <Chip tone="live">
            <Pulse />
            Verified
          </Chip>
        ) : (
          <GlassButton href="/creator/verification" icon={ShieldCheck} tone="gold">
            Complete verification
          </GlassButton>
        )}
        {published ? (
          <Chip>
            <Globe className="size-3.5" />
            Profile published
          </Chip>
        ) : null}
      </DeskHero>

      {/* ── Standing ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {tiles.map((tile, i) => (
          <Glass key={tile.label} spotlight index={i + 1} className="flex flex-col gap-4 p-5">
            <div className="flex items-center gap-3">
              <Plate icon={tile.icon} size="sm" tone={tile.tone} />
              <span className="vip-label text-[10px]">{tile.label}</span>
            </div>
            <span
              className={cn(
                'font-display leading-none tracking-tight text-[color:var(--glass-ink)]',
                typeof tile.value === 'number' ? 'text-5xl tabular-nums' : 'text-2xl',
              )}
            >
              {tile.value}
            </span>
          </Glass>
        ))}
      </div>

      {/* ── No record yet ───────────────────────────────────────────────── */}
      {!hasProfile ? (
        <Glass spotlight ceremonial className="overflow-hidden">
          <div className="p-7 sm:p-8">
            <Label icon={User} className="text-champagne">
              No record yet
            </Label>
            <h2 className="font-display mt-4 text-3xl leading-tight text-balance text-[color:var(--glass-ink)]">
              PALMA has not written a record for you, or you have not claimed it.
            </h2>
            <p className="mt-4 max-w-[62ch] leading-relaxed text-[color:var(--glass-ink-soft)]">
              A record is usually written the first time a creator is nominated, so one may already
              exist. If it does not, you can start one: either write it yourself, or give PALMA the
              links and let the editorial desk write it from the work.
            </p>
          </div>
          <hr className="vip-divider" />
          <div className="grid gap-px sm:grid-cols-2">
            <div className="flex flex-col gap-3 p-6">
              <Label icon={Search} className="text-champagne">
                If it already exists
              </Label>
              <p className="text-sm leading-relaxed text-[color:var(--glass-ink-soft)]">
                Search the archive and claim it. PALMA reviews every claim by hand before the record
                is treated as yours.
              </p>
              <GlassButton href="/creator/claim" icon={Search} className="mt-auto self-start">
                Claim a record
              </GlassButton>
            </div>
            <div className="flex flex-col gap-3 border-l-[color:var(--glass-rim-soft)] p-6 sm:border-l">
              <Label icon={PenLine} className="text-champagne">
                If it does not
              </Label>
              <p className="text-sm leading-relaxed text-[color:var(--glass-ink-soft)]">
                Start one. Write it yourself or ask PALMA to write it from your links. Either way a
                moderator checks it before it is published.
              </p>
              <GlassButton
                href="/creator/start"
                icon={PenLine}
                tone="gold"
                className="mt-auto self-start"
              >
                Start a record
              </GlassButton>
            </div>
          </div>
        </Glass>
      ) : null}

      {hasProfile && !published ? (
        <GlassNotice icon={Globe}>
          <strong className="text-[color:var(--glass-ink)]">Your record is with PALMA.</strong> It
          is held by your account and waiting on a moderator. Nothing is public until they publish
          it, and you can keep editing it in the meantime.
        </GlassNotice>
      ) : null}

      <div className="grid gap-8 xl:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-10 xl:col-span-7">
          {/* ── Honours ─────────────────────────────────────────────────── */}
          <section>
            <SectionHead icon={Award} title="Your PALMA record" />
            {honours.length === 0 ? (
              <GlassEmpty
                icon={Award}
                title="No honours yet"
                description="Honours appear here the moment they are conferred, each with its permanent verification link."
              />
            ) : (
              <div className="grid gap-3">
                {honours.map((honour, i) => (
                  <Glass
                    key={honour.code}
                    spotlight
                    index={i}
                    ceremonial={!honour.revoked}
                    className="flex flex-wrap items-center justify-between gap-4 p-5"
                  >
                    <span className="flex min-w-0 items-center gap-4">
                      <Plate icon={Trophy} tone={honour.revoked ? 'default' : 'gold'} />
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="font-display text-lg leading-tight text-[color:var(--glass-ink)]">
                          {honour.categoryName}
                        </span>
                        <span className="vip-label text-[10px]">
                          {honour.kind} · {honour.year}
                        </span>
                      </span>
                    </span>
                    <span className="flex items-center gap-3">
                      {honour.revoked ? (
                        <Chip>Revoked</Chip>
                      ) : (
                        // The copy control is a shared component with its own
                        // square outline; rounded here so it sits in the row
                        // with the chips rather than against them.
                        <span className="[&_button]:rounded-full [&_button]:border-[color:var(--glass-rim-soft)]">
                          {copySlot?.(honour.code) ?? null}
                        </span>
                      )}
                      <Link
                        href={honour.verifyHref}
                        className="text-champagne inline-flex items-center gap-1.5 text-xs font-medium underline-offset-4 hover:underline"
                      >
                        <Eye className="size-3.5" />
                        View
                      </Link>
                    </span>
                  </Glass>
                ))}
              </div>
            )}
          </section>

          {/* ── Candidacies ─────────────────────────────────────────────── */}
          <section>
            <SectionHead icon={Trophy} title="Where you are in contention" />
            {candidacies.length === 0 ? (
              <GlassEmpty
                icon={Trophy}
                title="No candidacies yet"
                description="A candidacy is created the first time someone nominates you in a category. Share your nomination link to let your audience put you forward."
              />
            ) : (
              <div className="grid gap-3">
                {candidacies.map((candidacy, i) => (
                  <Glass
                    key={candidacy.id}
                    spotlight
                    index={i}
                    className="flex flex-wrap items-center justify-between gap-4 p-5"
                  >
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-display text-lg leading-tight text-[color:var(--glass-ink)]">
                        {candidacy.categoryName}
                      </span>
                      <span className="vip-label text-[10px]">
                        <span className="font-mono tracking-wider">{candidacy.reference}</span> ·{' '}
                        {candidacy.year}
                      </span>
                    </span>
                    <Chip tone={candidacy.winner ? 'gold' : 'default'}>
                      {candidacy.winner ? <Trophy className="size-3.5" /> : null}
                      {candidacy.status}
                    </Chip>
                  </Glass>
                ))}
              </div>
            )}
            <p className="mt-5 max-w-[68ch] text-sm leading-relaxed text-[color:var(--glass-ink-quiet)]">
              PALMA does not show you how many nominations you have received. Nomination numbers do
              not decide outcomes, and a running total would only invite you to campaign for one.
            </p>
          </section>
        </div>

        {/* ── The machinery ───────────────────────────────────────────── */}
        <aside className="flex min-w-0 flex-col gap-5 xl:col-span-5">
          {hasProfileRecord ? (
            <GlassLink href="/creator/profile" index={0}>
              <div className="p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Plate icon={User} size="sm" />
                  <h3 className="font-display text-base text-[color:var(--glass-ink)]">
                    Your profile
                  </h3>
                  <PenLine className="text-champagne ml-auto size-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                </div>
                <p className="text-sm leading-relaxed text-[color:var(--glass-ink-soft)]">
                  Your portrait, your details and the links the editorial desk reads your record
                  from.
                </p>
              </div>
            </GlassLink>
          ) : null}

          <SidePanel
            icon={ShieldCheck}
            title="Verification"
            tone={verified ? 'live' : 'default'}
            badge={<Chip tone={verified ? 'live' : 'default'}>{verificationStatus}</Chip>}
          >
            <p className="mb-5">PALMA confers nothing on an unverified record.</p>
            <GlassButton href="/creator/verification" icon={ShieldCheck}>
              {verified ? 'View verification' : 'Complete verification'}
            </GlassButton>
          </SidePanel>

          <SidePanel icon={LinkIcon} title="Your links">
            <p className="mb-5">
              The link you share to be nominated, and the permanent one that proves what you hold.
              They do opposite jobs.
            </p>
            <GlassButton href="/creator/share" icon={ExternalLink}>
              Open your links
            </GlassButton>
          </SidePanel>

          <SidePanel
            icon={Inbox}
            title="Your Dossier"
            badge={
              dossier.unread > 0 ? (
                <Chip tone={dossier.important > 0 ? 'gold' : 'default'}>
                  {dossier.unread} unread
                </Chip>
              ) : undefined
            }
          >
            <p className="mb-5">
              Everything PALMA has told you, kept. Decisions on your record, honours, and changes to
              your account. Entries are written whether or not the email reached you.
            </p>
            <div className="flex flex-wrap gap-3">
              <GlassButton href="/dossier" icon={Inbox}>
                Open your Dossier
              </GlassButton>
              <GlassButton href="/account" icon={Settings}>
                Account
              </GlassButton>
            </div>
          </SidePanel>

          <SidePanel icon={Mail} title="What reaches your inbox" parallax>
            <p className="mb-5">
              Which announcements PALMA sends, and which of the five lists you are on. Decisions
              about your record, and anything concerning the safety of your account, are sent
              regardless — an institution you can mute is not keeping you informed.
            </p>
            <GlassButton href="/account/email-preferences" icon={Mail}>
              Choose what reaches you
            </GlassButton>
          </SidePanel>

          {isJudge ? (
            <SidePanel icon={Scale} title="Judging" tone="gold">
              <p className="mb-5">You are seated on a PALMA panel this season.</p>
              <GlassButton href="/judge" icon={Scale} tone="gold">
                Open the judging room
              </GlassButton>
            </SidePanel>
          ) : null}

          {isStaff ? (
            <SidePanel icon={Settings} title="Administration">
              <GlassButton href="/admin" icon={Settings}>
                Open the command centre
              </GlassButton>
            </SidePanel>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
