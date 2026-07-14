import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CrumbItem } from '../core/content/types';

@Component({
  selector: 'app-breadcrumbs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <nav class="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        @for (crumb of items(); track crumb.name; let last = $last) {
          <li>
            @if (crumb.path && !last) {
              <a [routerLink]="crumb.path">{{ crumb.name }}</a>
              <span class="sep" aria-hidden="true">/</span>
            } @else {
              <span aria-current="page">{{ crumb.name }}</span>
            }
          </li>
        }
      </ol>
    </nav>
  `,
  styles: [
    `
      .breadcrumbs ol {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--sp-2);
        list-style: none;
        margin: 0;
        padding: 0;
        font-size: var(--fs-sm);
        color: var(--c-text-muted);
      }
      .breadcrumbs li {
        display: inline-flex;
        align-items: center;
        gap: var(--sp-2);
      }
      .breadcrumbs a {
        color: var(--c-text-muted);
        text-decoration: none;
      }
      .breadcrumbs a:hover {
        color: var(--c-brand-dark);
        text-decoration: underline;
      }
      .breadcrumbs [aria-current='page'] {
        color: var(--c-text);
        font-weight: var(--fw-semibold);
      }
      .sep {
        color: var(--c-border-strong);
      }
    `,
  ],
})
export class Breadcrumbs {
  readonly items = input.required<CrumbItem[]>();
}
