import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Breadcrumbs } from './breadcrumbs';
import { CrumbItem } from '../core/content/types';

/** Standard inner-page hero: breadcrumbs + eyebrow + H1 + lead + projected actions. */
@Component({
  selector: 'app-page-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Breadcrumbs],
  template: `
    <section class="page-hero">
      <div class="container page-hero__inner">
        @if (crumbs()) {
          <app-breadcrumbs [items]="crumbs()!" />
        }
        @if (eyebrow()) {
          <p class="eyebrow">{{ eyebrow() }}</p>
        }
        <h1>{{ heading() }}</h1>
        @if (lead()) {
          <p class="lead">{{ lead() }}</p>
        }
        <div class="page-hero__actions">
          <ng-content />
        </div>
      </div>
    </section>
  `,
  styles: [
    `
      .page-hero__inner app-breadcrumbs {
        display: block;
        margin-bottom: var(--sp-4);
      }
      .page-hero__actions:empty {
        display: none;
      }
      .page-hero__actions {
        margin-top: var(--sp-5);
        display: flex;
        flex-wrap: wrap;
        gap: var(--sp-4);
      }
    `,
  ],
})
export class PageHero {
  readonly eyebrow = input<string>();
  readonly heading = input.required<string>();
  readonly lead = input<string>();
  readonly crumbs = input<CrumbItem[]>();
}
