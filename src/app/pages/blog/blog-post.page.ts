import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SeoService } from '../../core/seo.service';
import { blogPosting, breadcrumb } from '../../core/schema';
import { CLINICIAN } from '../../core/practice.config';
import { Breadcrumbs } from '../../shared/breadcrumbs';
import { CtaBanner } from '../../shared/cta-banner';
import { BLOG_POSTS } from '../../content/blog/generated-posts';
import { BlogPost } from '../../content/blog/blog.types';
import { formatPostDate } from './format-date';

@Component({
  selector: 'app-blog-post',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, Breadcrumbs, CtaBanner],
  template: `
    @if (post) {
      <article>
        <header class="post-head">
          <div class="container container-narrow">
            <app-breadcrumbs [items]="crumbs" />
            <p class="post-head__cat eyebrow">{{ post.category }}</p>
            <h1>{{ post.title }}</h1>
            <p class="post-head__meta muted">
              By {{ clinician.name }}, {{ clinician.honorific }} ·
              {{ formatDate(post.date) }} · {{ post.readingMinutes }} min read
            </p>
          </div>
        </header>

        <div class="section">
          <div class="container container-narrow">
            <div class="prose" [innerHTML]="body"></div>

            <div class="post-byline">
              <p class="muted">
                Written by <a routerLink="/about">{{ clinician.name }}, {{ clinician.honorific }}</a>,
                a licensed Christian therapist offering online care across Illinois. This article is
                educational and is not a substitute for individualized care.
              </p>
            </div>

            @if (post.related.length) {
              <nav class="post-related" aria-label="Related">
                <h2>Related support</h2>
                <ul>
                  @for (link of post.related; track link.path) {
                    <li><a [routerLink]="link.path">{{ link.label }} →</a></li>
                  }
                </ul>
              </nav>
            }
          </div>
        </div>
      </article>

      <app-cta-banner />
    } @else {
      <section class="section">
        <div class="container container-narrow">
          <h1>Article not found</h1>
          <p>Sorry, that article doesn’t exist. Browse the <a routerLink="/blog">blog</a>.</p>
        </div>
      </section>
    }
  `,
  styles: [
    `
      .post-head {
        background: var(--c-tint);
        padding-block: var(--sp-7);
      }
      .post-head app-breadcrumbs {
        display: block;
        margin-bottom: var(--sp-4);
      }
      .post-head__meta {
        margin-top: var(--sp-4);
        font-size: var(--fs-sm);
      }
      .post-byline {
        margin-top: var(--sp-7);
        padding-top: var(--sp-5);
        border-top: 1px solid var(--c-border);
        font-size: var(--fs-sm);
      }
      .post-related {
        margin-top: var(--sp-6);
      }
      .post-related ul {
        list-style: none;
        padding: 0;
        margin: var(--sp-3) 0 0;
        display: grid;
        gap: var(--sp-2);
      }
      .post-related a {
        font-weight: var(--fw-semibold);
      }
    `,
  ],
})
export class BlogPostPage {
  protected readonly clinician = CLINICIAN;
  protected readonly formatDate = formatPostDate;
  protected readonly post: BlogPost | undefined;
  protected readonly body: SafeHtml;
  protected readonly crumbs;

  constructor() {
    const slug = inject(ActivatedRoute).snapshot.paramMap.get('slug');
    const sanitizer = inject(DomSanitizer);
    this.post = BLOG_POSTS.find((p) => p.slug === slug);
    this.body = this.post ? sanitizer.bypassSecurityTrustHtml(this.post.html) : '';
    this.crumbs = [
      { name: 'Home', path: '/' },
      { name: 'Blog', path: '/blog' },
      { name: this.post?.title ?? 'Article', path: `/blog/${slug}` },
    ];

    const seo = inject(SeoService);
    if (this.post) {
      const path = `/blog/${this.post.slug}`;
      seo.page(
        {
          title: this.post.title,
          description: this.post.description,
          path,
          type: 'article',
        },
        [
          blogPosting({
            title: this.post.title,
            description: this.post.description,
            path,
            datePublished: this.post.date,
            dateModified: this.post.updated,
          }),
          breadcrumb(this.crumbs),
        ],
      );
    } else {
      seo.apply({
        title: 'Article not found | Mason Kelly, LCSW',
        description: 'This article could not be found.',
        path: '/blog',
        noindex: true,
      });
    }
  }
}
