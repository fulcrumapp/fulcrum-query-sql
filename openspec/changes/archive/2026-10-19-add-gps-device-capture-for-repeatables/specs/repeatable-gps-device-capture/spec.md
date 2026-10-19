# Spec Delta

## Purpose

Defines how GPS device-capture metadata is exposed to consumers of repeatable records while preserving compatibility with schemas that do not provide the field.

## ADDED Requirements

### Requirement: Repeatable GPS device capture is conditionally exposed
The system SHALL expose `_gps_device_capture` as a JSONB system column on repeatable records only when the raw repeatable schema contains the column and full-schema output is requested.

#### Scenario: Full schema includes GPS device capture when available
- **WHEN** a full repeatable schema is built from raw columns containing `_gps_device_capture`
- **THEN** the schema exposes the GPS Device Capture column with JSONB type

#### Scenario: GPS device capture is omitted when unavailable or not requested
- **WHEN** the raw repeatable schema lacks `_gps_device_capture` or full-schema output is not requested
- **THEN** the repeatable schema does not expose the GPS Device Capture column

### Requirement: Repeatable queries return available GPS device capture
The system SHALL include an available repeatable GPS device-capture value in full-schema query results under the `gps_device_capture` output name.

#### Scenario: Query returns the raw GPS device-capture value
- **WHEN** a full-schema query targets a repeatable whose raw schema contains `_gps_device_capture`
- **THEN** the result includes that JSONB value as `gps_device_capture`

#### Scenario: Query remains compatible with older repeatable schemas
- **WHEN** a full-schema query targets a repeatable whose raw schema lacks `_gps_device_capture`
- **THEN** the query does not reference or return the unavailable column
