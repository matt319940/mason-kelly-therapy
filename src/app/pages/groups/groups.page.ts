import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb, groupEvents } from '../../core/schema';
import { FEES, GROUPS } from '../../core/practice.config';
import { PageHero } from '../../shared/page-hero';
import { CtaBanner } from '../../shared/cta-banner';

@Component({
  selector: 'app-groups',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, CtaBanner],
  template: `
    <app-page-hero
      eyebrow="Support Groups"
      heading="Online Support Groups: Recovery, Anxiety & Depression"
      lead="Faith-centered, confidential groups offer shared experience, encouragement, and accountability — at an accessible price, fully online."
      [crumbs]="crumbs"
    >
      <a routerLink="/contact" class="btn btn--primary">Ask About Joining</a>
    </app-page-hero>

    <section class="section">
      <div class="container">
        <div class="grid grid--2">
          @for (g of groups; track g.slug) {
            <article class="card group-card">
              <h2 class="group-card__name">{{ g.name }}</h2>
              <p class="group-card__when">
                <strong>{{ g.cadence }}</strong> · {{ formatTime(g.start) }}–{{ formatTime(g.end) }}
              </p>
              <p>{{ g.summary }}</p>
              <p class="group-card__price">\${{ fees.groupMin }}–\${{ fees.groupMax }} per session</p>
              <a routerLink="/contact" class="btn btn--secondary">Ask about this group</a>
            </article>
          }
        </div>

        <div class="note note--brand groups-note">
          <h3>How groups work</h3>
          <p>
            Groups are confidential and faith-centered, with clear group norms and a brief screening
            before joining to make sure the fit is right. Group and individual therapy can be
            combined. Reach out and I’ll walk you through next steps.
          </p>
        </div>
      </div>
    </section>

    <app-cta-banner heading="Curious whether a group is right for you?" text="Reach out for a brief, no-pressure conversation about which group might fit — or whether individual therapy is the better place to start." />
  `,
  styles: [
    `
      .group-card__name {
        font-size: var(--fs-xl);
        color: var(--c-brand-dark);
      }
      .group-card__when {
        margin-top: var(--sp-2);
        color: var(--c-text-muted);
      }
      .group-card__price {
        font-weight: var(--fw-semibold);
        margin-top: var(--sp-3);
      }
      .group-card .btn {
        margin-top: var(--sp-4);
      }
      .groups-note {
        margin-top: var(--sp-6);
      }
    `,
  ],
})
export class GroupsPage {
  protected readonly groups = GROUPS;
  protected readonly fees = FEES;
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Support Groups', path: '/groups' },
  ];

  protected formatTime(t: string): string {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'pm' : 'am';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')}${period}`;
  }

  constructor() {
    inject(SeoService).page(
      {
        title: 'Online Therapy Support Groups in Illinois | Christian',
        description:
          'Join faith-centered online support groups in Illinois: Sex & Relationship Addiction (3rd Sun) and Equanimity for anxiety & depression (biweekly). $20–$60.',
        path: '/groups',
      },
      [breadcrumb(this.crumbs), ...groupEvents()],
    );
  }
}
