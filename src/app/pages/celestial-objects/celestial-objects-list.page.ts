import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CelestialObject } from '../../core/models/celestial-object.model';
import { CelestialObjectService } from '../../core/services/celestial-object.service';

@Component({
  selector: 'app-celestial-objects-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="objects-list">
      <header class="objects-list__header">
        <p class="objects-list__eyebrow">Read-only API</p>
        <h2>Celestial Objects</h2>
        <p>Browse celestial objects synchronized from the Astro Track backend.</p>
      </header>

      <p class="objects-list__status" *ngIf="loading()">Loading celestial objects...</p>
      <p class="objects-list__status objects-list__status--error" *ngIf="!loading() && errorMessage()">{{ errorMessage() }}</p>
      <p class="objects-list__status" *ngIf="!loading() && !errorMessage() && celestialObjects().length === 0">
        No celestial objects were returned by the API.
      </p>

      <ul class="objects-list__grid" *ngIf="!loading() && !errorMessage() && celestialObjects().length > 0">
        <li *ngFor="let object of celestialObjects()" class="objects-list__card">
          <div>
            <p class="objects-list__id">Object #{{ object.objectId }}</p>
            <h3>{{ object.objectName }}</h3>
            <p>{{ object.category }}</p>
          </div>
          <a [routerLink]="['/celestial-objects', object.objectId]">View details</a>
        </li>
      </ul>
    </section>
  `,
  styles: [
    `
      .objects-list { display: grid; gap: 1rem; }
      .objects-list__header {
        padding: 1.5rem;
        border: 1px solid var(--app-border);
        border-radius: 1.25rem;
        background: var(--app-surface-strong);
      }
      .objects-list__eyebrow {
        margin: 0 0 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--app-secondary);
        font-size: 0.75rem;
        font-weight: 700;
      }
      .objects-list h2 { margin: 0 0 0.5rem; }
      .objects-list p { margin: 0; color: var(--app-muted); }
      .objects-list__status {
        margin: 0;
        padding: 1rem;
        border: 1px dashed var(--app-border);
        border-radius: 1rem;
        background: var(--app-surface-strong);
      }
      .objects-list__status--error {
        border-style: solid;
        border-color: rgba(195, 49, 49, 0.45);
        color: #8b1f1f;
        background: rgba(195, 49, 49, 0.08);
      }
      .objects-list__grid {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 1rem;
      }
      .objects-list__card {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        align-items: flex-start;
        padding: 1rem;
        border: 1px solid var(--app-border);
        border-radius: 1rem;
        background: var(--app-surface-strong);
      }
      .objects-list__id {
        margin-bottom: 0.25rem;
        color: var(--app-primary);
        font-weight: 700;
        font-size: 0.85rem;
      }
      .objects-list h3 {
        margin: 0 0 0.25rem;
        font-size: 1.1rem;
      }
      .objects-list__card a {
        white-space: nowrap;
        text-decoration: none;
        padding: 0.45rem 0.7rem;
        border-radius: 999px;
        border: 1px solid var(--app-border);
      }
      .objects-list__card a:hover {
        border-color: var(--app-primary);
        color: var(--app-primary);
      }
    `,
  ],
})
export class CelestialObjectsListPageComponent implements OnInit {
  readonly celestialObjects = signal<CelestialObject[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');

  constructor(private readonly celestialObjectService: CelestialObjectService) {}

  ngOnInit(): void {
    this.celestialObjectService.getAll().subscribe({
      next: (objects) => {
        this.celestialObjects.set(objects);
        this.errorMessage.set('');
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.celestialObjects.set([]);
        this.errorMessage.set(this.toErrorMessage(error, 'Unable to load celestial objects.'));
        this.loading.set(false);
      },
    });
  }

  private toErrorMessage(error: unknown, fallback: string): string {
    if (error instanceof HttpErrorResponse) {
      return `Request failed with status ${error.status}.`;
    }

    return fallback;
  }
}
