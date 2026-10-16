# Design

## Context

See `proposal.md` for motivation and `specs/repeatable-gps-device-capture/spec.md` for the behavior contract. Form schemas already expose GPS device capture through a shared helper that checks for `_gps_device_capture` in raw columns and creates a JSONB system column. Repeatable schemas currently do not call that helper. The shared query path projects the column when a schema exposes it. `fulcrum-core` `^1.6.2` provides the GPS capture column in raw schemas.

## Goals / Non-Goals

**Goals:**
- Reuse the existing record-level column behavior for repeatables.
- Require the minimum `fulcrum-core` version that supplies the raw field.
- Preserve compatibility with legacy raw schemas that do not contain the field.

**Non-Goals:**
- Change GPS capture serialization or add a database migration.
- Update downstream repositories as part of this package change.

## Decisions

- Use the existing raw-column-aware GPS capture helper from repeatable schema setup, within the full-schema path. This keeps the label, accessor, and JSONB type consistent with record-level behavior; duplicating column construction would risk divergence.
- Raise the `@fulcrumapp/fulcrum-core` peer minimum to `^1.6.2`. The development dependency already resolves to 1.6.2, while the current peer range permits older versions that do not supply this raw column.
- Reuse the generic query projection driven by the schema's GPS capture column. No repeatable-specific SQL projection logic is needed, and a missing raw column continues to omit the projection.

## Risks / Trade-offs

- [Consumers remain on an older fulcrum-core release] → The updated peer minimum communicates the required release; dependent repositories must update to a compatible core version.
- [Legacy forms do not have the GPS capture column] → Keep column creation conditional on raw-column presence so queries do not reference unavailable columns.

## Migration Plan

No database migration is required. Publish this package with the updated peer minimum after implementing the repeatable schema support, then update dependent repositories to use `fulcrum-core` `^1.6.2` and the compatible query-sql release. Rollback consists of reverting the schema support and peer minimum together.
