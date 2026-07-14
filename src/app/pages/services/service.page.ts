import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb, faqPage, service } from '../../core/schema';
import { FEES } from '../../core/practice.config';
import { ServicePageContent } from '../../core/content/types';
import { SERVICE_CONTENT } from './service-content';
import { PageHero } from '../../shared/page-hero';
import { FaqList } from '../../shared/faq-list';
import { CtaBanner } from '../../shared/cta-banner';

/**
 * One template renders all 9 service pillar pages. The active page is selected
 * by the `slug` provided in the route `data`, and its content drives both the
 * visible markup and the Service / BreadcrumbList / FAQPage structured data.
 */
@Component({
  selector: 'app-service-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, FaqList, CtaBanner],
  template: `
    <app-page-hero
      [eyebrow]="content.eyebrow"
      [heading]="content.h1"
      [lead]="content.intro"
      [crumbs]="content.crumbs"
    >
      <a routerLink="/contact" class="btn btn--primary">Reach Out for a Consultation</a>
    </app-page-hero>

    <div class="section">
      <div class="container service-layout">
        <div class="service-main stack-lg">
          <section aria-labelledby="who-for">
            <h2 id="who-for">Who this is for</h2>
            <ul class="checklist">
              @for (item of content.whoFor; track item) {
                <li>{{ item }}</li>
              }
            </ul>
          </section>

          @for (sec of content.sections; track sec.heading) {
            <section>
              <h2>{{ sec.heading }}</h2>
              @if (sec.body) {
                <p class="service-body">{{ sec.body }}</p>
              }
              @if (sec.points) {
                <ul class="service-points">
                  @for (p of sec.points; track p) {
                    <li>{{ p }}</li>
                  }
                </ul>
              }
            </section>
          }

          <section aria-labelledby="faq-head">
            <app-faq-list [items]="content.faqs" heading="Common questions" />
          </section>
        </div>

        <aside class="service-aside">
          <div class="card service-aside__card">
            <h2 class="service-aside__title">Start here</h2>
            <p class="muted">
              Online across Illinois. Individual sessions \${{ fees.individual }}; sliding scale
              available; most major insurance accepted.
            </p>
            <a routerLink="/contact" class="btn btn--primary">Reach Out</a>
            <a routerLink="/fees-insurance" class="service-aside__link">Fees &amp; insurance →</a>
          </div>

          @if (content.related.length) {
            <nav class="card service-aside__card" aria-label="Related services">
              <h2 class="service-aside__title">Related support</h2>
              <ul class="service-related">
                @for (link of content.related; track link.path) {
                  <li><a [routerLink]="link.path">{{ link.label }}</a></li>
                }
              </ul>
            </nav>
          }
        </aside>
      </div>
    </div>

    <app-cta-banner />
  `,
  styles: [
    `
      .service-layout {
        display: grid;
        gap: var(--sp-7);
        align-items: start;
      }
      .service-body {
        font-size: var(--fs-lg);
        color: var(--c-text-muted);
        max-width: 60ch;
      }
      .service-points {
        margin-top: var(--sp-3);
        display: grid;
        gap: var(--sp-2);
        max-width: 60ch;
      }
      .service-aside__card + .service-aside__card {
        margin-top: var(--sp-5);
      }
      .service-aside__title {
        font-size: var(--fs-lg);
        color: var(--c-brand-dark);
        margin-bottom: var(--sp-3);
      }
      .service-aside__card .btn {
        width: 100%;
        margin-top: var(--sp-4);
      }
      .service-aside__link {
        display: inline-block;
        margin-top: var(--sp-3);
        font-weight: var(--fw-semibold);
      }
      .service-related {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--sp-2);
      }
      @media (min-width: 920px) {
        .service-layout {
          grid-template-columns: minmax(0, 1fr) 20rem;
        }
        .service-aside {
          position: sticky;
          top: calc(var(--header-h) + var(--sp-5));
        }
      }
    `,
  ],
})
export class ServicePage {
  protected readonly fees = FEES;
  protected readonly content: ServicePageContent;

  constructor() {
    const slug = inject(ActivatedRoute).snapshot.data['slug'] as string;
    this.content = SERVICE_CONTENT[slug];
    inject(SeoService).page(this.content.seo, [
      service({
        name: this.content.h1,
        serviceType: this.content.serviceType,
        description: this.content.seo.description,
        price: this.content.price ?? FEES.individual,
      }),
      breadcrumb(this.content.crumbs),
      faqPage(this.content.faqs),
    ]);
  }
}
