import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb, faqPage } from '../../core/schema';
import { FEES } from '../../core/practice.config';
import { FaqItem } from '../../core/content/types';
import { PageHero } from '../../shared/page-hero';
import { FaqList } from '../../shared/faq-list';
import { CtaBanner } from '../../shared/cta-banner';

@Component({
  selector: 'app-fees',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, FaqList, CtaBanner],
  template: `
    <app-page-hero
      eyebrow="Fees & Insurance"
      heading="Fees, Insurance & Sliding-Scale Therapy in Illinois"
      lead="Transparent, straightforward pricing — with insurance and a sliding scale to help make care accessible."
      [crumbs]="crumbs"
    >
      <a routerLink="/contact" class="btn btn--primary">Verify Benefits / Reach Out</a>
    </app-page-hero>

    <section class="section">
      <div class="container stack-lg">
        <div>
          <h2>Session fees</h2>
          <div class="scroll-x">
            <table class="data-table">
              <thead>
                <tr><th>Service</th><th>Fee</th></tr>
              </thead>
              <tbody>
                <tr><td>Individual session</td><td>\${{ fees.individual }}</td></tr>
                <tr><td>Couples session</td><td>\${{ fees.couples }}</td></tr>
                <tr><td>Support groups (per session)</td><td>\${{ fees.groupMin }}–\${{ fees.groupMax }}</td></tr>
                <tr><td>Sliding scale</td><td>Available on request</td></tr>
              </tbody>
            </table>
          </div>
          <p class="muted">A sliding scale is available for those who need it — please ask.</p>
        </div>

        <div>
          <h2>Insurance accepted</h2>
          <p>More than 30 insurance plans are accepted, including:</p>
          <ul class="chip-list">
            @for (ins of fees.insurers; track ins) {
              <li class="chip">{{ ins }}</li>
            }
            <li class="chip">{{ fees.insurerNote }}</li>
          </ul>
          <p class="muted">
            Coverage varies by plan. I’m glad to help you verify your benefits before your first
            session, and superbills are available for out-of-network reimbursement.
          </p>
        </div>

        <div class="note note--brand">
          <h3>Does insurance cover Christian counseling?</h3>
          <p>
            In most cases, yes — indirectly. Insurance reimburses the <em>clinical</em> care for a
            covered diagnosis (billed by standard CPT codes), not the faith element specifically.
            Because I’m a licensed clinician, faith-integrated therapy is billed exactly like any
            other psychotherapy. I’ll help you understand what your plan covers.
          </p>
        </div>

        <app-faq-list [items]="faqs" heading="Fees & insurance questions" />
      </div>
    </section>

    <app-cta-banner />
  `,
})
export class FeesPage {
  protected readonly fees = FEES;
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Fees & Insurance', path: '/fees-insurance' },
  ];

  protected readonly faqs: FaqItem[] = [
    {
      q: 'How do I find out if you take my insurance?',
      a: 'Reach out with your plan details and I’ll help verify your benefits before we begin. More than 30 plans are accepted, including Aetna, BCBS, Cigna, Humana, Medicare, UnitedHealthcare, and TRICARE.',
    },
    {
      q: 'What if I don’t have insurance or you’re out-of-network?',
      a: 'A sliding scale is available, and I can provide a superbill you can submit to your insurer for possible out-of-network reimbursement.',
    },
    {
      q: 'What is a Good Faith Estimate?',
      a: 'Under the federal No Surprises Act, you have the right to a Good Faith Estimate of expected costs for care. I’m happy to provide one on request.',
    },
    {
      q: 'How do I pay for sessions?',
      a: 'Standard payment methods are accepted. We’ll set up the details that work best for you when scheduling your first session.',
    },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'Therapy Fees & Insurance Illinois | Mason Kelly LCSW',
        description:
          'Transparent therapy fees: $130 individual, $160 couples, sliding scale available. 30+ insurance plans accepted incl. Aetna, BCBS, Cigna, Medicare, UnitedHealthcare.',
        path: '/fees-insurance',
      },
      [breadcrumb(this.crumbs), faqPage(this.faqs)],
    );
  }
}
