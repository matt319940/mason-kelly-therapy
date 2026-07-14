import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';
import { breadcrumb, service } from '../../core/schema';
import { PageHero } from '../../shared/page-hero';
import { CtaBanner } from '../../shared/cta-banner';

@Component({
  selector: 'app-detransition-faith-identity',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, PageHero, CtaBanner],
  template: `
    <app-page-hero
      eyebrow="Detransition Support"
      heading="Faith, Identity & Reconnecting With Yourself After Detransition"
      lead="For those who want it, faith can be a source of grace and steadiness while you rebuild a sense of who you are — held gently, without shame, and always at your invitation."
      [crumbs]="crumbs"
    >
      <a routerLink="/contact" class="btn btn--primary">Reach Out for a Consultation</a>
    </app-page-hero>

    <section class="section">
      <div class="container container-narrow stack-lg prose">
        <section>
          <h2>Holding grief and hope together</h2>
          <p>
            Detransition can carry real grief — for time, for relationships, for the future you once
            imagined. That grief deserves space. At the same time, many people find room for hope to
            grow alongside it. We hold both, without rushing either.
          </p>
        </section>

        <section>
          <h2>Identity beyond the transition narrative</h2>
          <p>
            You are more than any chapter of your story. Together we can explore who you are now —
            your values, your relationships, your sense of self — with self-compassion rather than
            self-condemnation.
          </p>
        </section>

        <section>
          <h2>Shame, forgiveness, and self-compassion</h2>
          <p>
            There is a real difference between healthy reflection and crushing shame. For clients who
            wish, we can explore forgiveness and grace in a way that frees rather than condemns —
            never proof-texting, never moralizing.
          </p>
        </section>

        <section>
          <h2>Bridging clinical care and spiritual meaning</h2>
          <p>
            Trauma-informed clinical work and spiritual meaning-making are not at odds. When you want
            it, Scripture is used supportively and at your invitation, woven together with
            evidence-based care. Learn more about
            <a routerLink="/christian-counseling">Bible-based Christian counseling</a> and
            <a routerLink="/detransition-support">detransition support</a>.
          </p>
        </section>
      </div>
    </section>

    <app-cta-banner heading="Reconnecting takes time — and you don’t have to do it alone" />
  `,
})
export class DetransitionFaithIdentityPage {
  protected readonly crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Detransition Support', path: '/detransition-support' },
    { name: 'Faith & Identity', path: '/detransition-support/faith-and-identity' },
  ];

  constructor() {
    inject(SeoService).page(
      {
        title: 'Faith & Identity After Detransition | Christian Support IL',
        description:
          'Rebuilding identity and reconnecting with faith after detransition. A compassionate, Bible-based, client-led space online in Illinois with Mason Kelly, LCSW.',
        path: '/detransition-support/faith-and-identity',
      },
      [
        service({
          name: 'Christian Counseling for Transition Regret',
          serviceType: 'Faith and identity support after detransition (client-led)',
          description:
            'Client-led, compassionate support for reconnecting faith and identity after detransition, online across Illinois.',
        }),
        breadcrumb(this.crumbs),
      ],
    );
  }
}
