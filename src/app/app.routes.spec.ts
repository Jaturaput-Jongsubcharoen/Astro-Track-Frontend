import { TestBed } from '@angular/core/testing';
import { provideRouter, Routes } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';
import { CelestialObject } from './core/models/celestial-object.model';
import { CelestialObjectService } from './core/services/celestial-object.service';
import { routes } from './app.routes';

describe('App routes', () => {
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
    return jasmine.createSpyObj<CelestialObjectService>('CelestialObjectService', ['getAll', 'getById', 'create', 'update', 'delete']);
  }

  async function createHarness(extraProviders: unknown[] = []) {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), ...extraProviders],
    });

    return RouterTestingHarness.create();
  }

  it('navigates to the celestial objects list route', async () => {
    const serviceSpy = createServiceSpy();
    serviceSpy.getAll.and.returnValue(of([celestialObject]));

    const harness = await createHarness([{ provide: CelestialObjectService, useValue: serviceSpy }]);
    await harness.navigateByUrl('/celestial-objects');

    expect(harness.routeNativeElement?.textContent).toContain('Celestial Objects');
  });

  it('navigates to the celestial object detail route', async () => {
    const serviceSpy = createServiceSpy();
    serviceSpy.getAll.and.returnValue(of([]));
    serviceSpy.getById.and.returnValue(of(celestialObject));

    const harness = await createHarness([{ provide: CelestialObjectService, useValue: serviceSpy }]);
    await harness.navigateByUrl('/celestial-objects/1');

    expect(harness.routeNativeElement?.textContent).toContain('Earth');
  });

  it('navigates to the celestial object create route', async () => {
    const serviceSpy = createServiceSpy();
    serviceSpy.getAll.and.returnValue(of([]));

    const harness = await createHarness([{ provide: CelestialObjectService, useValue: serviceSpy }]);
    await harness.navigateByUrl('/celestial-objects/new');

    expect(harness.routeNativeElement?.textContent).toContain('Add Celestial Object');
  });

  it('navigates to the celestial object edit route', async () => {
    const serviceSpy = createServiceSpy();
    serviceSpy.getAll.and.returnValue(of([]));
    serviceSpy.getById.and.returnValue(of(celestialObject));

    const harness = await createHarness([{ provide: CelestialObjectService, useValue: serviceSpy }]);
    await harness.navigateByUrl('/celestial-objects/1/edit');

    expect(harness.routeNativeElement?.textContent).toContain('Edit Celestial Object');
  });

  it('renders the not found route for unknown paths', async () => {
    const serviceSpy = createServiceSpy();
    serviceSpy.getAll.and.returnValue(of([]));

    const harness = await createHarness([{ provide: CelestialObjectService, useValue: serviceSpy }]);
    await harness.navigateByUrl('/unknown-route');

    expect(harness.routeNativeElement?.textContent).toContain('Page not found');
  });
});
