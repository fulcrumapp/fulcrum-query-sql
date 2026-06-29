# Fulcrum Query SQL - Confluence Draft (Copy-Ready)

## Purpose

This page documents the practical workflow to develop, debug, and release `@fulcrumapp/query-sql` with minimal friction.

Use this guide when:

- you need to test local package changes in a consumer repository,
- direct git dependency references are not reliable for your scenario,
- local environment behavior differs because of Docker/Skaffold caching.

---

## System Context

`@fulcrumapp/query-sql` is consumed by Fulcrum applications and services. This package should be treated as a reusable dependency with a predictable release and local-debug loop.

### Important Constraints

- CI and publish workflows run on Node.js 22.
- Publishing is tag-driven (`v*`) through GitHub Actions.
- Some consumer flows use prebuilt images, which can hide dependency updates.

---

## Standard Local Debug Workflow (Recommended)

### Producer Repo (`fulcrum-query-sql`)

```sh
# after making code changes
yalc publish
```

For follow-up iterations:

```sh
yalc publish --push
```

### Consumer Repo (example: `fulcrum-components` or `report-generator`)

```sh
yalc add @fulcrumapp/query-sql
./yarn
```

If changes are pushed from producer and not visible yet:

```sh
yalc update @fulcrumapp/query-sql
./yarn
```

### Cleanup After Testing

```sh
yalc remove @fulcrumapp/query-sql
./yarn
```

Then point dependency back to the intended released version.

---

## Why This Flow Exists

Direct git dependency references can fail to behave as expected in workflows where build artifacts are not available in the consumed state. `yalc` makes local changes installable as package snapshots and is more deterministic for integration testing.

---

## Docker/Skaffold Caveats

- If your consumer app uses Docker builds, ensure local dependency context is actually available to the build process.
- If Skaffold caches artifacts, local package updates may not appear immediately.
- First sync can fail temporarily while lockfile/dependency state catches up.
- If your environment depends on prebuilt images, dependency updates may not be reflected until image/rebuild behavior is adjusted.

Recommended recovery command:

```sh
skaffold dev --cache-artifacts=false
# or
USER=<YOUR_NAMESPACE> skaffold dev --cache-artifacts=false
```

---

## Troubleshooting Matrix

| Symptom | Likely Cause | Recovery |
| --- | --- | --- |
| Package changes not visible | stale lockfile/cache | `yalc remove`, reinstall, `yalc add`, run `./yarn` |
| Local updates still not visible after re-add | Skaffold artifact cache | restart with `--cache-artifacts=false` |
| Dependency source confusion | mixed `yalc` + non-yalc states | remove yalc package, reinstall from intended source |
| Behavior differs between local and env | prebuilt image workflow | force rebuild or use a workflow that rebuilds dependencies |

---

## Safe Recovery Runbook

Run in the consumer repository:

```sh
yalc remove @fulcrumapp/query-sql
yarn remove @fulcrumapp/query-sql
./yarn cache clean
./yarn install
yalc add @fulcrumapp/query-sql
./yarn
```

Restart local stack (no cache):

```sh
skaffold dev --cache-artifacts=false
```

---

## Release Process Summary

1. Validate locally: lint, typecheck, test, build.
2. Merge into `main`.
3. Create/push tag `vX.Y.Z`.
4. GitHub Actions publishes from tag.
5. Create GitHub release notes.

---

## Maintenance and Ownership

### Suggested Owner

- Package maintainers for `@fulcrumapp/query-sql`
- Secondary reviewers: teams consuming this package in local containerized workflows

### Review Cadence

- Revisit this page on any change to:
  - release automation,
  - yalc workflow,
  - local Docker/Skaffold behavior,
  - dependency installation/auth policy.

### Last Reviewed

- Date: TODO
- Reviewer: TODO
