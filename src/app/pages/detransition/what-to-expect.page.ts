import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb } from '../../core/schema';
import { CRISIS } from '../../core/practice.config';
import { PageHero } from '../../shared/page-hero';
import { CtaBanner } from '../../shared/cta-banner';

@Component({
  selector: 'app-detransition-what-to-expect',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, CtaBanner],
  template: `
    <app-page-hero
      eyebrow="Detransition Support"
      heading="What Detransition Therapy Looks Like: A Client-Led Process"
      lead="There is no agenda here but yours. Here’s how this voluntary, trauma-informed work unfolds, so you know what to expect before you ever begin."
      [crumbs]="crumbs"
    >
      <a routerLink="/contact" class="btn btn--primary">Reach Out for a Consultation</a>
    </app-page-hero>

    <section class="section">
      <div class="container container-narrow stack-lg">
        <section class="prose">
          <h2>The first conversation</h2>
          <p>
            We begin where you are. In our first conversation, your goals come from you — not from
            me. There’s no script to follow and no “right” thing to say. My job is to listen,
            understand, and make sure you feel safe.
          </p>
        </section>

        <section>
          <h2>What the work can include</h2>
          <ul class="checklist">
            <li>Space to explore ambivalence, decisions, grief, and integration at your pace</li>
            <li>Trauma-informed support for medical, physical, and social aspects of regret</li>
            <li>Coordination with and referral to medical providers, within the scope of my role</li>
            <li>The freedom to pause, change direction, or stop at any time</li>
            <li>Faith woven in only if and when you want it</li>
          </ul>
        </section>

        <section class="prose">
          <h2>Your autonomy, always</h2>
          <p>
            This is your journey. You decide what to explore and when. Confidentiality is protected
            within the standard legal and ethical limits, which I explain clearly at the start, and
            you are never pressured toward any outcome.
          </p>
        </section>

        <div class="note note--crisis">
          <h3>If you’re struggling right now</h3>
          <p>{{ crisis.note }}</p>
        </div>
      </div>
    </section>

    <app-cta-banner heading="When you’re ready, I’m here" text="There’s no pressure to decide anything today. Reaching out simply opens a conversation — at your pace, on your terms." />
  `,
})
export class DetransitionWhatToExpectPage {
  protected readonly crisis = CRISIS;
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Detransition Support', path: '/detransition-support' },
    { name: 'What to Expect', path: '/detransition-support/what-to-expect' },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'Detransition Therapy: What to Expect | Illinois Telehealth',
        description:
          'How client-led detransition therapy works: voluntary, paced by you, trauma-informed. No agenda but yours. Online with a Christian therapist in Illinois.',
        path: '/detransition-support/what-to-expect',
      },
      breadcrumb(this.crumbs),
    );
  }
}
