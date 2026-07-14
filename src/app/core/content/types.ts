/** Per-route SEO metadata, applied at prerender time and on client navigation. */
export interface SeoMeta {
  /** Full document <title> (~50–60 chars incl. brand). */
  title: string;
  /** Meta description (~150–160 chars). */
  description: string;
  /** Route path used for canonical + og:url, e.g. '/about'. */
  path: string;
  /** Root-relative or absolute OG image; falls back to the site default. */
  ogImage?: string;
  /** og:type — 'website' (default) or 'article'. */
  type?: 'website' | 'article';
  noindex?: boolean;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface CrumbItem {
  name: string;
  /** Omit on the current (leaf) page. */
  path?: string;
}

/** A bulleted "section" used by content pages (heading + paragraphs/points). */
export interface ContentSection {
  heading: string;
  body?: string;
  points?: string[];
}

/** Shared shape for service pillar + landing pages rendered by one template. */
export interface ServicePageContent {
  seo: SeoMeta;
  slug: string;
  eyebrow: string;
  h1: string;
  intro: string;
  /** Short serviceType string for JSON-LD Service. */
  serviceType: string;
  /** Per-session price for the Service Offer (defaults to the individual rate). */
  price?: number;
  /** "Who this is for" bullet list. */
  whoFor: string[];
  /** "What therapy looks like" sections. */
  sections: ContentSection[];
  faqs: FaqItem[];
  /** Related route paths for internal linking (clinically adjacent pillars). */
  related: { label: string; path: string }[];
  crumbs: CrumbItem[];
}
