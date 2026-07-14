import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { SITE, absoluteUrl } from './practice.config';
import { SeoMeta } from './content/types';
import { StructuredDataService } from './structured-data.service';

/**
 * Sets per-route <title>, meta description, canonical, Open Graph, and Twitter
 * tags. Because Title/Meta and DOCUMENT all work under platform-server, these
 * resolve at prerender time and land in the static HTML; calling on each route
 * keeps a hydrated/SPA-navigated <head> from going stale.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly doc = inject(DOCUMENT);
  private readonly jsonLd = inject(StructuredDataService);

  /** Apply SEO tags and (optionally) JSON-LD structured data for a route. */
  page(seo: SeoMeta, structuredData?: object | object[]): void {
    this.apply(seo);
    if (structuredData) this.jsonLd.set(structuredData);
  }

  apply(seo: SeoMeta): void {
    const url = absoluteUrl(seo.path);
    const image = absoluteUrl(seo.ogImage ?? SITE.defaultOgImage);

    this.title.setTitle(seo.title);
    this.name('description', seo.description);
    this.name('robots', seo.noindex ? 'noindex, follow' : 'index, follow');
    this.setCanonical(url);

    // Open Graph
    this.property('og:type', seo.type ?? 'website');
    this.property('og:title', seo.title);
    this.property('og:description', seo.description);
    this.property('og:url', url);
    this.property('og:image', image);
    this.property('og:site_name', SITE.name);
    this.property('og:locale', SITE.locale);

    // Twitter
    this.name('twitter:card', 'summary_large_image');
    this.name('twitter:title', seo.title);
    this.name('twitter:description', seo.description);
    this.name('twitter:image', image);
  }

  private name(name: string, content: string): void {
    this.meta.updateTag({ name, content });
  }

  private property(property: string, content: string): void {
    this.meta.updateTag({ property, content });
  }

  private setCanonical(href: string): void {
    let link = this.doc.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
