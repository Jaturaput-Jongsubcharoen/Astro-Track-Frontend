import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CelestialObjectService } from './celestial-object.service';
import { CelestialObject } from '../models/celestial-object.model';

describe('CelestialObjectService', () => {
  let service: CelestialObjectService;
  let httpMock: HttpTestingController;

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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), CelestialObjectService],
    });

    service = TestBed.inject(CelestialObjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should request all celestial objects from the collection endpoint', () => {
    let response: CelestialObject[] | undefined;

    service.getAll().subscribe((objects) => {
      response = objects;
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/celestial-objects`);
    expect(request.request.method).toBe('GET');

    request.flush([celestialObject]);

    expect(response).toEqual([celestialObject]);
  });

  it('should request a celestial object by id from the detail endpoint', () => {
    let response: CelestialObject | undefined;

    service.getById(1).subscribe((object) => {
      response = object;
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/celestial-objects/1`);
    expect(request.request.method).toBe('GET');

    request.flush(celestialObject);

    expect(response).toEqual(celestialObject);
  });
});
