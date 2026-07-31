import { Component } from '@angular/core';

@Component({
  selector: 'app-not-found-page',
  standalone: true,
  template: `
    <section class="empty">
      <h2>Page not found</h2>
      <p>The requested route does not exist yet.</p>
    </section>
  `,
  styles: [
    `
      .empty { padding: 2rem; border-radius: 1.5rem; background: var(--app-surface-strong); border: 1px solid var(--app-border); }
      h2 { margin: 0 0 0.5rem; }
      p { margin: 0; color: var(--app-muted); }
    `,
  ],
})
export class NotFoundPageComponent {}
