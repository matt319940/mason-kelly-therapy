import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb, faqPage, service } from '../../core/schema';
import { FaqItem } from '../../core/content/types';
import { PageHero } from '../../shared/page-hero';
import { FaqList } from '../../shared/faq-list';
import { CtaBanner } from '../../shared/cta-banner';

@Component({
  selector: 'app-christian-counseling',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, FaqList, CtaBanner],
  template: `
    <app-page-hero
      eyebrow="Christian Counseling"
      heading="Bible-Based Christian Counseling, Online in Illinois"
      lead="Faith and clinical care, working together. I integrate biblical principles with proven, evidence-based therapy — at your pace, and always your choice."
      [crumbs]="crumbs"
    >
      <a routerLink="/contact" class="btn btn--primary">Reach Out for a Consultation</a>
    </app-page-hero>

    <section class="section">
      <div class="container container-narrow stack-lg">
        <section class="prose">
          <h2>What Bible-based counseling means here</h2>
          <p>
            As a Christian, I utilize biblical principles to address spiritual needs and concerns —
            woven together with licensed, evidence-based clinical practice. This is not either/or.
            You receive sound psychotherapy <em>and</em> faith-integrated support, from one licensed
            clinician who honors both.
          </p>
          <p>
            Scripture and prayer are invited into our work only when, and to the degree, you want
            them. Clients of all backgrounds are warmly welcome, and your goals always lead.
          </p>
        </section>

        <section>
          <h2>How I work</h2>
          <ul class="checklist">
            <li>Evidence-based methods, including CBT, trauma-informed care, and clinical hypnotherapy (NBCCH)</li>
            <li>Faith integrated at your invitation — never imposed or used to pressure you</li>
            <li>A clear difference from pastoral counseling: licensed clinical psychotherapy</li>
            <li>Care for spirituality, doubt, identity, relationships, and cultural or political stress</li>
          </ul>
        </section>

        <div class="note note--brand">
          <h3>A note on ethics</h3>
          <p>
            All care here is client-led and voluntary. Faith is a resource I offer, never a result I
            require. I do not provide coercive or change-oriented “conversion” therapy of any kind.
          </p>
        </div>

        <section>
          <h2>Where faith meets life</h2>
          <p class="muted">
            Faith-integrated therapy can support nearly any area of life. Explore specific support:
          </p>
          <div class="grid grid--2">
            <a routerLink="/services/trauma-ptsd-therapy" class="card card--link"><h3>Trauma &amp; PTSD</h3><span class="card__more">Learn more →</span></a>
            <a routerLink="/services/addiction-recovery-therapy" class="card card--link"><h3>Addiction &amp; Recovery</h3><span class="card__more">Learn more →</span></a>
            <a routerLink="/services/depression-anxiety-therapy" class="card card--link"><h3>Depression &amp; Anxiety</h3><span class="card__more">Learn more →</span></a>
            <a routerLink="/detransition-support" class="card card--link"><h3>Detransition Support</h3><span class="card__more">Learn more →</span></a>
          </div>
        </section>

        <app-faq-list [items]="faqs" heading="Common questions" />
      </div>
    </section>

    <app-cta-banner />
  `,
})
export class ChristianCounselingPage {
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Christian Counseling', path: '/christian-counseling' },
  ];

  protected readonly faqs: FaqItem[] = [
    {
      q: 'How is this different from pastoral counseling?',
      a: 'Pastoral counseling is spiritual guidance offered by clergy. I provide licensed clinical psychotherapy that integrates faith — diagnosis-informed, evidence-based treatment from a Licensed Clinical Social Worker, which can also be billed to insurance.',
    },
    {
      q: 'Do I have to be a Christian?',
      a: 'No. People of all backgrounds are welcome. Faith is integrated only to the degree you want it.',
    },
    {
      q: 'Will you pray with me or use Scripture?',
      a: 'If you would like that, yes — at your invitation and pace. If you’d prefer we don’t, that’s completely fine too.',
    },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'Christian Counseling Illinois | Bible-Based Telehealth',
        description:
          'Bible-based Christian counseling that integrates faith with clinical, evidence-based care. Online across Illinois with Mason L. Kelly, MSW, LCSW. 22+ years.',
        path: '/christian-counseling',
      },
      [
        service({
          name: 'Bible-Based Christian Counseling',
          serviceType: 'Faith-integrated psychotherapy',
          description:
            'Bible-based Christian counseling integrating faith with evidence-based clinical care, online across Illinois.',
        }),
        breadcrumb(this.crumbs),
        faqPage(this.faqs),
      ],
    );
  }
}
