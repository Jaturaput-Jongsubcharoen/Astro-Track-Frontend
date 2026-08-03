import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CelestialObject,
  CreateCelestialObjectRequest,
  UpdateCelestialObjectRequest,
} from '../models/celestial-object.model';
import { getApiBaseUrl } from '../config/runtime-config';

@Injectable({
  providedIn: 'root',
})
export class CelestialObjectService {
  private readonly baseUrl = `${getApiBaseUrl(environment.apiUrl)}/celestial-objects`;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<CelestialObject[]> {
    return this.http.get<CelestialObject[]>(this.baseUrl);
  }

  getById(id: number): Observable<CelestialObject> {
    return this.http.get<CelestialObject>(`${this.baseUrl}/${id}`);
  }

  create(request: CreateCelestialObjectRequest): Observable<CelestialObject> {
    return this.http.post<CelestialObject>(this.baseUrl, request);
  }

  update(id: number, request: UpdateCelestialObjectRequest): Observable<CelestialObject> {
    return this.http.put<CelestialObject>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
