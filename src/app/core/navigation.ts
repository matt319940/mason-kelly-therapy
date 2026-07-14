export interface NavLink {
  label: string;
  path: string;
}

export interface NavGroup {
  label: string;
  path: string;
  children?: NavLink[];
}

/** The 9 clinical service pillars (used by nav, services hub, and footer). */
export const SERVICE_LINKS: NavLink[] = [
  { label: 'Trauma & PTSD Therapy', path: '/services/trauma-ptsd-therapy' },
  { label: 'Addiction & Recovery', path: '/services/addiction-recovery-therapy' },
  { label: 'Abuse & Sexual Abuse Recovery', path: '/services/abuse-sexual-abuse-recovery' },
  { label: 'Depression & Anxiety', path: '/services/depression-anxiety-therapy' },
  { label: 'Sexual Addiction', path: '/services/sexual-addiction-therapy' },
  { label: 'Couples & Marriage', path: '/services/couples-marriage-counseling' },
  { label: 'Grief & Loss', path: '/services/grief-counseling' },
  { label: 'Eating Disorders', path: '/services/eating-disorder-therapy' },
  { label: 'Codependency', path: '/services/codependency-therapy' },
];

export const MAIN_NAV: NavGroup[] = [
  { label: 'About', path: '/about' },
  {
    label: 'Services',
    path: '/services',
    children: [
      ...SERVICE_LINKS,
      { label: 'Detransition Support', path: '/detransition-support' },
      { label: 'Support Groups', path: '/groups' },
    ],
  },
  { label: 'Christian Counseling', path: '/christian-counseling' },
  { label: 'Fees & Insurance', path: '/fees-insurance' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
];
