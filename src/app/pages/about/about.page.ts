import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb, person } from '../../core/schema';
import { CLINICIAN } from '../../core/practice.config';
import { PageHero } from '../../shared/page-hero';
import { CtaBanner } from '../../shared/cta-banner';

@Component({
  selector: 'app-about',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, CtaBanner],
  template: `
    <app-page-hero
      eyebrow="Meet your therapist"
      heading="About Mason L. Kelly, MSW, LCSW"
      lead="More than 22 years of compassionate, faith-centered care — helping people find clarity, healing, and restoration in Christ."
      [crumbs]="crumbs"
    >
      <a routerLink="/contact" class="btn btn--primary">Reach Out for a Consultation</a>
    </app-page-hero>

    <section class="section">
      <div class="container about-grid">
        <div class="about-main stack-lg">
          <section class="prose">
            <p class="lead">
              Welcome — I’m so glad you’re here. If you are seeking resolution to problems that
              undermine your success and peace in life, you’ve come to the right place.
            </p>
            <p>
              I provide a safe and confidential space to explore life’s challenges from a Christian,
              Bible-based perspective. Sometimes life presents seemingly insurmountable
              difficulties, and it can feel very dark and lonely. I will partner with you to help
              you find clarity in the midst of your storm with faith-integrated, evidence-based
              therapy.
            </p>
            <p>
              I help adults who sometimes turn to drugs, alcohol, unhealthy eating, sex, or other
              people to numb their pain. As a Christian, I draw on biblical principles to address
              spiritual needs and concerns alongside proven clinical methods. I have extensive
              experience treating depression, anxiety, mood changes, and post-traumatic stress.
            </p>
          </section>

          <section>
            <h2>My own journey</h2>
            <div class="prose">
              <p>
                I don’t only understand these struggles as a clinician — I’ve lived through deep
                questions of faith and identity myself. Years ago, I drifted from the faith I had
                embraced and, over time, made the decision to transition from female to male while
                working as a therapist in Chicago.
              </p>
              <p>
                In time, I came to see the toll that path was taking on my soul, and I chose to
                detransition back to female. Ultimately, I believe it was the grace and love of
                Jesus Christ that restored me. That experience is why I can sit with people
                navigating regret, identity, and faith without judgment — because I have walked this
                road myself.
              </p>
              <p>
                If you are exploring detransition or transition regret, know that any support I offer
                is entirely voluntary and led by your goals. You can read more about
                <a routerLink="/detransition-support">detransition &amp; transition-regret support</a>.
              </p>
            </div>
          </section>

          <section>
            <h2>My approach</h2>
            <div class="prose">
              <p>
                I believe sound clinical care and faith belong together — not one instead of the
                other. I integrate evidence-based methods, including cognitive-behavioral approaches
                and clinical hypnotherapy, with the hope and meaning that faith can provide. Faith is
                always invited at your pace, and people of every background are warmly welcome.
              </p>
            </div>
          </section>
        </div>

        <aside class="about-aside">
          <div class="card">
            <h2 class="about-aside__title">Credentials</h2>
            <ul class="credlist">
              @for (c of clinician.credentials; track c.abbr) {
                <li>
                  <strong>{{ c.abbr }}</strong> — {{ c.name }}
                  @if (c.identifier) {
                    <span class="muted">({{ c.identifier }})</span>
                  }
                </li>
              }
            </ul>
            <p class="muted about-aside__edu">
              {{ clinician.education }}, {{ clinician.graduationYear }} ·
              {{ clinician.yearsExperience }}+ years of practice
            </p>
          </div>
        </aside>
      </div>
    </section>

    <app-cta-banner heading="Let’s talk" text="If any of this resonates, I’d be glad to hear from you. Reaching out is a brave first step, and there’s no pressure." />
  `,
  styles: [
    `
      .about-grid {
        display: grid;
        gap: var(--sp-7);
        align-items: start;
      }
      .credlist {
        list-style: none;
        margin: 0 0 var(--sp-4);
        padding: 0;
        display: grid;
        gap: var(--sp-3);
        font-size: var(--fs-sm);
      }
      .credlist strong {
        color: var(--c-brand-dark);
      }
      .about-aside__title {
        font-size: var(--fs-lg);
        color: var(--c-brand-dark);
        margin-bottom: var(--sp-4);
      }
      .about-aside__edu {
        font-size: var(--fs-sm);
      }
      @media (min-width: 920px) {
        .about-grid {
          grid-template-columns: minmax(0, 1fr) 20rem;
        }
        .about-aside {
          position: sticky;
          top: calc(var(--header-h) + var(--sp-5));
        }
      }
    `,
  ],
})
export class AboutPage {
  protected readonly clinician = CLINICIAN;
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'About Mason Kelly, LCSW | Christian Therapist, Illinois',
        description:
          'Meet Mason L. Kelly, MSW, LCSW (IL #149011810): 22+ years, NBCCH, CSOTS, CADC. A Christian therapist and detransitioner offering online care in Illinois.',
        path: '/about',
      },
      [person(), breadcrumb(this.crumbs)],
    );
  }
}
