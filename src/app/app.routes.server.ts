import { PrerenderFallback, RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    // Parameterized blog routes need their slugs enumerated at build time.
    path: 'blog/:slug',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client,
    async getPrerenderParams() {
      const { BLOG_POSTS } = await import('./content/blog/generated-posts');
      return BLOG_POSTS.map((p) => ({ slug: p.slug }));
    },
  },
  {
    // All other (parameterless) routes are enumerated from the router and
    // prerendered to static HTML.
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
