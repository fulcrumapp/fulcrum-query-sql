# Proposal

## Why

Repeatable records can contain GPS device-capture metadata, but `fulcrum-query-sql` currently exposes that system column only for parent records. Adding the same conditional support for repeatable schemas lets downstream consumers query the metadata without requiring broad schema migrations that could break older forms.

## What Changes

- Add `_gps_device_capture` to repeatable schemas as a JSONB system column when the raw repeatable schema includes it and full-schema columns are requested.
- Preserve the existing behavior for full-schema-disabled requests and for older repeatables without the raw column.
- Require `@fulcrumapp/fulcrum-core` `^1.6.2`, whose schema includes GPS device capture, as the minimum supported peer version.

## Capabilities

### New Capabilities

- `repeatable-gps-device-capture`: Describes conditional exposure and query projection of GPS device-capture metadata on repeatable records.

### Modified Capabilities

None.

## Impact

The change affects repeatable schema construction and SQL query projection in `src/repeatable-schema.js` and the existing shared GPS column helper in `src/form-field-schema.js`, with regression coverage in `src/ast/__tests__/converter.test.js`. It raises the `@fulcrumapp/fulcrum-core` peer minimum to `^1.6.2`; development already uses that release. No persisted-schema migration is required, and raw column availability remains the compatibility guard for older forms.
