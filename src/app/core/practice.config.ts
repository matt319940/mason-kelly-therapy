/**
 * SINGLE SOURCE OF TRUTH for the practice's business data.
 *
 * Visible copy, the footer, the fees table, and all JSON-LD structured data read
 * from here so that NAP / credentials / fees stay byte-consistent everywhere
 * (inconsistent NAP is a documented local-SEO ranking leak).
 *
 * ⚠️ PRE-LAUNCH: items marked TODO must be confirmed by the client before launch.
 */

export const SITE = {
  name: 'Mason L. Kelly, LCSW — Faith-Centered Christian Therapy/Counseling',
  shortName: 'Mason Kelly, LCSW',
  /**
   * Canonical domain. Keep in sync with scripts/generate-sitemap.mjs and public/robots.txt.
   * NOT masonkellytherapy.com — that is the client's separate contact-form site,
   * which every CTA links to via CONTACT.contactUrl below.
   */
  origin: 'https://www.masonkellytherapist.com',
  defaultOgImage: '/og-default.svg',
  locale: 'en_US',
  tagline: 'Faith-Centered, Bible-Based Christian Therapy — Online Across Illinois',
} as const;

export interface Credential {
  abbr: string;
  name: string;
  category: 'degree' | 'license' | 'certification';
  identifier?: string;
  board?: string;
}

export const CLINICIAN = {
  name: 'Mason L. Kelly',
  honorific: 'MSW, LCSW',
  jobTitle: 'Licensed Clinical Social Worker',
  yearsExperience: 22,
  education: 'University of Illinois at Urbana-Champaign',
  graduationYear: 2003,
  credentials: [
    { abbr: 'MSW', name: 'Master of Social Work', category: 'degree' },
    {
      abbr: 'LCSW',
      name: 'Licensed Clinical Social Worker',
      category: 'license',
      identifier: 'IL #149011810',
      board: 'Illinois Department of Financial and Professional Regulation',
    },
    { abbr: 'NBCCH', name: 'National Board Certified Clinical Hypnotherapist', category: 'certification' },
    { abbr: 'CSOTS', name: 'Certified Sex Offender Treatment Specialist', category: 'certification' },
    { abbr: 'CADC', name: 'Certified Alcohol & Drug Counselor', category: 'certification' },
  ] satisfies Credential[],
  knowsAbout: [
    'Christian therapy/counseling',
    'Bible-based therapy',
    'detransition and transition-regret support',
    'trauma-informed psychotherapy',
    'addiction recovery',
    'clinical hypnotherapy',
    'codependency',
    'grief and loss',
  ],
} as const;

export const CONTACT = {
  /** Online-only, statewide Illinois telehealth (confirmed with client). */
  onlineOnly: true,
  areaServed: 'Illinois',
  /** TODO: confirm the single verified phone (PT profile and old site disagree). */
  phone: '+1-773-972-3577', // e.g. '+1-773-000-0000' — leave blank until verified
  phoneDisplay: '(773) 972-3577', // e.g. '(773) 000-0000'
  /**
   * Intentionally blank. Enquiries go through the contact form at `contactUrl`, not email.
   * Every email element in the UI and in JSON-LD is guarded on this being non-empty, so
   * leaving it '' removes them cleanly. Set it only if the practice wants email back.
   */
  email: 'masonkellylscw@aol.com',
  /** The client's separate contact-form site. Primary call-to-action target sitewide. */
  contactUrl: 'https://masonkellytherapy.com',
  hours: [
    { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '09:00', closes: '18:00' },
  ],
} as const;

export const FEES = {
  individual: 130,
  family: 160,
  couples: 160,
  groupMin: 20,
  groupMax: 60,
  slidingScale: true,
  currency: 'USD',
  /** TODO: verify the current accepted insurance panels before launch ("30+ plans"). */
  insurers: [
    'Aetna',
    'Blue Cross Blue Shield',
    'Cigna',
    'Humana',
    'Medicare',
    'UnitedHealthcare',
    'TRICARE',
  ],
  insurerNote: 'and 30+ additional plans',
} as const;

export interface SupportGroup {
  name: string;
  slug: string;
  cadence: string;
  day: string;
  start: string; // 24h HH:mm
  end: string;
  summary: string;
}

export const GROUPS: SupportGroup[] = [
  {
    name: 'Sex & Relationship Addiction Group',
    slug: 'sex-relationship-addiction',
    cadence: 'Third Saturday of each month',
    day: 'Saturday',
    start: '10:30',
    end: '13:00',
    summary:
      'A confidential, faith-centered group for adults working toward recovery from compulsive sexual behavior and relationship patterns.',
  },
  {
    name: 'Equanimity Group (Anxiety & Depression)',
    slug: 'equanimity-anxiety-depression',
    cadence: 'Every other Monday',
    day: 'Monday',
    start: '15:00',
    end: '16:30',
    summary:
      'A biweekly support group offering tools, encouragement, and community for those navigating anxiety and depression.',
  },
];

/** External profiles for schema `sameAs` and footer links. */
export const SAME_AS: string[] = [
  'https://www.psychologytoday.com/us/therapists/mason-l-kelly-chicago-il/89590',
];

/** Crisis line shown on Contact and high-sensitivity pages (this is not a crisis service). */
export const CRISIS = {
  line: '988',
  label: '988 Suicide & Crisis Lifeline',
  note: 'If you are in crisis or thinking about harming yourself, call or text 988, or dial 911. This practice is not a crisis or emergency service.',
} as const;

/** Build an absolute URL from a root-relative path. */
export function absoluteUrl(path: string): string {
  if (/^https?:\/\//.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE.origin}${clean === '/' ? '/' : clean.replace(/\/$/, '')}`;
}

export const PRACTICE_ID = `${SITE.origin}/#practice`;
export const PERSON_ID = `${SITE.origin}/#mason`;
export const WEBSITE_ID = `${SITE.origin}/#website`;
