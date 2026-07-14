import { DOCUMENT, Injectable, inject } from '@angular/core';

/**
 * Injects one or more JSON-LD <script> blocks into <head>. Runs during the
 * server render so the markup lands in the prerendered HTML, and re-runs on
 * client navigation (clearing the previous route's blocks first).
 */
@Injectable({ providedIn: 'root' })
export class StructuredDataService {
  private readonly doc = inject(DOCUMENT);
  private readonly marker = 'data-jsonld';

  set(graph: object | object[]): void {
    this.clear();
    const nodes = Array.isArray(graph) ? graph : [graph];
    const head = this.doc.head;
    for (const node of nodes) {
      const script = this.doc.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute(this.marker, '');
      script.textContent = JSON.stringify(node);
      head.appendChild(script);
    }
  }

  private clear(): void {
    const existing = this.doc.head.querySelectorAll(`script[${this.marker}]`);
    existing.forEach((n) => n.remove());
  }
}
