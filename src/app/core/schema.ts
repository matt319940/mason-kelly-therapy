/**
 * JSON-LD structured-data builders. Each returns a plain object serialized into a
 * <script type="application/ld+json"> block by StructuredDataService.
 *
 * Design decisions (from research, June 2026):
 *  - Primary type is MedicalBusiness (NOT deprecated ProfessionalService, NOT Physician/MD-only).
 *  - One canonical Person (@id) reused as author/employee/founder for YMYL E-E-A-T.
 *  - NO self-serving aggregateRating/review (renders no stars; policy risk).
 *  - FAQPage kept for entity/AI parsing only (rich result removed May 2026).
 *  - All strings stay strictly client-led / voluntary / trauma-informed (no "conversion therapy").
 */
import {
  CLINICIAN,
  CONTACT,
  FEES,
  GROUPS,
  PERSON_ID,
  PRACTICE_ID,
  SAME_AS,
  SITE,
  WEBSITE_ID,
  absoluteUrl,
  SupportGroup,
} from './practice.config';
import { CrumbItem, FaqItem } from './content/types';

type Json = Record<string, unknown>;

const ILLINOIS = { '@type': 'State', name: 'Illinois' };

export function medicalBusiness(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    '@id': PRACTICE_ID,
    name: SITE.name,
    description:
      'Faith-centered, Bible-based Christian psychotherapy via secure telehealth across Illinois. Individual, couples, family, and group therapy for trauma, addiction, abuse recovery, anxiety, depression, grief, relationships, and client-led detransition and transition-regret support.',
    url: `${SITE.origin}/`,
    ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}),
    ...(CONTACT.email ? { email: CONTACT.email } : {}),
    priceRange: '$130-$160 (sliding scale available)',
    medicalSpecialty: 'Psychiatric',
    // Online-only: region without a public storefront street address.
    address: { '@type': 'PostalAddress', addressRegion: 'IL', addressCountry: 'US' },
    areaServed: ILLINOIS,
    availableLanguage: 'English',
    availableService: [
      { '@type': 'MedicalTherapy', name: 'Individual Psychotherapy' },
      { '@type': 'MedicalTherapy', name: 'Couples Therapy' },
      { '@type': 'MedicalTherapy', name: 'Family Therapy' },
      { '@type': 'MedicalTherapy', name: 'Group Therapy' },
    ],
    openingHoursSpecification: CONTACT.hours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: h.days,
      opens: h.opens,
      closes: h.closes,
    })),
    founder: { '@id': PERSON_ID },
    employee: { '@id': PERSON_ID },
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };
}

export function person(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': PERSON_ID,
    name: CLINICIAN.name,
    honorificSuffix: CLINICIAN.honorific,
    jobTitle: CLINICIAN.jobTitle,
    worksFor: { '@id': PRACTICE_ID },
    alumniOf: { '@type': 'CollegeOrUniversity', name: CLINICIAN.education },
    knowsAbout: [...CLINICIAN.knowsAbout],
    hasCredential: CLINICIAN.credentials.map((c) => ({
      '@type': 'EducationalOccupationalCredential',
      credentialCategory: c.category,
      name: c.name,
      ...(c.identifier ? { identifier: c.identifier } : {}),
      ...(c.board ? { recognizedBy: { '@type': 'Organization', name: c.board } } : {}),
    })),
    ...(SAME_AS.length ? { sameAs: SAME_AS } : {}),
  };
}

export function website(): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    url: `${SITE.origin}/`,
    inLanguage: 'en-US',
    publisher: { '@id': PRACTICE_ID },
  };
}

export interface ServiceSchemaOpts {
  name: string;
  serviceType: string;
  description: string;
  price?: number;
}

export function service(opts: ServiceSchemaOpts): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: opts.name,
    serviceType: opts.serviceType,
    description: opts.description,
    provider: { '@id': PRACTICE_ID },
    areaServed: ILLINOIS,
    ...(opts.price
      ? {
          offers: {
            '@type': 'Offer',
            price: opts.price.toFixed(2),
            priceCurrency: FEES.currency,
            description: 'Per session; sliding scale available. Most major insurance accepted.',
            availability: 'https://schema.org/InStock',
          },
        }
      : {}),
  };
}

export function faqPage(items: FaqItem[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

export function breadcrumb(items: CrumbItem[]): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      ...(c.path ? { item: absoluteUrl(c.path) } : {}),
    })),
  };
}

export interface BlogPostSchemaOpts {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
}

export function blogPosting(opts: BlogPostSchemaOpts): Json {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: { '@type': 'WebPage', '@id': absoluteUrl(opts.path) },
    headline: opts.title,
    description: opts.description,
    image: absoluteUrl(opts.image ?? SITE.defaultOgImage),
    datePublished: opts.datePublished,
    dateModified: opts.dateModified ?? opts.datePublished,
    author: { '@id': PERSON_ID },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/logo.svg') },
    },
  };
}

function eventSeries(group: SupportGroup): Json {
  const byDay = `https://schema.org/${group.day}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'EventSeries',
    name: group.name,
    description: group.summary,
    eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
    location: { '@type': 'VirtualLocation', url: `${SITE.origin}/groups` },
    eventSchedule: {
      '@type': 'Schedule',
      byDay,
      startTime: group.start,
      endTime: group.end,
    },
    organizer: { '@id': PERSON_ID },
    offers: {
      '@type': 'Offer',
      price: FEES.groupMin.toFixed(2),
      priceCurrency: FEES.currency,
      description: `$${FEES.groupMin}-$${FEES.groupMax} per session`,
    },
  };
}

export function groupEvents(): Json[] {
  return GROUPS.map(eventSeries);
}
