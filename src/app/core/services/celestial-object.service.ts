import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CelestialObject } from '../models/celestial-object.model';

@Injectable({
  providedIn: 'root',
})
export class CelestialObjectService {
  private readonly baseUrl = `${environment.apiUrl}/celestial-objects`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<CelestialObject[]> {
    return this.http.get<CelestialObject[]>(this.baseUrl);
  }

  getById(id: number): Observable<CelestialObject> {
    return this.http.get<CelestialObject>(`${this.baseUrl}/${id}`);
  }
}
