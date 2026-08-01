import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { CelestialObject } from '../../core/models/celestial-object.model';
import { CelestialObjectService } from '../../core/services/celestial-object.service';
import { CelestialObjectsListPageComponent } from './celestial-objects-list.page';

describe('CelestialObjectsListPageComponent', () => {
  const celestialObjects: CelestialObject[] = [
    {
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
    },
  ];

  function createServiceSpy() {
    return jasmine.createSpyObj<CelestialObjectService>('CelestialObjectService', ['getAll']);
  }

  function renderWithService(serviceSpy: jasmine.SpyObj<CelestialObjectService>) {
    TestBed.configureTestingModule({
      imports: [CelestialObjectsListPageComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({}) } },
        },
        { provide: CelestialObjectService, useValue: serviceSpy },
      ],
    });

    const fixture = TestBed.createComponent(CelestialObjectsListPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('shows loading state before the request resolves', () => {
    const serviceSpy = createServiceSpy();
    const celestialObjectsSubject = new Subject<CelestialObject[]>();
    serviceSpy.getAll.and.returnValue(celestialObjectsSubject.asObservable());

    const fixture = renderWithService(serviceSpy);

    const loading = fixture.debugElement.query(By.css('.objects-list__status'));
    expect(loading.nativeElement.textContent).toContain('Loading celestial objects...');

    celestialObjectsSubject.next(celestialObjects);
    celestialObjectsSubject.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Earth');
  });

  it('shows the returned celestial objects on success', () => {
    const serviceSpy = createServiceSpy();
    serviceSpy.getAll.and.returnValue(of(celestialObjects));

    const fixture = renderWithService(serviceSpy);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Earth');
    expect(fixture.nativeElement.textContent).toContain('Planet');
    expect(fixture.nativeElement.textContent).toContain('View details');
  });

  it('shows an empty state when no celestial objects are returned', () => {
    const serviceSpy = createServiceSpy();
    serviceSpy.getAll.and.returnValue(of([]));

    const fixture = renderWithService(serviceSpy);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No celestial objects were returned by the API.');
  });

  it('shows an error state when the request fails', () => {
    const serviceSpy = createServiceSpy();
    const errorSubject = new Subject<CelestialObject[]>();
    serviceSpy.getAll.and.returnValue(errorSubject.asObservable());

    const fixture = renderWithService(serviceSpy);

    errorSubject.error(new HttpErrorResponse({ status: 500, statusText: 'Server Error' }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Request failed with status 500.');
  });
});
