import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'app-not-found',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <section class="section">
      <div class="container container-narrow text-center">
        <p class="eyebrow">404</p>
        <h1>This page wandered off</h1>
        <p class="lead">The page you’re looking for doesn’t exist or has moved.</p>
        <div class="btn-row" style="justify-content: center; margin-top: var(--sp-5);">
          <a routerLink="/" class="btn btn--primary">Return home</a>
          <a routerLink="/services" class="btn btn--secondary">Browse services</a>
        </div>
      </div>
    </section>
  `,
})
export class NotFoundPage {
  constructor() {
    inject(SeoService).apply({
      title: 'Page Not Found | Mason Kelly, LCSW',
      description: 'The page you’re looking for doesn’t exist or has moved.',
      path: '/404',
      noindex: true,
    });
  }
}
