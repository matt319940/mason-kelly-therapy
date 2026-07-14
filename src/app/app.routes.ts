import { Routes } from '@angular/router';

// Service pillar slugs (kept as plain strings so the content module stays lazy).
const SERVICE_SLUGS = [
  'trauma-ptsd-therapy',
  'addiction-recovery-therapy',
  'abuse-sexual-abuse-recovery',
  'depression-anxiety-therapy',
  'sexual-addiction-therapy',
  'couples-marriage-counseling',
  'grief-counseling',
  'eating-disorder-therapy',
  'codependency-therapy',
];

const serviceRoutes: Routes = SERVICE_SLUGS.map((slug) => ({
  path: `services/${slug}`,
  data: { slug },
  loadComponent: () => import('./pages/services/service.page').then((m) => m.ServicePage),
}));

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.page').then((m) => m.AboutPage),
  },
  {
    path: 'christian-counseling',
    loadComponent: () =>
      import('./pages/christian-counseling/christian-counseling.page').then(
        (m) => m.ChristianCounselingPage,
      ),
  },
  {
    path: 'services',
    pathMatch: 'full',
    loadComponent: () => import('./pages/services/services.page').then((m) => m.ServicesPage),
  },
  ...serviceRoutes,
  {
    path: 'detransition-support',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/detransition/detransition.page').then((m) => m.DetransitionPage),
  },
  {
    path: 'detransition-support/what-to-expect',
    loadComponent: () =>
      import('./pages/detransition/what-to-expect.page').then(
        (m) => m.DetransitionWhatToExpectPage,
      ),
  },
  {
    path: 'detransition-support/faith-and-identity',
    loadComponent: () =>
      import('./pages/detransition/faith-and-identity.page').then(
        (m) => m.DetransitionFaithIdentityPage,
      ),
  },
  {
    path: 'groups',
    loadComponent: () => import('./pages/groups/groups.page').then((m) => m.GroupsPage),
  },
  {
    path: 'fees-insurance',
    loadComponent: () => import('./pages/fees/fees.page').then((m) => m.FeesPage),
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.page').then((m) => m.FaqPage),
  },
  {
    path: 'blog',
    pathMatch: 'full',
    loadComponent: () => import('./pages/blog/blog-list.page').then((m) => m.BlogListPage),
  },
  {
    path: 'blog/:slug',
    loadComponent: () => import('./pages/blog/blog-post.page').then((m) => m.BlogPostPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/contact/contact.page').then((m) => m.ContactPage),
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/privacy/privacy.page').then((m) => m.PrivacyPage),
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
