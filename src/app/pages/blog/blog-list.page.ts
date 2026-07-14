import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb } from '../../core/schema';
import { SITE, absoluteUrl } from '../../core/practice.config';
import { PageHero } from '../../shared/page-hero';
import { CtaBanner } from '../../shared/cta-banner';
import { BLOG_POSTS } from '../../content/blog/generated-posts';
import { formatPostDate } from './format-date';

@Component({
  selector: 'app-blog-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, CtaBanner],
  template: `
    <app-page-hero
      eyebrow="Blog"
      heading="Insights on Faith, Healing & Hope"
      lead="Compassionate, faith-centered articles on trauma, addiction, anxiety, relationships, and detransition support."
      [crumbs]="crumbs"
    />

    <section class="section">
      <div class="container">
        <ul class="post-grid">
          @for (post of posts; track post.slug) {
            <li>
              <a [routerLink]="['/blog', post.slug]" class="card card--link post-card">
                <p class="post-card__cat">{{ post.category }}</p>
                <h2 class="post-card__title">{{ post.title }}</h2>
                <p class="post-card__desc">{{ post.description }}</p>
                <p class="post-card__meta muted">
                  {{ formatDate(post.date) }} · {{ post.readingMinutes }} min read
                </p>
              </a>
            </li>
          }
        </ul>
      </div>
    </section>

    <app-cta-banner />
  `,
  styles: [
    `
      .post-grid {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--sp-5);
      }
      .post-card__cat {
        font-size: var(--fs-xs);
        font-weight: var(--fw-semibold);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--c-brand);
      }
      .post-card__title {
        margin-top: var(--sp-2);
        font-size: var(--fs-xl);
        color: var(--c-text);
      }
      .post-card__desc {
        margin-top: var(--sp-2);
        color: var(--c-text-muted);
        max-width: 60ch;
      }
      .post-card__meta {
        margin-top: var(--sp-3);
        font-size: var(--fs-sm);
      }
      @media (min-width: 760px) {
        .post-grid {
          grid-template-columns: repeat(2, 1fr);
        }
      }
    `,
  ],
})
export class BlogListPage {
  protected readonly posts = BLOG_POSTS;
  protected readonly formatDate = formatPostDate;
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog', path: '/blog' },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'Christian Therapy Blog | Faith, Healing & Mental Health',
        description:
          'Compassionate, faith-centered articles on trauma, addiction, anxiety, relationships and detransition support from Mason L. Kelly, LCSW, in Illinois.',
        path: '/blog',
      },
      [
        breadcrumb(this.crumbs),
        {
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: 'Mason L. Kelly, LCSW — Blog',
          url: absoluteUrl('/blog'),
          inLanguage: 'en-US',
          publisher: { name: SITE.name },
          blogPost: this.posts.map((p) => ({
            '@type': 'BlogPosting',
            headline: p.title,
            datePublished: p.date,
            url: absoluteUrl(`/blog/${p.slug}`),
          })),
        },
      ],
    );
  }
}
