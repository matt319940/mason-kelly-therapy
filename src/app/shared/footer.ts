import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CLINICIAN, CONTACT, CRISIS, SAME_AS, SITE } from '../core/practice.config';
import { SERVICE_LINKS } from '../core/navigation';

@Component({
  selector: 'app-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <footer class="site-footer">
      <div class="container site-footer__grid">
        <div class="site-footer__brand">
          <p class="brand-name">{{ clinician.name }}, {{ clinician.honorific }}</p>
          <p class="muted">{{ site.tagline }}</p>
          <ul class="chip-list" aria-label="Credentials">
            @for (c of clinician.credentials; track c.abbr) {
              <li class="chip" [title]="c.name">{{ c.abbr }}</li>
            }
          </ul>
          <p class="license muted">
            {{ clinician.jobTitle }} · License {{ licenseId }} ·
            {{ clinician.yearsExperience }}+ years · {{ clinician.education }}
          </p>
        </div>

        <nav class="site-footer__col" aria-label="Services">
          <h2 class="site-footer__head">Services</h2>
          <ul>
            @for (link of services; track link.path) {
              <li><a [routerLink]="link.path">{{ link.label }}</a></li>
            }
          </ul>
        </nav>

        <nav class="site-footer__col" aria-label="Explore">
          <h2 class="site-footer__head">Explore</h2>
          <ul>
            <li><a routerLink="/detransition-support">Detransition Support</a></li>
            <li><a routerLink="/christian-counseling">Christian Counseling</a></li>
            <li><a routerLink="/groups">Support Groups</a></li>
            <li><a routerLink="/about">About Mason</a></li>
            <li><a routerLink="/fees-insurance">Fees &amp; Insurance</a></li>
            <li><a routerLink="/faq">FAQ</a></li>
            <li><a routerLink="/blog">Blog</a></li>
            <li><a routerLink="/contact">Contact</a></li>
          </ul>
        </nav>

        <div class="site-footer__col">
          <h2 class="site-footer__head">Get in touch</h2>
          <p class="muted">Online therapy available throughout {{ contact.areaServed }}.</p>
          @if (contact.phoneDisplay) {
            <p><a [href]="'tel:' + contact.phone">{{ contact.phoneDisplay }}</a></p>
          }
          @if (contact.email) {
            <p><a [href]="'mailto:' + contact.email">{{ contact.email }}</a></p>
          }
          @if (sameAs.length) {
            <ul class="site-footer__social">
              @for (url of sameAs; track url) {
                <li><a [href]="url" rel="noopener" target="_blank">Psychology Today</a></li>
              }
            </ul>
          }
        </div>
      </div>

      <div class="container">
        <div class="note note--crisis site-footer__crisis">
          <strong>In a crisis?</strong> {{ crisis.note }}
        </div>
        <p class="site-footer__legal muted">
          Therapy services are provided via secure telehealth to clients located in
          {{ contact.areaServed }}. A Good Faith Estimate is available on request under the
          No Surprises Act. Content on this site is educational and is not a substitute for
          individualized professional care.
        </p>
        <div class="site-footer__base">
          <p class="muted">© {{ year }} {{ clinician.name }}, {{ clinician.honorific }}. All rights reserved.</p>
          <a routerLink="/privacy-policy" class="muted">Privacy Policy &amp; HIPAA Notice</a>
        </div>
      </div>
    </footer>
  `,
  styles: [
    `
      .site-footer {
        background: var(--c-brand);
        color: #eaf0ec;
        padding-block: var(--sp-8) var(--sp-6);
        margin-top: var(--sp-8);
      }
      .site-footer a {
        color: #fff;
        text-decoration: none;
      }
      .site-footer a:hover {
        text-decoration: underline;
      }
      .site-footer .muted {
        color: #cdddd4;
      }
      .site-footer__grid {
        display: grid;
        gap: var(--sp-6);
        grid-template-columns: 1fr;
      }
      .brand-name {
        font-family: var(--font-serif);
        font-size: var(--fs-xl);
        font-weight: var(--fw-semibold);
        color: #fff;
      }
      .site-footer__brand .chip-list {
        margin-block: var(--sp-3);
      }
      .site-footer__brand .chip {
        background: rgba(255, 255, 255, 0.14);
        color: #fff;
      }
      .license {
        font-size: var(--fs-sm);
      }
      .site-footer__head {
        font-family: var(--font-sans);
        font-size: var(--fs-sm);
        font-weight: var(--fw-bold);
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #bcd0c6;
        margin-bottom: var(--sp-3);
      }
      .site-footer__col ul {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: var(--sp-2);
        font-size: var(--fs-sm);
      }
      .site-footer__social {
        margin-top: var(--sp-3);
      }
      .site-footer__crisis {
        margin-block: var(--sp-6) var(--sp-5);
        color: var(--c-text);
      }
      .site-footer__crisis strong {
        color: var(--c-text);
      }
      .site-footer__legal {
        font-size: var(--fs-xs);
        border-top: 1px solid rgba(255, 255, 255, 0.18);
        padding-top: var(--sp-5);
      }
      .site-footer__base {
        display: flex;
        flex-wrap: wrap;
        gap: var(--sp-3) var(--sp-5);
        justify-content: space-between;
        margin-top: var(--sp-4);
        font-size: var(--fs-xs);
      }
      @media (min-width: 640px) {
        .site-footer__grid {
          grid-template-columns: 1.4fr 1fr 1fr 1.1fr;
        }
      }
    `,
  ],
})
export class Footer {
  protected readonly clinician = CLINICIAN;
  protected readonly contact = CONTACT;
  protected readonly crisis = CRISIS;
  protected readonly site = SITE;
  protected readonly services = SERVICE_LINKS;
  protected readonly sameAs = SAME_AS;
  protected readonly year = 2026;
  protected readonly licenseId =
    CLINICIAN.credentials.find((c) => c.category === 'license')?.identifier ?? '';
}
