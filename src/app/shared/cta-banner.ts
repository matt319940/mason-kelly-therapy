import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CONTACT } from '../core/practice.config';

/** Reusable end-of-page call-to-action, themed on the brand color. */
@Component({
  selector: 'app-cta-banner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="cta">
      <div class="container cta__inner">
        <h2>{{ heading() }}</h2>
        <p>{{ text() }}</p>
        <div class="btn-row cta__actions">
          <a routerLink="/contact" class="btn btn--primary btn--lg">Reach Out for a Consultation</a>
          @if (contact.email) {
            <a [href]="'mailto:' + contact.email" class="btn btn--on-brand btn--lg">Email Mason</a>
          }
        </div>
        <p class="cta__reassure">
          Confidential · No obligation · Online across {{ contact.areaServed }}
        </p>
      </div>
    </section>
  `,
  styles: [
    `
      .cta {
        background: var(--c-brand);
        color: #fff;
        padding-block: var(--sp-8);
      }
      .cta__inner {
        text-align: center;
        max-width: 44rem;
      }
      .cta h2 {
        color: #fff;
      }
      .cta p {
        color: #e3ece6;
        margin-top: var(--sp-3);
        font-size: var(--fs-lg);
      }
      .cta__actions {
        justify-content: center;
        margin-top: var(--sp-5);
      }
      .cta__reassure {
        margin-top: var(--sp-5);
        font-size: var(--fs-sm);
        color: #cdddd4;
      }
      .container.cta__inner {
        margin-inline: auto;
      }
    `,
  ],
})
export class CtaBanner {
  readonly heading = input('Take the first step, when you’re ready');
  readonly text = input(
    'Reaching out can feel like a big step. There’s no pressure here — just a compassionate conversation about whether this is the right fit for you.',
  );
  protected readonly contact = CONTACT;
}
