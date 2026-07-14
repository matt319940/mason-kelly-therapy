export interface BlogPostLink {
  label: string;
  path: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  /** ISO date (yyyy-mm-dd). */
  date: string;
  updated?: string;
  category: string;
  readingMinutes: number;
  related: BlogPostLink[];
  /** Rendered, trusted HTML (authored in-repo markdown). */
  html: string;
}
