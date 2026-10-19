# Tasks

## 1. fulcrum-core Compatibility

- [x] 1.1 Raise the `@fulcrumapp/fulcrum-core` peer dependency minimum to `^1.6.2`; verify package metadata requires the GPS-capable release and the development lockfile resolves fulcrum-core to 1.6.2.

## 2. Repeatable Schema Support

- [x] 2.1 Add `_gps_device_capture` to repeatable schemas through the shared JSONB helper only for full schemas with the raw column; verify full-schema inclusion, JSONB type, and omission when the column is unavailable or full-schema output is disabled in focused schema tests.
- [x] 2.2 Verify repeatable SQL results project the available value as `gps_device_capture` and remain valid when older raw repeatable schemas omit the column; cover both behaviors in focused query tests.

## 3. Validation

- [ ] 3.1 Run the targeted converter test suite and lint the changed source and test files; verify all GPS repeatable scenarios pass without lint errors.
