import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  CelestialObject,
  CreateCelestialObjectRequest,
  UpdateCelestialObjectRequest,
} from '../../core/models/celestial-object.model';
import { CelestialObjectService } from '../../core/services/celestial-object.service';
import { CelestialObjectFormComponent } from './celestial-object-form.component';

@Component({
  selector: 'app-celestial-object-edit-page',
  standalone: true,
  imports: [CommonModule, RouterLink, CelestialObjectFormComponent],
  template: `
    <section class="manage-page">
      <a [routerLink]="detailLink()" class="manage-page__back">Back to details</a>

      <header class="manage-page__header">
        <p class="manage-page__eyebrow">Edit</p>
        <h2>Edit Celestial Object</h2>
        <p>Update an existing celestial object record.</p>
      </header>

      <p class="manage-page__status" *ngIf="loading()">Loading celestial object...</p>
      <p class="manage-page__status manage-page__status--error" *ngIf="!loading() && errorMessage()">{{ errorMessage() }}</p>
      <p class="manage-page__status manage-page__status--not-found" *ngIf="!loading() && notFound()">Celestial object not found.</p>

      <app-celestial-object-form
        *ngIf="!loading() && !notFound() && celestialObject()"
        [mode]="'edit'"
        [initialValue]="celestialObject()"
        [pending]="pending()"
        [submitLabel]="'Save Changes'"
        [serverError]="submitErrorMessage()"
        (formSubmitted)="update($event)"
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
      .manage-page__status {
        margin: 0;
        padding: 1rem;
        border-radius: 1rem;
        border: 1px dashed var(--app-border);
        background: var(--app-surface-strong);
      }
      .manage-page__status--error {
        border-style: solid;
        border-color: rgba(195, 49, 49, 0.45);
        color: #8b1f1f;
        background: rgba(195, 49, 49, 0.08);
      }
      .manage-page__status--not-found {
        border-style: solid;
        border-color: rgba(15, 76, 129, 0.3);
        color: var(--app-primary);
        background: rgba(15, 76, 129, 0.08);
      }
    `,
  ],
})
export class CelestialObjectEditPageComponent implements OnInit {
  readonly celestialObject = signal<CelestialObject | null>(null);
  readonly loading = signal(true);
  readonly pending = signal(false);
  readonly errorMessage = signal('');
  readonly submitErrorMessage = signal('');
  readonly notFound = signal(false);
  readonly objectId = signal<number | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly celestialObjectService: CelestialObjectService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage.set('A celestial object ID is required.');
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage.set('The provided celestial object ID is invalid.');
      this.loading.set(false);
      return;
    }

    this.objectId.set(id);
    this.load(id);
  }

  update(request: CreateCelestialObjectRequest | UpdateCelestialObjectRequest): void {
    const id = this.objectId();
    if (!id) {
      return;
    }

    this.pending.set(true);
    this.submitErrorMessage.set('');

    this.celestialObjectService.update(id, request as UpdateCelestialObjectRequest).subscribe({
      next: (updatedObject) => {
        this.pending.set(false);
        this.celestialObject.set(updatedObject);
        void this.router.navigate(['/celestial-objects', updatedObject.objectId]);
      },
      error: (error: unknown) => {
        this.pending.set(false);

        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.celestialObject.set(null);
          this.notFound.set(true);
          this.submitErrorMessage.set('');
          return;
        }

        this.submitErrorMessage.set(this.toSubmitErrorMessage(error));
      },
    });
  }

  detailLink(): Array<string | number> {
    const id = this.objectId();
    return id ? ['/celestial-objects', id] : ['/celestial-objects'];
  }

  private load(id: number): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.notFound.set(false);

    this.celestialObjectService.getById(id).subscribe({
      next: (object) => {
        this.celestialObject.set(object);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.celestialObject.set(null);
          this.notFound.set(true);
          return;
        }

        this.errorMessage.set(this.toLoadErrorMessage(error));
      },
    });
  }

  private toLoadErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return 'Unable to reach the backend service. Check your network and try again.';
        default:
          return 'Unable to load the celestial object right now.';
      }
    }

    return 'Unable to load the celestial object right now.';
  }

  private toSubmitErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 0:
          return 'Unable to reach the backend service. Check your network and try again.';
        case 400:
          return 'The backend rejected the submitted values. Review the form and try again.';
        default:
          return 'The server could not update the celestial object right now.';
      }
    }

    return 'Unable to update the celestial object right now.';
  }
}
