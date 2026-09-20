import {
  Users,
  Trophy,
  Workflow,
  Monitor,
  UserPlus,
  UserCheck,
  UserX,
  ShieldCheck,
  Hourglass,
  EyeOff,
  Ban,
  Layers,
  ScrollText,
  CheckCircle2,
  Medal,
  Crown,
  Stamp,
  FileCheck,
  AlertTriangle,
  Flag,
  Scale,
  ClipboardList,
  KeyRound,
  Activity,
  Send,
  BookOpen,
} from 'lucide-react';
import type { AdminGroupBlock } from '@/components/vip/AdminOverviewView';

/* ───────────────────────────────────────────────────────────────────────────
   Preview fixtures

   Plausible figures for the four desks, so the design can be rendered,
   reviewed and screenshotted without a database behind it. Nothing here is
   imported by a real page: the desks take props, and in production those
   props come from `src/server/data`.
   ─────────────────────────────────────────────────────────────────────────── */

export const PORTAL_FIXTURE = {
  greeting: 'Good evening',
  firstName: 'Ines',
  work: [
    {
      href: '/portal/claims',
      label: 'Creator claim requests',
      count: 12,
      note: 'People asking to control a PALMA record.',
    },
    {
      href: '/portal/verification',
      label: 'Manual age verification',
      count: 5,
      note: 'Cases the provider could not settle.',
    },
    {
      href: '/portal/reports',
      label: 'Reports',
      count: 3,
      note: 'Open and under investigation.',
    },
    {
      href: '/portal/claims?filter=escalated',
      label: 'Escalations',
      count: 1,
      note: 'Handed up for an administrator.',
    },
    {
      href: '/portal/creators?filter=unpublished',
      label: 'Records awaiting publication',
      count: 0,
      note: 'Written by PALMA, not yet public.',
    },
  ],
  activity: [
    {
      id: 'a1',
      when: '20 Sep',
      title: 'claim approved',
      detail: 'Marisol Vance now controls her PALMA record.',
    },
    {
      id: 'a2',
      when: '20 Sep',
      title: 'verification cleared',
      detail: 'Provider returned a match on the second attempt.',
    },
    {
      id: 'a3',
      when: '19 Sep',
      title: 'report closed',
      detail: 'No breach of the content policy found.',
    },
    {
      id: 'a4',
      when: '19 Sep',
      title: 'record published',
      detail: 'Editorial desk published Kaia Renn.',
    },
    {
      id: 'a5',
      when: '18 Sep',
      title: 'claim escalated',
      detail: 'Competing claims on one record; handed up.',
    },
    {
      id: 'a6',
      when: '18 Sep',
      title: 'creator suspended',
      detail: 'Pending the outcome of an open report.',
    },
    {
      id: 'a7',
      when: '17 Sep',
      title: 'record amended',
      detail: 'Two links corrected on an existing record.',
    },
    {
      id: 'a8',
      when: '17 Sep',
      title: 'nomination accepted',
      detail: 'Candidacy opened in Breakthrough of the Year.',
    },
  ],
};

export const ADMIN_FIXTURE = {
  greeting: 'Good evening',
  firstName: 'Ines',
  periodLabel: 'Last 30 days',
  outstanding: 21,
  since: '21 August 2026',
  degraded: [] as string[],
  seasonLine: 'The 2026 Honours — Judging',
  groups: [
    {
      title: 'Creators',
      icon: Users,
      stats: [
        { icon: Layers, label: 'Total records', value: 4820, href: '/portal/creators' },
        { icon: UserPlus, label: 'Added', value: 312, note: 'Last 30 days' },
        { icon: UserCheck, label: 'Claimed', value: 1964, href: '/portal/creators?filter=claimed' },
        {
          icon: UserX,
          label: 'Unclaimed',
          value: 2856,
          href: '/portal/creators?filter=unclaimed',
        },
        { icon: ShieldCheck, label: 'Verified', value: 1702 },
        { icon: Hourglass, label: 'Verification pending', value: 48, tone: 'attention' as const },
        {
          icon: EyeOff,
          label: 'Unpublished',
          value: 137,
          href: '/portal/creators?filter=unpublished',
        },
        { icon: Ban, label: 'Suspended', value: 6, tone: 'attention' as const },
      ],
    },
    {
      title: 'Awards — The 2026 Honours, Judging',
      icon: Trophy,
      stats: [
        { icon: Layers, label: 'Categories', value: 12 },
        { icon: ScrollText, label: 'Nominations', value: 18426, href: '/portal/nominations' },
        { icon: CheckCircle2, label: 'Eligible', value: 964 },
        { icon: Medal, label: 'Finalists', value: 60, href: '/admin/selection' },
        {
          icon: Crown,
          label: 'Winners',
          value: 0,
          href: '/admin/selection',
          tone: 'gold' as const,
        },
        {
          icon: Stamp,
          label: 'Awaiting finalisation',
          value: 4,
          note: 'Scored, no honour conferred',
          tone: 'attention' as const,
          href: '/admin/selection',
        },
      ],
    },
    {
      title: 'Operations',
      icon: Workflow,
      stats: [
        {
          icon: FileCheck,
          label: 'Open claims',
          value: 12,
          href: '/portal/claims',
          tone: 'attention' as const,
        },
        {
          icon: AlertTriangle,
          label: 'Escalations',
          value: 1,
          href: '/portal/claims?filter=escalated',
          tone: 'attention' as const,
        },
        {
          icon: ShieldCheck,
          label: 'Verification queue',
          value: 5,
          href: '/portal/verification',
          tone: 'attention' as const,
        },
        {
          icon: Flag,
          label: 'Reports',
          value: 3,
          href: '/portal/reports',
          tone: 'attention' as const,
        },
        { icon: Scale, label: 'Declared conflicts', value: 9, href: '/admin/judging' },
        {
          icon: ClipboardList,
          label: 'Assessments outstanding',
          value: 214,
          href: '/admin/judging',
        },
      ],
    },
    {
      title: 'Platform',
      icon: Monitor,
      stats: [
        { icon: Users, label: 'Accounts', value: 6193, href: '/admin/users' },
        { icon: UserPlus, label: 'New accounts', value: 488, note: 'Last 30 days' },
        { icon: KeyRound, label: 'Active sessions', value: 341 },
        { icon: Send, label: 'Nomination activity', value: 9127, note: 'Last 30 days' },
        { icon: Activity, label: 'Claim activity', value: 268, note: 'Last 30 days' },
        {
          icon: BookOpen,
          label: 'Audited events',
          value: 41209,
          note: 'Last 30 days',
          href: '/admin/audit',
        },
      ],
    },
  ] satisfies AdminGroupBlock[],
};

