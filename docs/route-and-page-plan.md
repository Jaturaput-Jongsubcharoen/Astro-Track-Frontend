# Route and Page Plan — Astro Track

This document defines the planned Angular routes and page responsibilities for the Astro Track frontend. It is a design-only artifact and does not create any Angular source files.

## 1. Route design goals

- Keep routes aligned with backend resources.
- Use feature-level lazy loading where practical.
- Separate list, detail, and edit responsibilities.
- Keep page components thin and delegate data access to services.
- Preserve a predictable route pattern across every resource.

## 2. Shell routes

### Public application shell

- `/` or `/home`
  - Landing page or dashboard summary.
  - Can show quick links, recent records, and high-level counts when API support exists.
- `/about`
  - Project description and domain summary.
- `/help`
  - UI guidance, navigation help, and data conventions.

### Global layout routes

- `app-shell`
  - Persistent header, navigation, and router outlet.
- `not-found`
  - Fallback for unknown routes.
- `forbidden`
  - Placeholder page for future authorization errors.
- `server-error`
  - Generic unrecoverable error page.

## 3. Resource routes

The resource routes below follow the planned backend resources and the backend API plan.

### Celestial objects

- `/celestial-objects`
  - List page with search, sort, and filter controls.
- `/celestial-objects/new`
  - Create form.
- `/celestial-objects/:id`
  - Detail page with summary, relationships, and habitability status.
- `/celestial-objects/:id/edit`
  - Update form.
- `/celestial-objects/:id/habitability`
  - Dedicated analysis page or section showing the PL/SQL-backed habitability result.

### Events

- `/events`
  - Event list.
- `/events/new`
  - Create form.
- `/events/:id`
  - Event detail.
- `/events/:id/edit`
  - Edit form.

### Affiliations

- `/affiliations`
  - List page.
- `/affiliations/new`
  - Create form.
- `/affiliations/:id`
  - Detail page.
- `/affiliations/:id/edit`
  - Edit form.

### Researchers

- `/researchers`
  - List page with affiliation filters.
- `/researchers/new`
  - Create form.
- `/researchers/:id`
  - Detail page showing publications and missions when available.
- `/researchers/:id/edit`
  - Edit form.

### Research papers

- `/research-papers`
  - List page.
- `/research-papers/new`
  - Create form.
- `/research-papers/:id`
  - Detail page.
- `/research-papers/:id/edit`
  - Edit form.

### Telescopes

- `/telescopes`
  - List page.
- `/telescopes/new`
  - Create form.
- `/telescopes/:id`
  - Detail page.
- `/telescopes/:id/edit`
  - Edit form.

### Missions

- `/missions`
  - List page with status and date filters.
- `/missions/new`
  - Create form.
- `/missions/:id`
  - Detail page with linked observations and analysis actions.
- `/missions/:id/edit`
  - Edit form.
- `/missions/:id/status`
  - Mission status view backed by the PL/SQL status function.
- `/missions/:id/efficiency`
  - Mission efficiency view backed by the PL/SQL efficiency function.

### Observations

- `/observations`
  - List page.
- `/observations/new`
  - Create form.
- `/observations/:id`
  - Detail page.
- No dedicated edit route is planned initially because observation dates are trigger-controlled and observation records are treated as measurement data.

### Mission observations

- `/missions/:missionId/observations`
  - Mission-specific list of linked observations.
- `/missions/:missionId/observations/new`
  - Link an existing observation to a mission.
- `/missions/:missionId/observations/:observationId`
  - Link detail view.
- `/missions/:missionId/observations/:observationId/edit`
  - Edit metadata such as role, success flag, and data size.

### Habitable planets

- `/celestial-objects/:objectId/habitability-assessments`
  - List assessments for an object.
- `/celestial-objects/:objectId/habitability-assessments/new`
  - Create assessment form.
- `/celestial-objects/:objectId/habitability-assessments/:eventId/:researchId`
  - Assessment detail view.
- `/celestial-objects/:objectId/habitability-assessments/:eventId/:researchId/edit`
  - Edit assessment form.

## 4. Page responsibilities

### List pages

List pages should:

- Fetch the resource collection.
- Support filtering, sorting, and paging when the backend provides it.
- Offer quick actions for create, view, edit, and delete.
- Display empty and loading states.

### Detail pages

Detail pages should:

- Present a resource summary.
- Show related records where the backend exposes them.
- Expose special analysis actions where applicable.
- Keep destructive actions behind confirmation dialogs.

### Form pages

Form pages should:

- Load existing values for edit routes.
- Validate required, numeric, date, and enum-like fields.
- Preserve backend field semantics.
- Prevent submission until the form is valid.

## 5. Route grouping by domain

### Astronomy data

- Celestial objects
- Events
- Telescopes

### Research data

- Affiliations
- Researchers
- Research papers

### Mission data

- Missions
- Observations
- Mission observations

### Analysis data

- Habitable planets

## 6. Navigation behavior

The navigation should always let users return to the major resource list pages. The shell should keep the current feature context visible so users can move between related resources without losing progress.

Recommended navigation links:

- Dashboard / Home
- Celestial Objects
- Events
- Affiliations
- Researchers
- Research Papers
- Telescopes
- Missions
- Observations
- Habitability Assessments

## 7. Route guard assumptions

Authorization is not defined yet by the backend issue set. For now:

- Do not assume authenticated-only routes.
- Reserve guard and forbidden routes for later implementation.
- Treat the `forbidden` route as a placeholder for future backend security work.
