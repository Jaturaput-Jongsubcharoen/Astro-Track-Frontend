# API Integration Plan — Astro Track

This document defines how the Angular frontend should communicate with the planned ASP.NET Core backend. It assumes the backend follows the resource plan in the backend repository and does not call Oracle directly from the browser.

## 1. Integration principles

- The browser talks only to the backend REST API.
- No Angular code connects directly to Oracle.
- Frontend services should map 1:1 with backend resource groups.
- DTO shapes should drive the TypeScript interfaces.
- PL/SQL-backed actions are exposed as backend endpoints and consumed like any other HTTP call.

## 2. Environment configuration

The frontend should use standard Angular environment files for API configuration.

### Recommended environment values

- `environment.ts`
  - `apiBaseUrl: 'http://localhost:<backend-port>/api/v1'`
- `environment.development.ts` or local override
  - Same property, pointing to the local backend host and port.
- `environment.prod.ts`
  - Production API base URL.

### Configuration rules

- Never hardcode resource URLs inside components.
- Build all service URLs from `apiBaseUrl`.
- Keep environment-specific values outside feature code.
- If the backend uses a reverse proxy or gateway later, only the environment file should change.

## 3. HTTP service pattern

Each resource should have its own Angular service in `features/<resource>/services/` or in `core/services/` if shared across multiple features.

### Planned service names

- `CelestialObjectsApiService`
- `EventsApiService`
- `AffiliationsApiService`
- `ResearchersApiService`
- `ResearchPapersApiService`
- `TelescopesApiService`
- `MissionsApiService`
- `ObservationsApiService`
- `MissionObservationsApiService`
- `HabitablePlanetsApiService`

### Service responsibilities

- Fetch lists and single records.
- Create new records.
- Update existing records where the backend supports it.
- Delete records where permitted.
- Call special analysis endpoints for habitability and mission analysis.
- Translate HTTP errors into UI-friendly messages where possible.

## 4. DTO contract strategy

The frontend should define TypeScript interfaces that match backend DTOs, not the Oracle tables directly.

### DTO categories

- Read DTOs for list/detail display.
- Create DTOs for POST payloads.
- Update DTOs for PUT payloads.
- Composite DTOs for bridge entities.
- Result DTOs for special actions.

### Example interface groups

- `CelestialObjectDto`, `CreateCelestialObjectDto`, `UpdateCelestialObjectDto`
- `EventDto`, `CreateEventDto`, `UpdateEventDto`
- `AffiliationDto`, `CreateAffiliationDto`, `UpdateAffiliationDto`
- `ResearcherDto`, `CreateResearcherDto`, `UpdateResearcherDto`
- `ResearchPaperDto`, `CreateResearchPaperDto`, `UpdateResearchPaperDto`
- `TelescopeDto`, `CreateTelescopeDto`, `UpdateTelescopeDto`
- `MissionDto`, `CreateMissionDto`, `UpdateMissionDto`
- `ObservationDto`, `CreateObservationDto`
- `MissionObservationDto`, `CreateMissionObservationDto`, `UpdateMissionObservationDto`
- `HabitablePlanetDto`, `CreateHabitablePlanetDto`, `UpdateHabitablePlanetDto`

### Mapping rules

- Use camelCase field names in TypeScript.
- Represent booleans as booleans in the UI whenever the backend contract allows it.
- Represent dates as ISO strings or `Date` objects according to the form component requirements.
- Keep composite keys explicit instead of faking a single id.

## 5. API call patterns by resource

### Standard resource pattern

For most resources the frontend should support:

- `GET /api/v1/<resource>`
- `GET /api/v1/<resource>/{id}`
- `POST /api/v1/<resource>`
- `PUT /api/v1/<resource>/{id}`
- `DELETE /api/v1/<resource>/{id}`

### Bridge resource pattern

Bridge resources should use nested routes when the backend exposes them.

Examples:

- Mission observations: `/api/v1/missions/{missionId}/observations`
- Habitable planet assessments: `/api/v1/celestial-objects/{objectId}/habitability-assessments`

### Special analysis endpoints

The frontend must treat these as read-only analysis calls:

- `GET /api/v1/celestial-objects/{id}/habitability`
- `GET /api/v1/missions/{id}/status`
- `GET /api/v1/missions/{id}/efficiency`
- `GET /api/v1/celestial-objects/{id}/missions`

## 6. Shared HTTP infrastructure

Recommended shared infrastructure in `core/`:

- `ApiErrorInterceptor`
  - Normalizes backend validation and error responses.
- `HttpLoadingInterceptor`
  - Optional global loading signal for shell-level spinners.
- `ApiUrlService` or environment helper
  - Centralizes URL building if the workspace prefers a service over direct environment access.
- `NotificationService`
  - Wraps snack-bar messages and consistent error toasts.

## 7. Error handling approach

The backend plan uses `ProblemDetails`. The frontend should:

- Read `title`, `detail`, `status`, and validation error collections when present.
- Convert validation errors into field messages where possible.
- Show a generic error state when the backend response cannot be parsed.
- Preserve the raw message only for diagnostics or a detail expansion panel, not as the primary UX.

## 8. Loading and refresh behavior

- List pages should display a loading indicator during fetches.
- Detail pages should show a skeleton or progress state until data arrives.
- Save actions should disable the form while the request is in flight.
- Delete actions should refresh the current list after success.

## 9. Backend dependencies and assumptions

This plan depends on the backend providing:

- Stable versioned routes.
- A consistent JSON shape for DTOs.
- Clear 404, 400, 409, and 500 responses.
- CORS enabled for the Angular dev host.
- The final decision on whether mission observation and habitability bridge routes are exposed as full CRUD or as limited link/unlink endpoints.
- The final decision on whether observation records are create-only because the database triggers control the observation date.

If any backend contract changes, update the Angular interfaces and services before building the UI around them.
