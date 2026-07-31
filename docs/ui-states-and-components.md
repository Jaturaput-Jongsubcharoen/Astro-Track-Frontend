# UI States and Components — Astro Track

This document defines the planned UI states, reusable components, accessibility requirements, and responsive behavior for the Astro Track Angular frontend.

## 1. UI state model

Every page and feature should handle the same core states.

### Loading

Use loading states while the app is waiting for data or submitting a form.

Recommended patterns:

- Page-level spinner for first-load fetches.
- Inline spinner or disabled submit button during save actions.
- Skeleton or placeholder content for large detail pages when appropriate.

### Empty

Show an empty state when a list or relationship has no records.

The empty state should include:

- A short explanation.
- A primary action when creation is allowed.
- A secondary link back to the parent view if relevant.

### Success

Use success feedback after create, update, delete, or analysis actions.

Recommended patterns:

- Snack-bar confirmation for quick actions.
- Inline success banner for important workflow completion.
- Page redirect back to the list or detail page after save.

### Validation

Validation states must appear before submission and on backend rejection.

Required behavior:

- Mark invalid fields clearly.
- Show field-level help text for required, format, and range rules.
- Preserve Oracle-backed constraints in the UI where possible.
- Map backend validation errors to the matching form field when the field name is known.

### Unauthorized / forbidden

Authentication is not defined yet in the backend scope, but the UI should still reserve states for future security handling.

- `401` should map to a sign-in or access-expired placeholder in future work.
- `403` should map to a forbidden page or inline denial message.
- For this issue set, keep the route and component placeholders in the architecture only.

### Error

Error handling should distinguish between recoverable and unrecoverable failures.

- Recoverable list/page errors should offer retry.
- Not-found cases should show a friendly empty or 404-style page.
- Unexpected backend or network failures should show a generic error state with a retry action.

## 2. Reusable component strategy

The frontend should favor shared reusable components over repeated page-local markup.

### Core reusable components

- `app-shell`
  - Persistent layout with toolbar, nav, and router outlet.
- `page-header`
  - Title, subtitle, breadcrumbs, and primary action area.
- `entity-table`
  - Generic table wrapper for list pages.
- `search-filter-bar`
  - Search, filter, and sort controls.
- `empty-state`
  - Reusable empty view with icon, text, and action button.
- `loading-overlay`
  - Covers a section while data loads or saves.
- `confirm-dialog`
  - Standard destructive action confirmation.
- `status-chip`
  - Shows values like active/completed, habitable/not habitable, success/failure.
- `detail-summary-card`
  - Displays key fields on detail pages.
- `action-toolbar`
  - Edit, delete, refresh, and special analysis actions.

## 3. Angular Material component strategy

Use Angular Material as the default component system.

### Table and list components

- `mat-table` for data grids.
- `mat-paginator` for paging.
- `mat-sort-header` for sortable columns.
- `mat-chip` for categorical and status values.
- `mat-icon-button` for row actions.

### Forms

- `mat-form-field` for all inputs.
- `mat-input` for text and numeric fields.
- `mat-select` for fixed vocabularies such as category, type, or Y/N values.
- `mat-datepicker` for date fields.
- `mat-slide-toggle` only if the backend exposes booleans directly.

### Layout and feedback

- `mat-toolbar` for the shell.
- `mat-sidenav` for responsive navigation.
- `mat-card` for section grouping.
- `mat-divider` for visual separation.
- `mat-progress-spinner` and `mat-progress-bar` for loading feedback.
- `mat-snack-bar` for success and failure notifications.
- `mat-dialog` for delete confirmation and cautionary actions.

## 4. Responsive behavior

The UI must work on desktop, tablet, and mobile.

### Desktop

- Use a side navigation shell.
- Show tables with full action columns.
- Keep detail pages in wide card layouts.

### Tablet

- Collapse navigation into a drawer.
- Reduce table density if needed.
- Keep forms in a single-column flow when space is limited.

### Mobile

- Switch to a drawer or top-level menu.
- Allow table rows to collapse into cards or stacked list items when the columns do not fit.
- Make primary actions reachable with thumb-friendly touch targets.

## 5. Accessibility requirements

Accessibility is a first-class requirement for the frontend.

### Must-have behaviors

- All inputs must have accessible labels.
- Error messages must be associated with their fields.
- Interactive elements must be keyboard reachable.
- Dialogs must trap focus and return focus to the triggering element.
- Color should not be the only signal for state.
- Status chips should include text, not icons only.
- Forms and tables should maintain sufficient contrast.

### Navigation and semantics

- Use semantic headings in a predictable order.
- Provide clear page titles that match the route.
- Ensure skip-link support if the shell grows beyond a simple layout.

## 6. Entity-specific component notes

### Celestial objects

- List table should highlight habitability and category.
- Detail page should surface the analysis action.
- Form should group gas/composition flags separately from numeric fields.

### Events

- List should emphasize event type and date.
- Detail should show visibility score and habitability impact.

### Researchers and affiliations

- Researchers should display affiliation clearly.
- Research paper pages should show the linked researcher where available.

### Missions

- Mission detail should show duration, status, and linked observations.
- Special action chips should expose efficiency and status views.

### Observations and bridge resources

- These pages should prioritize relationship context and not just raw record values.
- Mutation controls should be conservative because the database enforces several rules with triggers.

## 7. Assumptions and unresolved dependencies

This UI plan assumes the backend will provide:

- Predictable field names and types in DTO responses.
- A consistent error contract.
- A decision on whether observation edit screens are allowed.
- A decision on whether bridge entities are presented as full CRUD screens or as nested association screens.
- A decision on whether unauthorized states are in scope for the first backend release.

If any of those backend decisions change, update the UI states and components to match the final contract rather than the Oracle tables directly.
