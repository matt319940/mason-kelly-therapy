import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb } from '../../core/schema';
import { CONTACT, CRISIS } from '../../core/practice.config';
import { PageHero } from '../../shared/page-hero';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero],
  template: `
    <app-page-hero
      eyebrow="Contact"
      heading="Start Therapy: Reach Out for a Consultation"
      lead="Reaching out is a brave first step. When you’re ready, send a note or give a call — there’s no pressure, just a compassionate conversation about whether this is the right fit."
      [crumbs]="crumbs"
    />

    <section class="section">
      <div class="container contact-grid">
        <div class="stack-lg">
          <div class="card contact-card">
            <h2>Get in touch</h2>
            <p class="muted">Online therapy available throughout {{ contact.areaServed }}.</p>
            <ul class="contact-methods">
              @if (contact.email) {
                <li>
                  <span class="contact-methods__label">Email</span>
                  <a [href]="'mailto:' + contact.email" class="contact-methods__value">{{ contact.email }}</a>
                </li>
              }
              @if (contact.phoneDisplay) {
                <li>
                  <span class="contact-methods__label">Phone</span>
                  <a [href]="'tel:' + contact.phone" class="contact-methods__value">{{ contact.phoneDisplay }}</a>
                </li>
              }
            </ul>
            @if (contact.email) {
              <a [href]="'mailto:' + contact.email" class="btn btn--primary btn--lg">Email Mason</a>
            }
            <p class="contact-note muted">
              Please don’t include sensitive health details in your first message — just let me know
              you’d like to connect and the best way to reach you.
            </p>
          </div>

          <div>
            <h2>What happens next</h2>
            <p>
              I’ll respond personally to arrange a brief, no-obligation conversation. We’ll talk
              through what’s bringing you in, answer your questions, and see whether working together
              feels right. There’s no commitment in reaching out.
            </p>
            <p class="muted">
              Wondering about cost? See <a routerLink="/fees-insurance">fees &amp; insurance</a>,
              including the 30+ plans accepted and a sliding scale.
            </p>
          </div>
        </div>

        <aside class="contact-aside">
          <div class="note">
            <h3>Confidential &amp; secure</h3>
            <p class="muted">
              Sessions are private and held over a secure telehealth connection with clients located
              in {{ contact.areaServed }}.
            </p>
          </div>
          <div class="note note--crisis">
            <h3>In a crisis?</h3>
            <p>{{ crisis.note }}</p>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: [
    `
      .contact-grid {
        display: grid;
        gap: var(--sp-6);
        align-items: start;
      }
      .contact-card .btn {
        margin-top: var(--sp-4);
      }
      .contact-methods {
        list-style: none;
        margin: var(--sp-4) 0 0;
        padding: 0;
        display: grid;
        gap: var(--sp-4);
      }
      .contact-methods__label {
        display: block;
        font-size: var(--fs-xs);
        font-weight: var(--fw-semibold);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        color: var(--c-text-muted);
      }
      .contact-methods__value {
        font-family: var(--font-serif);
        font-size: var(--fs-xl);
        font-weight: var(--fw-semibold);
      }
      .contact-note {
        margin-top: var(--sp-4);
        font-size: var(--fs-sm);
      }
      .contact-aside .note + .note {
        margin-top: var(--sp-4);
      }
      @media (min-width: 880px) {
        .contact-grid {
          grid-template-columns: minmax(0, 1fr) 20rem;
        }
      }
    `,
  ],
})
export class ContactPage {
  protected readonly contact = CONTACT;
  protected readonly crisis = CRISIS;
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'Contact | Online Christian Therapy in Illinois',
        description:
          'Request a consultation for online, faith-centered therapy across Illinois. Reach Mason L. Kelly, MSW, LCSW by email to get started — confidential and no obligation.',
        path: '/contact',
      },
      breadcrumb(this.crumbs),
    );
  }
}
