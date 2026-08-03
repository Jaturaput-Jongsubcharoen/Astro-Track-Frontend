import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Router, convertToParamMap } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
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
    return jasmine.createSpyObj<CelestialObjectService>('CelestialObjectService', ['getById', 'delete']);
  }

  function createRouterSpy() {
    return jasmine.createSpyObj<Router>('Router', ['navigate']);
  }

  function createFixture(
    idParam: string,
    serviceSpy: jasmine.SpyObj<CelestialObjectService>,
    routerSpy: jasmine.SpyObj<Router>,
  ) {
    TestBed.configureTestingModule({
      imports: [CelestialObjectDetailPageComponent],
      providers: [
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({ id: idParam }) } } },
        { provide: CelestialObjectService, useValue: serviceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    const fixture = TestBed.createComponent(CelestialObjectDetailPageComponent);
    fixture.detectChanges();
    return fixture;
  }

  it('shows loading state before the request resolves', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    const celestialObjectSubject = new Subject<CelestialObject>();
    serviceSpy.getById.and.returnValue(celestialObjectSubject.asObservable());

    const fixture = createFixture('1', serviceSpy, routerSpy);

    expect(fixture.nativeElement.textContent).toContain('Loading celestial object details...');

    celestialObjectSubject.next(celestialObject);
    celestialObjectSubject.complete();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Earth');
  });

  it('shows all celestial object properties on success', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    serviceSpy.getById.and.returnValue(of(celestialObject));

    const fixture = createFixture('1', serviceSpy, routerSpy);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Earth');
    expect(fixture.nativeElement.textContent).toContain('Planet');
    expect(fixture.nativeElement.textContent).toContain('Yes');
    expect(fixture.nativeElement.textContent).toContain('No');
  });

  it('shows not found state for a 404 response', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    const errorSubject = new Subject<CelestialObject>();
    serviceSpy.getById.and.returnValue(errorSubject.asObservable());

    const fixture = createFixture('1', serviceSpy, routerSpy);
    errorSubject.error(new HttpErrorResponse({ status: 404, statusText: 'Not Found' }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Celestial object not found.');
  });

  it('shows an error state for non-404 failures', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    const errorSubject = new Subject<CelestialObject>();
    serviceSpy.getById.and.returnValue(errorSubject.asObservable());

    const fixture = createFixture('1', serviceSpy, routerSpy);
    errorSubject.error(new HttpErrorResponse({ status: 500, statusText: 'Server Error' }));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Request failed with status 500.');
  });

  it('shows a validation message for invalid route ids', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    serviceSpy.getById.and.returnValue(of(celestialObject));

    const fixture = createFixture('invalid', serviceSpy, routerSpy);
    fixture.detectChanges();

    expect(serviceSpy.getById).not.toHaveBeenCalled();
    expect(fixture.nativeElement.textContent).toContain('The provided celestial object ID is invalid.');
  });

  it('deletes the object and navigates to the list when confirmation is accepted', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    routerSpy.navigate.and.resolveTo(true);
    serviceSpy.getById.and.returnValue(of(celestialObject));
    serviceSpy.delete.and.returnValue(of(void 0));
    spyOn(window, 'confirm').and.returnValue(true);

    const fixture = createFixture('1', serviceSpy, routerSpy);
    fixture.componentInstance.deleteObject();

    expect(window.confirm).toHaveBeenCalled();
    expect(serviceSpy.delete).toHaveBeenCalledWith(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/celestial-objects']);
  });

  it('does not send delete when confirmation is cancelled', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    serviceSpy.getById.and.returnValue(of(celestialObject));
    spyOn(window, 'confirm').and.returnValue(false);

    const fixture = createFixture('1', serviceSpy, routerSpy);
    fixture.componentInstance.deleteObject();

    expect(serviceSpy.delete).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('shows a conflict message when delete fails with 409', () => {
    const serviceSpy = createServiceSpy();
    const routerSpy = createRouterSpy();
    serviceSpy.getById.and.returnValue(of(celestialObject));
    serviceSpy.delete.and.returnValue(throwError(() => new HttpErrorResponse({ status: 409 })));
    spyOn(window, 'confirm').and.returnValue(true);

    const fixture = createFixture('1', serviceSpy, routerSpy);
    fixture.componentInstance.deleteObject();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('This celestial object cannot be deleted because related records still exist.');
  });
});
