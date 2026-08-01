import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <div class="shell">
      <header class="shell__header">
        <div>
          <p class="shell__eyebrow">Astro Track</p>
          <h1 class="shell__title">Astronomy research dashboard</h1>
        </div>
        <nav aria-label="Primary navigation" class="shell__nav">
          <a routerLink="/home" routerLinkActive="is-active">Home</a>
          <a routerLink="/celestial-objects" routerLinkActive="is-active">Celestial Objects</a>
        </nav>
      </header>
      <main class="shell__content">
        <ng-content />
      </main>
    </div>
  `,
  styles: [
    `
      .shell { min-height: 100vh; padding: 1.5rem; }
      .shell__header {
        display: flex; justify-content: space-between; gap: 1rem; align-items: end;
        padding: 1.5rem; border: 1px solid var(--app-border); border-radius: 1.5rem;
        background: linear-gradient(135deg, var(--app-surface-strong), var(--app-surface));
        box-shadow: var(--app-shadow);
      }
      .shell__eyebrow { margin: 0 0 0.25rem; text-transform: uppercase; letter-spacing: 0.18em; color: var(--app-primary); font-size: 0.75rem; font-weight: 700; }
      .shell__title { margin: 0; font-size: clamp(1.6rem, 2vw, 2.4rem); }
      .shell__nav { display: flex; gap: 1rem; flex-wrap: wrap; }
      .shell__nav a { padding: 0.55rem 0.9rem; border-radius: 999px; text-decoration: none; border: 1px solid transparent; }
      .shell__nav a.is-active { border-color: var(--app-primary); color: var(--app-primary); background: rgba(15, 76, 129, 0.08); }
      .shell__content { margin-top: 1.5rem; }
      @media (max-width: 720px) { .shell__header { align-items: start; flex-direction: column; } }
    `,
  ],
})
export class ShellComponent {}
