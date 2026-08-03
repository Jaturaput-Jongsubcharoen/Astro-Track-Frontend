import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import {
  CELESTIAL_OBJECT_CATEGORIES,
  CelestialObject,
  CreateCelestialObjectRequest,
  UpdateCelestialObjectRequest,
  YesNoFlag,
} from '../../core/models/celestial-object.model';

type FormMode = 'create' | 'edit';

type CelestialObjectFormValue = {
  objectId: number | null;
  objectName: string;
  category: string;
  distanceLightYears: number | null;
  discoveryDate: string | null;
  inSolarSystem: YesNoFlag;
  habitabilityScore: number | null;
  surfaceTemperature: number | null;
  gravity: number | null;
  nitrogen: YesNoFlag;
  oxygen: YesNoFlag;
  co2: YesNoFlag;
  sulfuricAcid: YesNoFlag;
  hydrogen: YesNoFlag;
  helium: YesNoFlag;
  methane: YesNoFlag;
  waterVapor: YesNoFlag;
  silicates: YesNoFlag;
  iron: YesNoFlag;
  nickel: YesNoFlag;
};

@Component({
  selector: 'app-celestial-object-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form class="object-form" [formGroup]="form" (ngSubmit)="submit()">
      <div class="object-form__summary object-form__summary--error" *ngIf="serverError">
        {{ serverError }}
      </div>

      <div class="object-form__grid">
        <label class="object-form__field">
          <span>Object ID</span>
          <input type="number" formControlName="objectId" [readonly]="mode === 'edit'" />
          <small *ngIf="showError('objectId', 'required') || showError('objectId', 'min')">
            Object ID must be greater than 0.
          </small>
        </label>

        <label class="object-form__field">
          <span>Object Name</span>
          <input type="text" formControlName="objectName" maxlength="30" />
          <small *ngIf="showError('objectName', 'required')">Object name is required.</small>
          <small *ngIf="showError('objectName', 'maxlength')">Object name cannot exceed 30 characters.</small>
        </label>

        <label class="object-form__field">
          <span>Category</span>
          <select formControlName="category">
            <option value="">Select a category</option>
            <option *ngFor="let category of categories" [value]="category">{{ category }}</option>
          </select>
          <small *ngIf="showError('category', 'required')">Category is required.</small>
          <small *ngIf="showError('category', 'invalidCategory')">Category must match an allowed value.</small>
        </label>

        <label class="object-form__field">
          <span>Distance (light years)</span>
          <input type="number" formControlName="distanceLightYears" step="0.000001" min="0" />
          <small *ngIf="showError('distanceLightYears', 'min')">Distance must be 0 or greater.</small>
        </label>

        <label class="object-form__field">
          <span>Discovery Date</span>
          <input type="date" formControlName="discoveryDate" />
        </label>

        <label class="object-form__field">
          <span>In Solar System</span>
          <select formControlName="inSolarSystem">
            <option value="Y">Y</option>
            <option value="N">N</option>
          </select>
        </label>

        <label class="object-form__field">
          <span>Habitability Score</span>
          <input type="number" formControlName="habitabilityScore" step="0.01" min="0" max="10" />
          <small *ngIf="showError('habitabilityScore', 'min') || showError('habitabilityScore', 'max')">
            Habitability score must be between 0 and 10.
          </small>
        </label>

        <label class="object-form__field">
          <span>Surface Temperature</span>
          <input type="number" formControlName="surfaceTemperature" step="0.01" />
        </label>

        <label class="object-form__field">
          <span>Gravity</span>
          <input type="number" formControlName="gravity" step="0.01" min="0" max="100" />
          <small *ngIf="showError('gravity', 'min') || showError('gravity', 'max')">
            Gravity must be between 0 and 100.
          </small>
        </label>
      </div>

      <section class="object-form__flags">
        <h3>Composition Flags</h3>
        <div class="object-form__grid object-form__grid--flags">
          <label class="object-form__field" *ngFor="let flag of flagFields">
            <span>{{ flag.label }}</span>
            <select [formControlName]="flag.controlName">
              <option value="Y">Y</option>
              <option value="N">N</option>
            </select>
          </label>
        </div>
      </section>

      <div class="object-form__actions">
        <button type="submit" [disabled]="form.invalid || pending">
          {{ pending ? 'Saving...' : submitLabel }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .object-form { display: grid; gap: 1.25rem; }
      .object-form__summary {
        padding: 0.9rem 1rem;
        border-radius: 0.9rem;
        border: 1px solid var(--app-border);
        background: var(--app-surface-strong);
      }
      .object-form__summary--error {
        border-color: rgba(195, 49, 49, 0.45);
        color: #8b1f1f;
        background: rgba(195, 49, 49, 0.08);
      }
      .object-form__grid {
        display: grid;
        gap: 1rem;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }
      .object-form__grid--flags {
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      }
      .object-form__field {
        display: grid;
        gap: 0.45rem;
        color: var(--app-muted);
      }
      .object-form__field span {
        font-weight: 700;
        color: var(--app-foreground);
      }
      .object-form__field input,
      .object-form__field select {
        width: 100%;
        padding: 0.75rem 0.85rem;
        border-radius: 0.85rem;
        border: 1px solid var(--app-border);
        background: #fff;
        color: var(--app-foreground);
        font: inherit;
      }
      .object-form__field input[readonly] {
        background: rgba(15, 76, 129, 0.06);
      }
      .object-form__field small {
        color: #8b1f1f;
      }
      .object-form__flags {
        display: grid;
        gap: 1rem;
        padding: 1.25rem;
        border: 1px solid var(--app-border);
        border-radius: 1rem;
        background: var(--app-surface-strong);
      }
      .object-form__flags h3 {
        margin: 0;
      }
      .object-form__actions {
        display: flex;
        justify-content: flex-end;
      }
      .object-form__actions button {
        padding: 0.8rem 1.2rem;
        border: 0;
        border-radius: 999px;
        background: var(--app-primary);
        color: #fff;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }
      .object-form__actions button[disabled] {
        opacity: 0.6;
        cursor: not-allowed;
      }
    `,
  ],
})
export class CelestialObjectFormComponent implements OnChanges {
  @Input() mode: FormMode = 'create';
  @Input() initialValue: CelestialObject | null = null;
  @Input() pending = false;
  @Input() submitLabel = 'Save Celestial Object';
  @Input() serverError = '';
  @Output() formSubmitted = new EventEmitter<CreateCelestialObjectRequest | UpdateCelestialObjectRequest>();

  readonly categories = CELESTIAL_OBJECT_CATEGORIES;
  readonly flagFields = [
    { controlName: 'nitrogen', label: 'Nitrogen' },
    { controlName: 'oxygen', label: 'Oxygen' },
    { controlName: 'co2', label: 'CO2' },
    { controlName: 'sulfuricAcid', label: 'Sulfuric Acid' },
    { controlName: 'hydrogen', label: 'Hydrogen' },
    { controlName: 'helium', label: 'Helium' },
    { controlName: 'methane', label: 'Methane' },
    { controlName: 'waterVapor', label: 'Water Vapor' },
    { controlName: 'silicates', label: 'Silicates' },
    { controlName: 'iron', label: 'Iron' },
    { controlName: 'nickel', label: 'Nickel' },
  ] as const;

  readonly form = new FormGroup({
    objectId: new FormControl<number | null>(null, {
      nonNullable: false,
      validators: [Validators.required, Validators.min(1)],
    }),
    objectName: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(30)],
    }),
    category: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, this.categoryValidator],
    }),
    distanceLightYears: new FormControl<number | null>(null, { validators: [Validators.min(0)] }),
    discoveryDate: new FormControl<string | null>(null),
    inSolarSystem: new FormControl<YesNoFlag>('N', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    habitabilityScore: new FormControl<number | null>(null, { validators: [Validators.min(0), Validators.max(10)] }),
    surfaceTemperature: new FormControl<number | null>(null),
    gravity: new FormControl<number | null>(null, { validators: [Validators.min(0), Validators.max(100)] }),
    nitrogen: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
    oxygen: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
    co2: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
    sulfuricAcid: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
    hydrogen: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
    helium: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
    methane: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
    waterVapor: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
    silicates: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
    iron: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
    nickel: new FormControl<YesNoFlag>('N', { nonNullable: true, validators: [Validators.required] }),
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode'] || changes['initialValue']) {
      this.applyMode();
      this.applyInitialValue();
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue() as CelestialObjectFormValue;
    if (this.mode === 'create') {
      this.formSubmitted.emit({
        objectId: value.objectId ?? 0,
        objectName: value.objectName.trim(),
        category: value.category as CreateCelestialObjectRequest['category'],
        distanceLightYears: value.distanceLightYears,
        discoveryDate: value.discoveryDate,
        inSolarSystem: value.inSolarSystem,
        habitabilityScore: value.habitabilityScore,
        surfaceTemperature: value.surfaceTemperature,
        gravity: value.gravity,
        nitrogen: value.nitrogen,
        oxygen: value.oxygen,
        co2: value.co2,
        sulfuricAcid: value.sulfuricAcid,
        hydrogen: value.hydrogen,
        helium: value.helium,
        methane: value.methane,
        waterVapor: value.waterVapor,
        silicates: value.silicates,
        iron: value.iron,
        nickel: value.nickel,
      });
      return;
    }

    this.formSubmitted.emit({
      objectName: value.objectName.trim(),
      category: value.category as UpdateCelestialObjectRequest['category'],
      distanceLightYears: value.distanceLightYears,
      discoveryDate: value.discoveryDate,
      inSolarSystem: value.inSolarSystem,
      habitabilityScore: value.habitabilityScore,
      surfaceTemperature: value.surfaceTemperature,
      gravity: value.gravity,
      nitrogen: value.nitrogen,
      oxygen: value.oxygen,
      co2: value.co2,
      sulfuricAcid: value.sulfuricAcid,
      hydrogen: value.hydrogen,
      helium: value.helium,
      methane: value.methane,
      waterVapor: value.waterVapor,
      silicates: value.silicates,
      iron: value.iron,
      nickel: value.nickel,
    });
  }

  showError(controlName: keyof typeof this.form.controls, errorKey: string): boolean {
    const control = this.form.controls[controlName];
    return !!control && control.touched && control.hasError(errorKey);
  }

  private applyMode(): void {
    if (this.mode === 'edit') {
      this.form.controls.objectId.disable({ emitEvent: false });
      return;
    }

    this.form.controls.objectId.enable({ emitEvent: false });
  }

  private applyInitialValue(): void {
    if (!this.initialValue) {
      this.form.reset({
        objectId: null,
        objectName: '',
        category: '',
        distanceLightYears: null,
        discoveryDate: null,
        inSolarSystem: 'N',
        habitabilityScore: null,
        surfaceTemperature: null,
        gravity: null,
        nitrogen: 'N',
        oxygen: 'N',
        co2: 'N',
        sulfuricAcid: 'N',
        hydrogen: 'N',
        helium: 'N',
        methane: 'N',
        waterVapor: 'N',
        silicates: 'N',
        iron: 'N',
        nickel: 'N',
      }, { emitEvent: false });
      return;
    }

    this.form.patchValue({
      objectId: this.initialValue.objectId,
      objectName: this.initialValue.objectName,
      category: this.initialValue.category,
      distanceLightYears: this.initialValue.distanceLightYears,
      discoveryDate: this.toDateInputValue(this.initialValue.discoveryDate),
      inSolarSystem: this.toYesNo(this.initialValue.inSolarSystem),
      habitabilityScore: this.initialValue.habitabilityScore,
      surfaceTemperature: this.initialValue.surfaceTemperature,
      gravity: this.initialValue.gravity,
      nitrogen: this.toYesNo(this.initialValue.nitrogen),
      oxygen: this.toYesNo(this.initialValue.oxygen),
      co2: this.toYesNo(this.initialValue.co2),
      sulfuricAcid: this.toYesNo(this.initialValue.sulfuricAcid),
      hydrogen: this.toYesNo(this.initialValue.hydrogen),
      helium: this.toYesNo(this.initialValue.helium),
      methane: this.toYesNo(this.initialValue.methane),
      waterVapor: this.toYesNo(this.initialValue.waterVapor),
      silicates: this.toYesNo(this.initialValue.silicates),
      iron: this.toYesNo(this.initialValue.iron),
      nickel: this.toYesNo(this.initialValue.nickel),
    }, { emitEvent: false });
  }

  private categoryValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    return CELESTIAL_OBJECT_CATEGORIES.includes(control.value as CreateCelestialObjectRequest['category'])
      ? null
      : { invalidCategory: true };
  }

  private toYesNo(value: boolean): YesNoFlag {
    return value ? 'Y' : 'N';
  }

  private toDateInputValue(value: string | null): string | null {
    if (!value) {
      return null;
    }

    return value.slice(0, 10);
  }
}
