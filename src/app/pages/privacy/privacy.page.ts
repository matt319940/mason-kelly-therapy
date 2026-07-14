import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SeoService } from '../../core/seo.service';
import { breadcrumb } from '../../core/schema';
import { CONTACT } from '../../core/practice.config';
import { PageHero } from '../../shared/page-hero';

@Component({
  selector: 'app-privacy',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHero],
  template: `
    <app-page-hero
      eyebrow="Legal"
      heading="Privacy Policy & HIPAA Notice"
      [crumbs]="crumbs"
    />

    <section class="section">
      <div class="container container-narrow prose">
        <p class="muted">
          <em>This page is a general template and should be reviewed and finalized with a
          qualified attorney before launch.</em>
        </p>

        <h2>Your privacy matters</h2>
        <p>
          Protecting your privacy is central to this practice. This notice describes, in general
          terms, how information is handled on this website and in the course of care.
        </p>

        <h2>Website information</h2>
        <p>
          This website is informational. It does not collect protected health information through
          web forms. If you contact the practice by email, please avoid sharing sensitive health
          details until secure communication is established.
        </p>

        <h2>Protected health information (HIPAA)</h2>
        <p>
          Health information shared in the course of therapy is protected under the Health Insurance
          Portability and Accountability Act (HIPAA) and applicable Illinois law. You will receive a
          full Notice of Privacy Practices when you begin services, describing your rights and how
          your information may be used and disclosed.
        </p>

        <h2>Confidentiality and its limits</h2>
        <p>
          Therapy is confidential, with limited exceptions required by law and professional ethics —
          for example, situations involving risk of serious harm or certain mandated-reporting
          obligations. These limits are explained clearly at the start of care.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy may be directed to the practice
          @if (contact.email) {
            at <a [href]="'mailto:' + contact.email">{{ contact.email }}</a>
          }.
        </p>
      </div>
    </section>
  `,
})
export class PrivacyPage {
  protected readonly contact = CONTACT;
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'Privacy Policy & HIPAA Notice | Mason Kelly, LCSW',
        description:
          'Privacy practices and HIPAA notice for Mason L. Kelly, LCSW — faith-centered online therapy in Illinois.',
        path: '/privacy-policy',
      },
      breadcrumb(this.crumbs),
    );
  }
}
