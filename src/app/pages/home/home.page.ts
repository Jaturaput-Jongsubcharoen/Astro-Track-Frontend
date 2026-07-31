import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  template: `
    <section class="home">
      <div class="home__hero">
        <p class="home__eyebrow">Frontend scaffolding</p>
        <h2>Astro Track frontend shell is ready.</h2>
        <p>This placeholder page will later be replaced by feature routes for the Oracle-backed domain.</p>
      </div>
    </section>
  `,
  styles: [
    `
      .home { padding: 1rem 0; }
      .home__hero { max-width: 50rem; padding: 2rem; border: 1px solid var(--app-border); border-radius: 1.5rem; background: var(--app-surface-strong); box-shadow: var(--app-shadow); }
      .home__eyebrow { margin: 0 0 0.5rem; color: var(--app-secondary); text-transform: uppercase; letter-spacing: 0.12em; font-size: 0.8rem; font-weight: 700; }
      h2 { margin: 0 0 0.75rem; font-size: clamp(1.8rem, 3vw, 3rem); }
      p { margin: 0; color: var(--app-muted); line-height: 1.7; }
    `,
  ],
})
export class HomePageComponent {}
