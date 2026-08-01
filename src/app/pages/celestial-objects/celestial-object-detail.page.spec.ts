import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { convertToParamMap } from '@angular/router';
import { Subject, of } from 'rxjs';
import { CelestialObject } from '../../core/models/celestial-object.model';
import { CelestialObjectService } from '../../core/services/celestial-object.service';
import { CelestialObjectDetailPageComponent } from './celestial-object-detail.page';

describe('CelestialObjectDetailPageComponent', () => {
  const celestialObject: CelestialObject = {
    objectId: 1,
    objectName: 'Earth',
    category: 'Planet',
    distanceLightYears: 0,
    discoveryDate: '2026-08-01',
    inSolarSystem: true,
    habitabilityScore: 9.8,
    surfaceTemperature: 15,
    gravity: 9.8,
    nitrogen: true,
    oxygen: true,
    co2: false,
    sulfuricAcid: false,
    hydrogen: false,
    helium: false,
    methane: false,
    waterVapor: true,
    silicates: true,
    iron: true,
    nickel: true,
  };

  function createServiceSpy() {
    return jasmine.createSpyObj<CelestialObjectService>('CelestialObjectService', ['getById']);
  }

  function createFixture(idParam: string, serviceSpy: jasmine.SpyObj<CelestialObjectService>) {
    TestBed.configureTestingModule({
      imports: [CelestialObjectDetailPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: idParam }) } } },
        { provide: CelestialObjectService, useValue: serviceSpy },
      ],
    });

    const fixture = TestBed.createComponent(CelestialObjectDetailPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('shows loading state before the request resolves', () => {
    const serviceSpy = createServiceSpy();
    const celestialObjectSubject = new Subject<CelestialObject>();
    serviceSpy.getById.and.returnValue(celestialObjectSubject.asObservable());

    const fixture = createFixture('1', serviceSpy);

    expect(fixture.nativeElement.textContent).toContain('Loading celestial object details...');

    celestialObjectSubject.next(celestialObject);
    celestialObjectSubject.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Earth');
  });

  it('shows all celestial object properties on success', () => {
    const serviceSpy = createServiceSpy();
    serviceSpy.getById.and.returnValue(of(celestialObject));

    const fixture = createFixture('1', serviceSpy);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Earth');
    expect(fixture.nativeElement.textContent).toContain('Planet');
    expect(fixture.nativeElement.textContent).toContain('Yes');
    expect(fixture.nativeElement.textContent).toContain('No');
  });

  it('shows not found state for a 404 response', () => {
    const serviceSpy = createServiceSpy();
    const errorSubject = new Subject<CelestialObject>();
    serviceSpy.getById.and.returnValue(errorSubject.asObservable());

    const fixture = createFixture('1', serviceSpy);
    errorSubject.error(new HttpErrorResponse({ status: 404, statusText: 'Not Found' }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Celestial object not found.');
  });

  it('shows an error state for non-404 failures', () => {
    const serviceSpy = createServiceSpy();
    const errorSubject = new Subject<CelestialObject>();
    serviceSpy.getById.and.returnValue(errorSubject.asObservable());

    const fixture = createFixture('1', serviceSpy);
    errorSubject.error(new HttpErrorResponse({ status: 500, statusText: 'Server Error' }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Request failed with status 500.');
  });

  it('shows a validation message for invalid route ids', () => {
    const serviceSpy = createServiceSpy();
    serviceSpy.getById.and.returnValue(of(celestialObject));

    const fixture = createFixture('invalid', serviceSpy);
    fixture.detectChanges();

    expect(serviceSpy.getById).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('The provided celestial object ID is invalid.');
  });
});
