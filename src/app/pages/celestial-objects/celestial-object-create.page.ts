import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CreateCelestialObjectRequest, UpdateCelestialObjectRequest } from '../../core/models/celestial-object.model';
import { CelestialObjectService } from '../../core/services/celestial-object.service';
import { CelestialObjectFormComponent } from './celestial-object-form.component';

@Component({
  selector: 'app-celestial-object-create-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CelestialObjectFormComponent],
  template: `
    <section class="manage-page">
      <a routerLink="/celestial-objects" class="manage-page__back">Back to list</a>

      <header class="manage-page__header">
        <p class="manage-page__eyebrow">Create</p>
        <h2>Add Celestial Object</h2>
        <p>Create a new celestial object record using the backend management API.</p>
      </header>

      <app-celestial-object-form
        [mode]="'create'"
        [pending]="pending()"
        [submitLabel]="'Create Celestial Object'"
        [serverError]="errorMessage()"
        (formSubmitted)="create($event)"
      />
    </section>
  `,
  styles: [
    `
      .manage-page { display: grid; gap: 1rem; }
      .manage-page__back {
        text-decoration: none;
        width: fit-content;
        padding: 0.45rem 0.75rem;
        border: 1px solid var(--app-border);
        border-radius: 999px;
      }
      .manage-page__header {
        padding: 1.5rem;
        border: 1px solid var(--app-border);
        border-radius: 1.25rem;
        background: var(--app-surface-strong);
      }
      .manage-page__eyebrow {
        margin: 0 0 0.5rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: var(--app-secondary);
        font-size: 0.75rem;
        font-weight: 700;
      }
      .manage-page__header h2 { margin: 0 0 0.5rem; }
      .manage-page__header p { margin: 0; color: var(--app-muted); }
    `,
  ],
})
export class CelestialObjectCreatePageComponent {
  readonly pending = signal(false);
  readonly errorMessage = signal('');

  constructor(
    private readonly celestialObjectService: CelestialObjectService,
    private readonly router: Router,
  ) {}

  create(request: CreateCelestialObjectRequest | UpdateCelestialObjectRequest): void {
    this.pending.set(true);
    this.errorMessage.set('');

    this.celestialObjectService.create(request as CreateCelestialObjectRequest).subscribe({
      next: (createdObject) => {
        this.pending.set(false);
        void this.router.navigate(['/celestial-objects', createdObject.objectId]);
      },
      error: (error: unknown) => {
        this.pending.set(false);
        this.errorMessage.set(this.toErrorMessage(error));
      },
    });
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return 'Unable to reach the backend service. Check your network and try again.';
        case 400:
          return 'The backend rejected the submitted values. Review the form and try again.';
        case 409:
          return 'A celestial object with this Object ID already exists.';
        default:
          return 'The server could not create the celestial object right now.';
      }
    }

    return 'Unable to create the celestial object right now.';
  }
}
