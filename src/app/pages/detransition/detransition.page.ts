import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb, faqPage, service } from '../../core/schema';
import { FaqItem } from '../../core/content/types';
import { PageHero } from '../../shared/page-hero';
import { FaqList } from '../../shared/faq-list';
import { CtaBanner } from '../../shared/cta-banner';

@Component({
  selector: 'app-detransition',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, FaqList, CtaBanner],
  template: `
    <app-page-hero
      eyebrow="A compassionate, judgment-free space"
      heading="Christian Detransition & Transition-Regret Support in Illinois"
      lead="If you are navigating detransition or transition regret, you deserve a licensed therapist who understands — without judgment and without an agenda. As someone who has walked this road myself, I offer voluntary, client-led, trauma-informed support."
      [crumbs]="crumbs"
    >
      <a routerLink="/contact" class="btn btn--primary">Reach Out for a Consultation</a>
    </app-page-hero>

    <section class="section">
      <div class="container container-narrow stack-lg">
        <div class="note note--brand">
          <h3>What this is — and isn’t</h3>
          <p>
            This is voluntary, client-led, trauma-informed talk therapy that follows
            <em>your</em> goals. It is for adults who have themselves chosen to explore detransition
            or who are experiencing transition regret. It is <strong>not</strong> conversion therapy,
            and it never pressures you toward any predetermined outcome. You set the direction; I
            walk alongside you.
          </p>
        </div>

        <section class="prose">
          <h2>A therapist who understands from the inside</h2>
          <p>
            I transitioned from female to male and, in time, made the decision to detransition back
            to female. Because I have lived this, I can hold space for the grief, identity questions,
            and faith struggles that can accompany detransition — with empathy rather than judgment.
            <a routerLink="/about">Read more of my story.</a>
          </p>
        </section>

        <section>
          <h2>What support can look like</h2>
          <ul class="checklist">
            <li>Voluntary and paced entirely by you — explore, pause, or stop at any time</li>
            <li>Grief, identity, and body image after detransition</li>
            <li>Trauma-informed care for medical or surgical regret and social fallout</li>
            <li>Rebuilding family and relationships at your own pace</li>
            <li>Reconnecting faith and self, only if and when you want that</li>
          </ul>
        </section>

        <section>
          <h2>Explore further</h2>
          <div class="grid grid--2">
            <a routerLink="/detransition-support/what-to-expect" class="card card--link">
              <h3>What therapy looks like</h3>
              <p>A client-led process, paced by you, with no agenda but yours.</p>
              <span class="card__more">Read more →</span>
            </a>
            <a routerLink="/detransition-support/faith-and-identity" class="card card--link">
              <h3>Faith &amp; identity</h3>
              <p>Reconnecting with yourself and your faith after detransition.</p>
              <span class="card__more">Read more →</span>
            </a>
          </div>
        </section>

        <app-faq-list [items]="faqs" heading="Common questions" />
      </div>
    </section>

    <app-cta-banner heading="You don’t have to navigate this alone" text="When you’re ready, reach out for a confidential, no-pressure conversation. This is your journey, and your goals lead the way." />
  `,
})
export class DetransitionPage {
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Detransition Support', path: '/detransition-support' },
  ];

  protected readonly faqs: FaqItem[] = [
    {
      q: 'Is this conversion therapy?',
      a: 'No. This is voluntary, client-led, trauma-informed talk therapy for adults who have chosen to explore detransition or who are experiencing regret. It follows your goals and never pressures you toward any predetermined outcome.',
    },
    {
      q: 'Do I have to be religious to get this support?',
      a: 'No. Faith is offered as a resource only if you want it. Many clients find it meaningful; others don’t — both are completely welcome, and your comfort comes first.',
    },
    {
      q: 'Will you tell me what decision to make?',
      a: 'No. My role is to walk alongside you, not to direct your choices. You remain in control of your goals, your pace, and your direction throughout.',
    },
    {
      q: 'Is this confidential?',
      a: 'Yes. Sessions are private and held over secure telehealth with adults located in Illinois, within the standard limits of clinical confidentiality, which I explain clearly at the start.',
    },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'Detransition Therapist in Illinois | Christian Support',
        description:
          'Compassionate, client-led detransition and transition-regret therapy from a Christian therapist who has walked this path. Voluntary, trauma-informed. Telehealth across Illinois.',
        path: '/detransition-support',
      },
      [
        service({
          name: 'Detransition & Transition-Regret Support',
          serviceType: 'Detransition and transition-regret support (Christian, client-led)',
          description:
            'Confidential, voluntary, client-led and trauma-informed support for adults navigating detransition or transition regret, offered from a Christian perspective via secure telehealth across Illinois.',
        }),
        breadcrumb(this.crumbs),
        faqPage(this.faqs),
      ],
    );
  }
}
