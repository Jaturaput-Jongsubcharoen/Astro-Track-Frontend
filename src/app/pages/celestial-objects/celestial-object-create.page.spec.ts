import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, convertToParamMap, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import {
  CreateCelestialObjectRequest,
  CelestialObject,
} from '../../core/models/celestial-object.model';
import { CelestialObjectService } from '../../core/services/celestial-object.service';
import { CelestialObjectCreatePageComponent } from './celestial-object-create.page';
import { CelestialObjectFormComponent } from './celestial-object-form.component';

describe('CelestialObjectCreatePageComponent', () => {
  const createdObject: CelestialObject = {
    objectId: 12001,
    objectName: 'Issue24 Test Object',
    category: 'Exoplanet',
    distanceLightYears: 12.345678,
    discoveryDate: '2026-08-03T00:00:00',
    inSolarSystem: false,
    habitabilityScore: 6.75,
    surfaceTemperature: -20.5,
    gravity: 1.1,
    nitrogen: true,
    oxygen: true,
    co2: false,
    sulfuricAcid: false,
    hydrogen: true,
    helium: false,
    methane: false,
    waterVapor: true,
    silicates: true,
    iron: true,
    nickel: false,
  };

  function createServiceSpy() {
    return jasmine.createSpyObj<CelestialObjectService>('CelestialObjectService', ['create']);
  }

  function createRouterSpy() {
    return jasmine.createSpyObj<Router>('Router', ['navigate']);
  }

  function createFixture(
    serviceSpy: jasmine.SpyObj<CelestialObjectService>,
    routerSpy: jasmine.SpyObj<Router>,
  ) {
    TestBed.configureTestingModule({
      imports: [CelestialObjectCreatePageComponent],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } },
        { provide: CelestialObjectService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    const fixture = TestBed.createComponent(CelestialObjectCreatePageComponent);
    fixture.detectChanges();
    return fixture;
  }

  function getFormComponent(fixture: ReturnType<typeof createFixture>): CelestialObjectFormComponent {
    return fixture.debugElement.query(By.directive(CelestialObjectFormComponent)).componentInstance as CelestialObjectFormComponent;
  }

  it('shows required field validation when submitted empty', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    const fixture = createFixture(serviceSpy, routerSpy);
    const formComponent = getFormComponent(fixture);

    formComponent.form.controls.objectId.setValue(null);
    formComponent.form.controls.objectName.setValue('');
    formComponent.form.controls.category.setValue('');
    formComponent.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Object ID must be greater than 0.');
    expect(fixture.nativeElement.textContent).toContain('Object name is required.');
    expect(fixture.nativeElement.textContent).toContain('Category is required.');
    expect(serviceSpy.create).not.toHaveBeenCalled();
  });

  it('shows numeric range validation messages', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    const fixture = createFixture(serviceSpy, routerSpy);
    const formComponent = getFormComponent(fixture);

    formComponent.form.controls.objectId.setValue(12001);
    formComponent.form.controls.objectName.setValue('Range Test');
    formComponent.form.controls.category.setValue('Exoplanet');
    formComponent.form.controls.habitabilityScore.setValue(15);
    formComponent.form.controls.gravity.setValue(101);
    formComponent.form.controls.distanceLightYears.setValue(-1);
    formComponent.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Distance must be 0 or greater.');
    expect(fixture.nativeElement.textContent).toContain('Habitability score must be between 0 and 10.');
    expect(fixture.nativeElement.textContent).toContain('Gravity must be between 0 and 100.');
    expect(serviceSpy.create).not.toHaveBeenCalled();
  });

  it('converts edit-form values into a Y/N create request and navigates after success', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    routerSpy.navigate.and.resolveTo(true);
    serviceSpy.create.and.returnValue(of(createdObject));

    const fixture = createFixture(serviceSpy, routerSpy);
    const formComponent = getFormComponent(fixture);

    formComponent.form.setValue({
      objectId: 12001,
      objectName: 'Issue24 Test Object',
      category: 'Exoplanet',
      distanceLightYears: 12.345678,
      discoveryDate: '2026-08-03',
      inSolarSystem: 'N',
      habitabilityScore: 6.75,
      surfaceTemperature: -20.5,
      gravity: 1.1,
      nitrogen: 'Y',
      oxygen: 'Y',
      co2: 'N',
      sulfuricAcid: 'N',
      hydrogen: 'Y',
      helium: 'N',
      methane: 'N',
      waterVapor: 'Y',
      silicates: 'Y',
      iron: 'Y',
      nickel: 'N',
    });

    formComponent.submit();

    expect(serviceSpy.create).toHaveBeenCalledWith({
      objectId: 12001,
      objectName: 'Issue24 Test Object',
      category: 'Exoplanet',
      distanceLightYears: 12.345678,
      discoveryDate: '2026-08-03',
      inSolarSystem: 'N',
      habitabilityScore: 6.75,
      surfaceTemperature: -20.5,
      gravity: 1.1,
      nitrogen: 'Y',
      oxygen: 'Y',
      co2: 'N',
      sulfuricAcid: 'N',
      hydrogen: 'Y',
      helium: 'N',
      methane: 'N',
      waterVapor: 'Y',
      silicates: 'Y',
      iron: 'Y',
      nickel: 'N',
    } satisfies CreateCelestialObjectRequest);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/celestial-objects', 12001]);
  });

  it('shows a duplicate conflict message when the backend returns 409', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    serviceSpy.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409 })));

    const fixture = createFixture(serviceSpy, routerSpy);
    const formComponent = getFormComponent(fixture);

    formComponent.form.patchValue({ objectId: 12001, objectName: 'Duplicate', category: 'Planet' });
    formComponent.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('A celestial object with this Object ID already exists.');
  });

  it('shows an API validation failure message when the backend returns 400', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    serviceSpy.create.and.returnValue(throwError(() => new HttpErrorResponse({ status: 400 })));

    const fixture = createFixture(serviceSpy, routerSpy);
    const formComponent = getFormComponent(fixture);

    formComponent.form.patchValue({ objectId: 12001, objectName: 'Bad', category: 'Planet' });
    formComponent.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('The backend rejected the submitted values. Review the form and try again.');
  });
});
