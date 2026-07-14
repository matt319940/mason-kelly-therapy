import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb } from '../../core/schema';
import { SERVICE_LINKS } from '../../core/navigation';
import { SERVICE_CONTENT } from './service-content';
import { PageHero } from '../../shared/page-hero';
import { CtaBanner } from '../../shared/cta-banner';

@Component({
  selector: 'app-services',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, CtaBanner],
  template: `
    <app-page-hero
      eyebrow="Services"
      heading="Therapy Services: Individual, Couples, Family & Group"
      lead="Specialized, faith-centered care delivered securely online throughout Illinois — for individuals, couples, and families."
      [crumbs]="crumbs"
    >
      <a routerLink="/contact" class="btn btn--primary">Reach Out for a Consultation</a>
    </app-page-hero>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <h2>Areas of focus</h2>
          <p class="lead">Each area has a dedicated page with how I work and what to expect.</p>
        </div>
        <div class="grid grid--3">
          @for (s of cards; track s.path) {
            <a [routerLink]="s.path" class="card card--link">
              <h3>{{ s.label }}</h3>
              <p>{{ s.blurb }}</p>
              <span class="card__more">Learn more →</span>
            </a>
          }
        </div>
      </div>
    </section>

    <section class="section section--tint">
      <div class="container grid grid--2">
        <a routerLink="/detransition-support" class="card card--link">
          <h3>Detransition &amp; transition-regret support</h3>
          <p>
            Voluntary, client-led, trauma-informed support from a Christian therapist who has
            walked this road — never coercive, never conversion therapy.
          </p>
          <span class="card__more">Learn more →</span>
        </a>
        <a routerLink="/groups" class="card card--link">
          <h3>Online support groups</h3>
          <p>
            Affordable, faith-centered groups for recovery and for anxiety &amp; depression,
            offered over secure telehealth.
          </p>
          <span class="card__more">Explore groups →</span>
        </a>
      </div>
    </section>

    <app-cta-banner />
  `,
})
export class ServicesPage {
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
  ];

  protected readonly cards = SERVICE_LINKS.map((link) => {
    const slug = link.path.split('/').pop() as string;
    return { label: link.label, path: link.path, blurb: SERVICE_CONTENT[slug].intro };
  });

  constructor() {
    inject(SeoService).page(
      {
        title: 'Therapy Services in Illinois | Christian Telehealth',
        description:
          'Individual, couples, family & group therapy online in Illinois. Trauma, addiction, anxiety, abuse recovery, grief & more — faith-centered with Mason Kelly, LCSW.',
        path: '/services',
      },
      breadcrumb(this.crumbs),
    );
  }
}
