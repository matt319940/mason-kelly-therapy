import {
  ChangeDetectionStrategy,
  Component,
  DOCUMENT,
  HostListener,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { MAIN_NAV } from '../core/navigation';
import { SITE } from '../core/practice.config';

@Component({
  selector: 'app-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, CdkTrapFocus],
  template: `
    <header class="site-header">
      <div class="container site-header__bar">
        <a routerLink="/" class="brand" (click)="closeAll()">
          <span class="brand__name">Mason&nbsp;Kelly<span class="brand__cred">, LCSW</span></span>
          <span class="brand__tag">Faith-Centered Christian Counseling</span>
        </a>

        <!-- Desktop nav -->
        <nav class="nav-desktop" aria-label="Primary">
          <ul class="nav-desktop__list">
            @for (item of nav; track item.path) {
              <li class="nav-desktop__item">
                @if (item.children) {
                  <button
                    type="button"
                    class="nav-desktop__link nav-desktop__toggle"
                    [attr.aria-expanded]="dropdownOpen()"
                    (click)="toggleDropdown()"
                  >
                    {{ item.label }}
                    <svg class="caret" viewBox="0 0 10 6" aria-hidden="true" focusable="false">
                      <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" />
                    </svg>
                  </button>
                  @if (dropdownOpen()) {
                    <ul class="dropdown">
                      <li>
                        <a routerLink="/services" class="dropdown__link dropdown__link--head" (click)="closeAll()">
                          All Services
                        </a>
                      </li>
                      @for (child of item.children; track child.path) {
                        <li>
                          <a [routerLink]="child.path" class="dropdown__link" (click)="closeAll()">
                            {{ child.label }}
                          </a>
                        </li>
                      }
                    </ul>
                  }
                } @else {
                  <a
                    [routerLink]="item.path"
                    routerLinkActive="is-active"
                    class="nav-desktop__link"
                    (click)="closeAll()"
                  >
                    {{ item.label }}
                  </a>
                }
              </li>
            }
          </ul>
        </nav>

        <a routerLink="/contact" class="btn btn--primary nav-cta" (click)="closeAll()">
          Reach Out
        </a>

        <button
          type="button"
          class="hamburger"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="mobile-menu"
          (click)="toggleMenu()"
        >
          <span class="sr-only">{{ menuOpen() ? 'Close menu' : 'Open menu' }}</span>
          <span class="hamburger__box" [class.is-open]="menuOpen()" aria-hidden="true">
            <span></span><span></span><span></span>
          </span>
        </button>
      </div>

      <!-- Mobile drawer -->
      @if (menuOpen()) {
        <div class="drawer-backdrop" (click)="closeAll()"></div>
        <nav id="mobile-menu" class="drawer" aria-label="Primary" cdkTrapFocus [cdkTrapFocusAutoCapture]="true">
          <ul class="drawer__list">
            <li><a routerLink="/" class="drawer__link" (click)="closeAll()">Home</a></li>
            @for (item of nav; track item.path) {
              <li>
                <a [routerLink]="item.path" class="drawer__link" (click)="closeAll()">{{ item.label }}</a>
                @if (item.children) {
                  <ul class="drawer__sublist">
                    @for (child of item.children; track child.path) {
                      <li>
                        <a [routerLink]="child.path" class="drawer__sublink" (click)="closeAll()">
                          {{ child.label }}
                        </a>
                      </li>
                    }
                  </ul>
                }
              </li>
            }
            <li class="drawer__cta">
              <a routerLink="/contact" class="btn btn--primary btn--lg" (click)="closeAll()">Reach Out</a>
            </li>
          </ul>
        </nav>
      }
    </header>
  `,
  styles: [
    `
      .site-header {
        position: sticky;
        top: 0;
        z-index: 100;
        background: color-mix(in srgb, var(--c-bg) 88%, transparent);
        backdrop-filter: saturate(140%) blur(8px);
        border-bottom: 1px solid var(--c-border);
      }
      .site-header__bar {
        display: flex;
        align-items: center;
        gap: var(--sp-5);
        min-height: var(--header-h);
      }
      .brand {
        display: flex;
        flex-direction: column;
        text-decoration: none;
        line-height: 1.1;
        margin-right: auto;
      }
      .brand__name {
        font-family: var(--font-serif);
        font-weight: var(--fw-semibold);
        font-size: 1.3rem;
        color: var(--c-brand-dark);
      }
      .brand__cred {
        color: var(--c-text-muted);
        font-weight: var(--fw-medium);
      }
      .brand__tag {
        font-size: var(--fs-xs);
        color: var(--c-text-muted);
        letter-spacing: 0.02em;
      }

      .nav-desktop {
        display: none;
      }
      .nav-desktop__list {
        display: flex;
        align-items: center;
        gap: var(--sp-2);
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .nav-desktop__item {
        position: relative;
      }
      .nav-desktop__link {
        display: inline-flex;
        align-items: center;
        gap: 0.35rem;
        padding: 0.55rem 0.7rem;
        border-radius: var(--radius-sm);
        background: none;
        border: 0;
        cursor: pointer;
        font-size: var(--fs-sm);
        font-weight: var(--fw-semibold);
        color: var(--c-text);
        text-decoration: none;
      }
      .nav-desktop__link:hover {
        color: var(--c-brand-dark);
        background: var(--c-tint);
      }
      .nav-desktop__link.is-active {
        color: var(--c-brand-dark);
      }
      .caret {
        width: 10px;
        height: 6px;
      }
      .dropdown {
        position: absolute;
        top: calc(100% + 6px);
        left: 0;
        min-width: 17rem;
        background: var(--c-surface);
        border: 1px solid var(--c-border);
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        padding: var(--sp-2);
        list-style: none;
        margin: 0;
      }
      .dropdown__link {
        display: block;
        padding: 0.55rem 0.75rem;
        border-radius: var(--radius-sm);
        font-size: var(--fs-sm);
        font-weight: var(--fw-medium);
        color: var(--c-text);
        text-decoration: none;
      }
      .dropdown__link:hover {
        background: var(--c-tint);
        color: var(--c-brand-dark);
      }
      .dropdown__link--head {
        font-weight: var(--fw-semibold);
        color: var(--c-brand-dark);
        border-bottom: 1px solid var(--c-border);
        border-radius: var(--radius-sm) var(--radius-sm) 0 0;
        margin-bottom: var(--sp-1);
      }
      .nav-cta {
        display: none;
      }

      .hamburger {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        background: none;
        border: 0;
        cursor: pointer;
      }
      .hamburger__box {
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        gap: 5px;
        width: 26px;
        height: 20px;
      }
      .hamburger__box span {
        display: block;
        height: 2.5px;
        width: 100%;
        background: var(--c-text);
        border-radius: 2px;
        transition: transform var(--transition), opacity var(--transition);
      }
      .hamburger__box.is-open span:nth-child(1) {
        transform: translateY(7.5px) rotate(45deg);
      }
      .hamburger__box.is-open span:nth-child(2) {
        opacity: 0;
      }
      .hamburger__box.is-open span:nth-child(3) {
        transform: translateY(-7.5px) rotate(-45deg);
      }

      .drawer-backdrop {
        position: fixed;
        inset: var(--header-h) 0 0 0;
        background: rgba(46, 58, 54, 0.35);
        z-index: 90;
      }
      .drawer {
        position: fixed;
        inset: var(--header-h) 0 0 0;
        z-index: 95;
        background: var(--c-bg);
        overflow-y: auto;
        padding: var(--sp-5) var(--sp-5) var(--sp-8);
        border-top: 1px solid var(--c-border);
      }
      .drawer__list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--sp-1);
      }
      .drawer__link {
        display: block;
        padding: 0.8rem 0.5rem;
        font-family: var(--font-serif);
        font-size: var(--fs-xl);
        font-weight: var(--fw-semibold);
        color: var(--c-text);
        text-decoration: none;
        border-bottom: 1px solid var(--c-border);
      }
      .drawer__sublist {
        list-style: none;
        margin: 0 0 var(--sp-3);
        padding: var(--sp-2) 0 0 var(--sp-4);
        display: grid;
        gap: var(--sp-1);
      }
      .drawer__sublink {
        display: block;
        padding: 0.4rem 0.5rem;
        color: var(--c-text-muted);
        text-decoration: none;
        font-size: var(--fs-base);
      }
      .drawer__cta {
        margin-top: var(--sp-5);
      }
      .drawer__cta .btn {
        width: 100%;
      }

      @media (min-width: 1000px) {
        .nav-desktop {
          display: block;
        }
        .nav-cta {
          display: inline-flex;
        }
        .hamburger {
          display: none;
        }
      }
    `,
  ],
})
export class Header {
  protected readonly nav = MAIN_NAV;
  protected readonly site = SITE;
  protected readonly menuOpen = signal(false);
  protected readonly dropdownOpen = signal(false);

  private readonly doc = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
    // Lock body scroll while the mobile drawer is open.
    effect(() => {
      if (!this.isBrowser) return;
      this.doc.body.style.overflow = this.menuOpen() ? 'hidden' : '';
    });
  }

  protected toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    this.dropdownOpen.set(false);
  }

  protected toggleDropdown(): void {
    this.dropdownOpen.update((v) => !v);
  }

  protected closeAll(): void {
    this.menuOpen.set(false);
    this.dropdownOpen.set(false);
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.closeAll();
  }
}
