# Frontend Architecture Plan — Astro Track

This document defines the planned Angular frontend architecture for Astro Track. It is documentation only and is aligned to the existing Oracle schema and the planned backend API resources; no Angular project files are created yet.

## 1. Frontend goals

The frontend must:

- Present the Astro Track domain data in a clear, searchable, and responsive Angular UI.
- Consume the planned ASP.NET Core REST API instead of talking directly to Oracle.
- Preserve the database as the source of truth for all business rules.
- Avoid inventing entities or screens that do not exist in the Oracle schema.
- Add features incrementally, starting with the simplest list/detail workflows and then exposing PL/SQL-driven special actions.

## 2. Recommended Angular architecture

A feature-based Angular workspace is recommended. The application should be organized by domain feature rather than by technical type alone.

### Proposed top-level structure

```text
src/
├── app/
│   ├── core/
│   │   ├── auth/                 # reserved for future auth handling
│   │   ├── interceptors/
│   │   ├── services/
│   │   └── guards/
│   ├── layout/
│   │   ├── shell/
│   │   ├── navigation/
│   │   └── footer/
│   ├── shared/
│   │   ├── components/
│   │   ├── dialogs/
│   │   ├── pipes/
│   │   └── validators/
│   ├── features/
│   │   ├── celestial-objects/
│   │   ├── events/
│   │   ├── affiliations/
│   │   ├── researchers/
│   │   ├── research-papers/
│   │   ├── telescopes/
│   │   ├── missions/
│   │   ├── observations/
│   │   ├── mission-observations/
│   │   └── habitable-planets/
│   ├── models/
│   └── app.routes.ts
├── assets/
└── environments/
```

### Architecture principles

- `core/` contains singleton services and app-wide infrastructure.
- `shared/` contains reusable UI and utility code with no feature-specific business logic.
- `features/` contains one folder per Oracle-backed resource.
- Each feature owns its routing, page components, feature service, and local UI pieces.
- Domain logic stays in the backend or Oracle packages; Angular only coordinates user interaction and presentation.

## 3. Feature organization pattern

Each feature should follow the same internal pattern:

```text
features/<feature-name>/
├── pages/
│   ├── list-page/
│   ├── detail-page/
│   └── form-page/
├── components/
├── services/
├── models/
├── routes.ts
└── feature.module.ts (only if the final Angular version uses NgModules)
```

If the workspace uses standalone components, `feature.module.ts` can be omitted and the route definition can be colocated with the feature.

### Feature responsibilities

- `pages/` are route targets and handle orchestration.
- `components/` are reusable within the feature and remain presentational where possible.
- `services/` call the REST API and adapt DTOs for the UI.
- `models/` contain feature-specific TypeScript interfaces matching backend DTOs.
- `routes.ts` defines child routes for that feature.

## 4. Shared layout and navigation

The UI should use a persistent shell layout:

- Top app bar with Astro Track branding.
- Side navigation or responsive drawer for the major resources.
- Main content region for routed pages.
- Optional footer with project metadata.

Navigation should group resources by domain:

- Astronomy data: celestial objects, events, telescopes.
- Research data: affiliations, researchers, research papers.
- Mission data: missions, observations, mission observations.
- Analysis data: habitable planets.

## 5. Angular Material strategy

Angular Material is the preferred component library because it provides accessible, consistent UI primitives that fit forms, tables, dialogs, and navigation.

Recommended Material components:

- `mat-toolbar` for the application shell.
- `mat-sidenav` and `mat-nav-list` for navigation.
- `mat-card` for page sections and summary panels.
- `mat-table` for entity lists.
- `mat-paginator` and `mat-sort` for list refinement.
- `mat-form-field`, `mat-input`, `mat-select`, and `mat-datepicker` for forms.
- `mat-dialog` for delete confirmation and important actions.
- `mat-chip` or `mat-badge` for status indicators such as habitable/non-habitable or active/completed.
- `mat-progress-spinner` and `mat-progress-bar` for loading states.
- `mat-icon` for affordances and action buttons.

### Material usage rules

- Use tables for read-heavy list views.
- Use cards for detail pages and dashboards.
- Use dialogs only for disruptive actions.
- Keep forms grouped by domain section rather than as one long flat form.

## 6. TypeScript interface strategy

TypeScript interfaces should mirror the planned backend DTOs rather than the Oracle tables directly.

Recommended interface groups:

- Read DTO interfaces for list/detail display.
- Create DTO interfaces for POST requests.
- Update DTO interfaces for PUT requests.
- Composite-key DTOs for bridge resources.
- Special response models for PL/SQL-backed actions such as habitability and mission analysis.

### Interface mapping examples

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

### Interface design rules

- Use camelCase in TypeScript.
- Preserve backend meaning, but do not copy Oracle column casing into the frontend.
- Prefer booleans in the UI for Y/N fields when the backend exposes them that way.
- Keep date fields as ISO strings or `Date`-compatible values depending on the Angular date strategy.

## 7. Feature-to-resource alignment

Each Angular feature should map to exactly one planned backend resource group:

- `celestial-objects` feature → celestial object resource and habitability action.
- `events` feature → event resource.
- `affiliations` feature → affiliation resource.
- `researchers` feature → researcher resource.
- `research-papers` feature → research paper resource.
- `telescopes` feature → telescope resource.
- `missions` feature → mission resource and mission analysis actions.
- `observations` feature → observation resource.
- `mission-observations` feature → bridge resource.
- `habitable-planets` feature → bridge resource.

## 8. Incremental delivery

The frontend should be implemented in the same order as the backend API stabilizes:

1. Shell, routing, and shared layout.
2. Celestial objects list/detail/forms.
3. Events and telescopes.
4. Affiliations, researchers, and research papers.
5. Missions and observations.
6. Bridge resources and PL/SQL-backed analysis screens.

## 9. Dependencies on the backend

This frontend architecture assumes the backend provides:

- Versioned JSON endpoints under `/api/v1`.
- Stable DTO shapes for every resource.
- A documented error format.
- Endpoints for PL/SQL-backed business actions.
- Consistent handling of dates, booleans, nullability, and composite keys.

If the backend contract changes, the frontend interfaces and route pages must be updated to match the API plan rather than the Oracle tables directly.