export const JUDGE_FIXTURE = {
  greeting: 'Good evening',
  firstName: 'Tomás',
  judgeName: 'Tomás Aldrete',
  counts: { assigned: 48, completed: 31, remaining: 17, recused: 2 },
  season: {
    title: 'The 2026 Honours',
    daysRemaining: 6,
    closesAt: '26 September 2026',
  },
  categories: [
    {
      categoryId: 'c1',
      categoryName: 'Breakthrough of the Year',
      assigned: 12,
      completed: 12,
      nextAssignmentId: null,
    },
    {
      categoryId: 'c2',
      categoryName: 'Creator of the Year',
      assigned: 14,
      completed: 9,
      nextAssignmentId: 'as-2',
    },
    {
      categoryId: 'c3',
      categoryName: 'Best Collaboration',
      assigned: 10,
      completed: 6,
      nextAssignmentId: 'as-3',
    },
    {
      categoryId: 'c4',
      categoryName: 'Craft & Production',
      assigned: 12,
      completed: 4,
      nextAssignmentId: 'as-4',
    },
  ],
  notifications: [
    {
      id: 'n1',
      subject: 'Judging closes in six days',
      body: 'Seventeen cases remain on your panel. Assessments submitted after the deadline are not counted.',
      when: '20 Sep',
      href: '/judge/assignments',
    },
    {
      id: 'n2',
      subject: 'A conflict was upheld',
      body: 'You have been recused from one case in Craft & Production. It has been reassigned.',
      when: '18 Sep',
      href: null,
    },
  ],
  isChair: true,
  minJudges: 5,
};

export const CREATOR_FIXTURE = {
  displayName: 'Marisol Vance',
  honours: [
    {
      code: 'PLM-2025-BRK-0194',
      categoryName: 'Breakthrough of the Year',
      kind: 'Winner',
      year: 2025,
      revoked: false,
      verifyHref: '/verify/PLM-2025-BRK-0194',
    },
    {
      code: 'PLM-2024-COL-0072',
      categoryName: 'Best Collaboration',
      kind: 'Finalist',
      year: 2024,
      revoked: false,
      verifyHref: '/verify/PLM-2024-COL-0072',
    },
    {
      code: 'PLM-2023-CRT-0311',
      categoryName: 'Craft & Production',
      kind: 'Finalist',
      year: 2023,
      revoked: true,
      verifyHref: '/verify/PLM-2023-CRT-0311',
    },
  ],
  candidacies: [
    {
      id: 'cd1',
      reference: 'CND-26-0841',
      categoryName: 'Creator of the Year',
      year: 2026,
      status: 'Finalist',
      winner: false,
    },
    {
      id: 'cd2',
      reference: 'CND-26-1120',
      categoryName: 'Best Collaboration',
      year: 2026,
      status: 'Eligible',
      winner: false,
    },
    {
      id: 'cd3',
      reference: 'CND-25-0194',
      categoryName: 'Breakthrough of the Year',
      year: 2025,
      status: 'Winner',
      winner: true,
    },
  ],
  verificationStatus: 'Verified',
  verified: true,
  published: true,
  hasProfile: true,
  hasProfileRecord: true,
  dossier: { unread: 3, important: 1 },
  isJudge: true,
  isStaff: false,
};
