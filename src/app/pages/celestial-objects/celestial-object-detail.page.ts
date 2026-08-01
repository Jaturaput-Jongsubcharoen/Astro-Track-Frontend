import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CelestialObject } from '../../core/models/celestial-object.model';
import { CelestialObjectService } from '../../core/services/celestial-object.service';

@Component({
  selector: 'app-celestial-object-detail-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="detail-page">
      <a routerLink="/celestial-objects" class="detail-page__back">Back to list</a>

      <p class="detail-page__status" *ngIf="loading()">Loading celestial object details...</p>
      <p class="detail-page__status detail-page__status--error" *ngIf="!loading() && errorMessage()">{{ errorMessage() }}</p>
      <p class="detail-page__status detail-page__status--not-found" *ngIf="!loading() && notFound()">
        Celestial object not found.
      </p>

      <article class="detail-page__card" *ngIf="!loading() && !errorMessage() && !notFound() && celestialObject()">
        <header class="detail-page__header">
          <p class="detail-page__id">Object #{{ celestialObject()!.objectId }}</p>
          <h2>{{ celestialObject()!.objectName }}</h2>
          <p>{{ celestialObject()!.category }}</p>
        </header>

        <dl class="detail-page__grid">
          <dt>In Solar System</dt><dd>{{ celestialObject()!.inSolarSystem ? 'Yes' : 'No' }}</dd>
          <dt>Distance (light years)</dt><dd>{{ formatNumber(celestialObject()!.distanceLightYears) }}</dd>
          <dt>Discovery Date</dt><dd>{{ celestialObject()!.discoveryDate ?? 'Unknown' }}</dd>
          <dt>Habitability Score</dt><dd>{{ formatNumber(celestialObject()!.habitabilityScore) }}</dd>
          <dt>Surface Temperature</dt><dd>{{ formatNumber(celestialObject()!.surfaceTemperature) }}</dd>
          <dt>Gravity</dt><dd>{{ formatNumber(celestialObject()!.gravity) }}</dd>
          <dt>Nitrogen</dt><dd>{{ celestialObject()!.nitrogen ? 'Yes' : 'No' }}</dd>
          <dt>Oxygen</dt><dd>{{ celestialObject()!.oxygen ? 'Yes' : 'No' }}</dd>
          <dt>CO2</dt><dd>{{ celestialObject()!.co2 ? 'Yes' : 'No' }}</dd>
          <dt>Sulfuric Acid</dt><dd>{{ celestialObject()!.sulfuricAcid ? 'Yes' : 'No' }}</dd>
          <dt>Hydrogen</dt><dd>{{ celestialObject()!.hydrogen ? 'Yes' : 'No' }}</dd>
          <dt>Helium</dt><dd>{{ celestialObject()!.helium ? 'Yes' : 'No' }}</dd>
          <dt>Methane</dt><dd>{{ celestialObject()!.methane ? 'Yes' : 'No' }}</dd>
          <dt>Water Vapor</dt><dd>{{ celestialObject()!.waterVapor ? 'Yes' : 'No' }}</dd>
          <dt>Silicates</dt><dd>{{ celestialObject()!.silicates ? 'Yes' : 'No' }}</dd>
          <dt>Iron</dt><dd>{{ celestialObject()!.iron ? 'Yes' : 'No' }}</dd>
          <dt>Nickel</dt><dd>{{ celestialObject()!.nickel ? 'Yes' : 'No' }}</dd>
        </dl>
      </article>
    </section>
  `,
  styles: [
    `
      .detail-page { display: grid; gap: 1rem; }
      .detail-page__back {
        text-decoration: none;
        width: fit-content;
        padding: 0.45rem 0.75rem;
        border: 1px solid var(--app-border);
        border-radius: 999px;
      }
      .detail-page__status {
        margin: 0;
        padding: 1rem;
        border-radius: 1rem;
        border: 1px dashed var(--app-border);
        background: var(--app-surface-strong);
      }
      .detail-page__status--error {
        border-style: solid;
        border-color: rgba(195, 49, 49, 0.45);
        color: #8b1f1f;
        background: rgba(195, 49, 49, 0.08);
      }
      .detail-page__status--not-found {
        border-style: solid;
        border-color: rgba(15, 76, 129, 0.3);
        color: var(--app-primary);
        background: rgba(15, 76, 129, 0.08);
      }
      .detail-page__card {
        padding: 1.5rem;
        border: 1px solid var(--app-border);
        border-radius: 1.25rem;
        background: var(--app-surface-strong);
        box-shadow: var(--app-shadow);
      }
      .detail-page__header h2 {
        margin: 0.1rem 0 0.35rem;
      }
      .detail-page__header p {
        margin: 0;
        color: var(--app-muted);
      }
      .detail-page__id {
        color: var(--app-primary);
        font-weight: 700;
        margin-bottom: 0.35rem;
      }
      .detail-page__grid {
        margin: 1rem 0 0;
        display: grid;
        grid-template-columns: minmax(170px, 1fr) minmax(150px, 2fr);
        row-gap: 0.5rem;
        column-gap: 1rem;
      }
      .detail-page__grid dt { font-weight: 700; }
      .detail-page__grid dd { margin: 0; color: var(--app-muted); }
      @media (max-width: 680px) {
        .detail-page__grid {
          grid-template-columns: 1fr;
          row-gap: 0.25rem;
        }
      }
    `,
  ],
})
export class CelestialObjectDetailPageComponent implements OnInit {
  readonly celestialObject = signal<CelestialObject | null>(null);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly notFound = signal(false);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly celestialObjectService: CelestialObjectService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorMessage.set('A celestial object ID is required.');
      this.notFound.set(false);
      this.loading.set(false);
      return;
    }

    const id = Number(idParam);
    if (!Number.isInteger(id) || id <= 0) {
      this.errorMessage.set('The provided celestial object ID is invalid.');
      this.notFound.set(false);
      this.loading.set(false);
      return;
    }

    this.celestialObjectService.getById(id).subscribe({
      next: (object) => {
        this.celestialObject.set(object);
        this.errorMessage.set('');
        this.notFound.set(false);
        this.loading.set(false);
      },
      error: (error: unknown) => {
        this.loading.set(false);
        if (error instanceof HttpErrorResponse && error.status === 404) {
          this.celestialObject.set(null);
          this.errorMessage.set('');
          this.notFound.set(true);
          return;
        }

        this.celestialObject.set(null);
        this.notFound.set(false);
        this.errorMessage.set(this.toErrorMessage(error));
      },
    });
  }

  formatNumber(value: number | null): string {
    return value === null ? 'Unknown' : value.toLocaleString();
  }

  private toErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse && error.status === 404) {
      return 'Celestial object not found.';
    }

    if (error instanceof HttpErrorResponse) {
      return `Request failed with status ${error.status}.`;
    }

    return 'Unable to load celestial object details.';
  }
}
