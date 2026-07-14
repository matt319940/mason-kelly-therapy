import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FaqItem } from '../core/content/types';

/**
 * Accessible FAQ accordion built on native <details>/<summary> — keyboard
 * operable and fully functional before hydration (zero JS, good for INP).
 */
@Component({
  selector: 'app-faq-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (heading()) {
      <h2 class="faq__title">{{ heading() }}</h2>
    }
    <div class="faq">
      @for (item of items(); track item.q) {
        <details class="faq__item">
          <summary>
            <span>{{ item.q }}</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" class="faq__icon">
              <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" stroke-width="1.6" />
            </svg>
          </summary>
          <div class="faq__answer">
            <p>{{ item.a }}</p>
          </div>
        </details>
      }
    </div>
  `,
  styles: [
    `
      .faq__title {
        margin-bottom: var(--sp-5);
      }
      .faq {
        display: grid;
        gap: var(--sp-3);
      }
      .faq__item {
        border: 1px solid var(--c-border);
        border-radius: var(--radius);
        background: var(--c-surface);
        overflow: hidden;
      }
      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--sp-4);
        padding: var(--sp-4) var(--sp-5);
        cursor: pointer;
        font-family: var(--font-serif);
        font-size: var(--fs-lg);
        font-weight: var(--fw-semibold);
        color: var(--c-text);
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      .faq__icon {
        flex: none;
        width: 18px;
        height: 18px;
        color: var(--c-brand);
        transition: transform var(--transition);
      }
      details[open] summary .faq__icon {
        transform: rotate(180deg);
      }
      .faq__answer {
        padding: 0 var(--sp-5) var(--sp-5);
      }
      .faq__answer p {
        color: var(--c-text-muted);
        max-width: 60ch;
      }
    `,
  ],
})
export class FaqList {
  readonly items = input.required<FaqItem[]>();
  readonly heading = input<string>();
}
