import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CelestialObjectService } from './celestial-object.service';
import {
  CelestialObject,
  CreateCelestialObjectRequest,
  UpdateCelestialObjectRequest,
} from '../models/celestial-object.model';

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

  const createRequest: CreateCelestialObjectRequest = {
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
  };

  const updateRequest: UpdateCelestialObjectRequest = {
    objectName: 'Issue24 Updated Object',
    category: 'Exoplanet',
    distanceLightYears: 12.999999,
    discoveryDate: '2026-08-03',
    inSolarSystem: 'N',
    habitabilityScore: 7.25,
    surfaceTemperature: -18.5,
    gravity: 1.05,
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

  it('should send a POST request to create a celestial object', () => {
    let response: CelestialObject | undefined;

    service.create(createRequest).subscribe((object) => {
      response = object;
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/celestial-objects`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(createRequest);

    request.flush(celestialObject);

    expect(response).toEqual(celestialObject);
  });

  it('should send a PUT request to update a celestial object', () => {
    let response: CelestialObject | undefined;

    service.update(12001, updateRequest).subscribe((object) => {
      response = object;
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/celestial-objects/12001`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(updateRequest);

    request.flush(celestialObject);

    expect(response).toEqual(celestialObject);
  });

  it('should send a DELETE request to remove a celestial object', () => {
    let completed = false;

    service.delete(12001).subscribe(() => {
      completed = true;
    });

    const request = httpMock.expectOne(`${environment.apiUrl}/celestial-objects/12001`);
    expect(request.request.method).toBe('DELETE');

    request.flush(null);

    expect(completed).toBeTrue();
  });
});
