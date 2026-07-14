import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb, faqPage } from '../../core/schema';
import { FaqItem } from '../../core/content/types';
import { PageHero } from '../../shared/page-hero';
import { FaqList } from '../../shared/faq-list';
import { CtaBanner } from '../../shared/cta-banner';

@Component({
  selector: 'app-faq',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, FaqList, CtaBanner],
  template: `
    <app-page-hero
      eyebrow="FAQ"
      heading="Frequently Asked Questions About Online Christian Therapy"
      lead="Answers to common questions about faith-based therapy, telehealth in Illinois, insurance, and getting started."
      [crumbs]="crumbs"
    >
      <a routerLink="/contact" class="btn btn--primary">Still have questions? Reach out</a>
    </app-page-hero>

    <section class="section">
      <div class="container container-narrow">
        <app-faq-list [items]="faqs" />
      </div>
    </section>

    <app-cta-banner />
  `,
})
export class FaqPage {
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'FAQ', path: '/faq' },
  ];

  protected readonly faqs: FaqItem[] = [
    {
      q: 'What is Bible-based Christian counseling, and how is faith integrated?',
      a: 'It is licensed psychotherapy that integrates your faith with evidence-based clinical care. Scripture and prayer are woven in only at your pace and invitation — never imposed. You receive sound clinical treatment and faith support together, not one instead of the other.',
    },
    {
      q: 'Do I have to be a Christian to work with you?',
      a: 'Not at all. People of every background are warmly welcome. Faith is integrated only to the degree you want it; your goals always lead the work.',
    },
    {
      q: 'What is detransition support, and is it “conversion therapy”?',
      a: 'No — it is not conversion therapy. Detransition and transition-regret support is voluntary, client-led, trauma-informed talk therapy for adults who have themselves chosen to explore detransition or who are experiencing regret. It follows your goals and never pressures you toward any predetermined outcome.',
    },
    {
      q: 'How does online therapy in Illinois work, and is it confidential?',
      a: 'Sessions are held over a secure, private telehealth connection with anyone located in Illinois. Therapy is confidential within the standard legal and ethical limits, which I explain clearly at the start.',
    },
    {
      q: 'What are your fees, and do you accept insurance?',
      a: 'Individual sessions are $130 and couples sessions are $160, with a sliding scale available. More than 30 insurance plans are accepted, including Aetna, BCBS, Cigna, Humana, Medicare, UnitedHealthcare, and TRICARE.',
    },
    {
      q: 'What concerns do you treat, and who do you see?',
      a: 'I work with adults — individuals, couples, families, and groups — on trauma, addiction, abuse recovery, anxiety, depression, grief, relationships, sexual addiction, eating disorders, codependency, and identity concerns from a Bible-based perspective.',
    },
    {
      q: 'How do I get started, and what happens in the first session?',
      a: 'Reach out by email or the contact page and we’ll arrange a brief, no-pressure conversation. In your first full session we’ll talk through your story and goals at your pace — there’s no need to know exactly what to say.',
    },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'Christian Therapy FAQ | Online Illinois | Mason Kelly LCSW',
        description:
          'Answers on faith-based therapy, telehealth in Illinois, insurance, detransition support, fees & confidentiality. Get clarity before you book with Mason Kelly LCSW.',
        path: '/faq',
      },
      [breadcrumb(this.crumbs), faqPage(this.faqs)],
    );
  }
}
