import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CelestialObject, UpdateCelestialObjectRequest } from '../../core/models/celestial-object.model';
import { CelestialObjectService } from '../../core/services/celestial-object.service';
import { CelestialObjectEditPageComponent } from './celestial-object-edit.page';
import { CelestialObjectFormComponent } from './celestial-object-form.component';

describe('CelestialObjectEditPageComponent', () => {
  const celestialObject: CelestialObject = {
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
    return jasmine.createSpyObj<CelestialObjectService>('CelestialObjectService', ['getById', 'update']);
  }

  function createRouterSpy() {
    return jasmine.createSpyObj<Router>('Router', ['navigate']);
  }

  function createFixture(
    serviceSpy: jasmine.SpyObj<CelestialObjectService>,
    routerSpy: jasmine.SpyObj<Router>,
    id = '12001',
  ) {
    TestBed.configureTestingModule({
      imports: [CelestialObjectEditPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id }) } } },
        { provide: CelestialObjectService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    const fixture = TestBed.createComponent(CelestialObjectEditPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  function getFormComponent(fixture: ReturnType<typeof createFixture>): CelestialObjectFormComponent {
    return fixture.debugElement.query(By.directive(CelestialObjectFormComponent)).componentInstance as CelestialObjectFormComponent;
  }

  it('loads the existing celestial object on init', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    serviceSpy.getById.and.returnValue(of(celestialObject));

    createFixture(serviceSpy, routerSpy);

    expect(serviceSpy.getById).toHaveBeenCalledWith(12001);
  });

  it('populates the form with existing values and converts booleans to Y/N', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    serviceSpy.getById.and.returnValue(of(celestialObject));

    const fixture = createFixture(serviceSpy, routerSpy);
    const formComponent = getFormComponent(fixture);

    expect(formComponent.form.controls.objectId.disabled).toBeTrue();
    expect(formComponent.form.controls.objectName.value).toBe('Issue24 Test Object');
    expect(formComponent.form.controls.inSolarSystem.value).toBe('N');
    expect(formComponent.form.controls.oxygen.value).toBe('Y');
    expect(formComponent.form.controls.co2.value).toBe('N');
  });

  it('submits an update and navigates to the detail page on success', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    routerSpy.navigate.and.resolveTo(true);
    serviceSpy.getById.and.returnValue(of(celestialObject));
    serviceSpy.update.and.returnValue(of({ ...celestialObject, objectName: 'Updated Name', habitabilityScore: 7.5 }));

    const fixture = createFixture(serviceSpy, routerSpy);
    const formComponent = getFormComponent(fixture);

    formComponent.form.patchValue({ objectName: 'Updated Name', habitabilityScore: 7.5 });
    formComponent.submit();

    expect(serviceSpy.update).toHaveBeenCalledWith(12001, jasmine.objectContaining({
      objectName: 'Updated Name',
      habitabilityScore: 7.5,
    } satisfies Partial<UpdateCelestialObjectRequest>));
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/celestial-objects', 12001]);
  });

  it('shows a not found state when the object does not exist', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    serviceSpy.getById.and.returnValue(throwError(() => new HttpErrorResponse({ status: 404 })));

    const fixture = createFixture(serviceSpy, routerSpy);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Celestial object not found.');
  });

  it('shows an API failure message when update fails', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    serviceSpy.getById.and.returnValue(of(celestialObject));
    serviceSpy.update.and.returnValue(throwError(() => new HttpErrorResponse({ status: 400 })));

    const fixture = createFixture(serviceSpy, routerSpy);
    const formComponent = getFormComponent(fixture);

    formComponent.submit();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('The backend rejected the submitted values. Review the form and try again.');
  });
});
