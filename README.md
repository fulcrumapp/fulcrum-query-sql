# Fulcrum Query SQL

Shared query-to-SQL utilities used by Fulcrum applications (including API and Editor-related workflows).

## What This Repo Is For

- Build and publish `@fulcrumapp/query-sql`.
- Validate behavior with local tests before release.
- Debug package changes in a consumer app with `yalc`.

## Prerequisites

- Node.js 22 (matches CI and publish workflows)
- Yarn
- Access to GitHub Packages (`@fulcrumapp` scope)
- `yalc` installed globally when doing local package debugging
- Skaffold access if your consumer app uses containerized local development

## Quick Start (Local)

```sh
yarn install
yarn lint
yarn typecheck
yarn test
yarn build
```

## Development Commands

- `yarn lint`: Run ESLint.
- `yarn typecheck`: Run TypeScript project checks.
- `yarn test`: Run Jest tests.
- `yarn test:watch`: Run tests in watch mode.
- `yarn build`: Build CJS/ESM output and declaration files.
- `yarn clean`: Remove `dist`.

## Practical Debugging Runbook (Kevin Workflow)

Use this when testing package changes in another repository (for example, `fulcrum-components` or `report-generator`).

### Why `yalc` Instead of Git URL Dependencies

Some repositories do not commit or ship built `dist` artifacts in a way that works for dependency consumption through a direct git dependency reference. `yalc` packages your local build output and makes the consumer app resolve it like a local published package.

### End-to-End Flow

1. In this repository (`fulcrum-query-sql`), create your branch and make code changes.
1. Publish your local package snapshot:

```sh
yalc publish
```

1. In the consumer repository, install that local snapshot:

```sh
yalc add @fulcrumapp/query-sql
./yarn
```

1. Start or re-sync the consumer environment (Skaffold, dev server, etc.).
1. Validate behavior in the consumer application.
1. For additional iterations in this repository, re-publish and push updates:

```sh
yalc publish --push
```

1. In the consumer repository, run `./yarn` again if the lockfile/dependency metadata changed.

### Clean Exit (Return Consumer App to Normal Dependency)

When done with local package testing in the consumer app:

```sh
yalc remove @fulcrumapp/query-sql
./yarn
```

Then pin/update the dependency back to the intended released version in `package.json`.

## Troubleshooting (Detailed)

### Symptom: Changes are not visible in the consumer app

Likely causes:

- Consumer still points to a cached/old dependency state.
- Lockfile did not update after `yalc add` or `yalc publish --push`.
- Skaffold reused cached artifacts.

Recovery sequence:

```sh
# In consumer repo
yalc remove @fulcrumapp/query-sql
yarn remove @fulcrumapp/query-sql
./yarn cache clean
./yarn install

# Re-add the local package
yalc add @fulcrumapp/query-sql
./yarn

# Restart local environment without artifact cache
skaffold dev --cache-artifacts=false
# or
USER=<YOUR_NAMESPACE> skaffold dev --cache-artifacts=false
```

### Symptom: Build behaves differently from expected local dependency updates

Likely cause:

- Your local environment is using prebuilt images that are not rebuilt for dependency changes.

What to do:

- Force rebuild/resync in your local workflow.
- Prefer the explicit no-cache Skaffold command shown above.
- If your target environment hardcodes prebuilt images, this method may not reflect dependency updates until that workflow is adjusted.

### Symptom: Confusion between `yalc add`, `yalc update`, and `yalc publish --push`

Rule of thumb:

- `yalc add`: First time linking package into consumer repo.
- `yalc publish --push`: Push subsequent package updates from producer repo.
- `yalc update @fulcrumapp/query-sql`: Pull latest yalc snapshot in consumer if needed.

## Release and Publishing

This repo publishes through GitHub Actions on tag push (`v*`).

### Pre-Release Checklist

Run locally before tagging:

```sh
yarn install
yarn lint
yarn typecheck
yarn test
yarn clean && yarn build
```

### Tag-Driven Release Flow

1. Merge approved changes into `main`.
1. Pull latest `main`.
1. Create and push version tag:

```sh
git checkout main
git pull
git tag -a vX.Y.Z -m "X.Y.Z"
git push origin --tags
```

1. GitHub Actions will:
   - install dependencies,
   - run typecheck and tests,
   - set package version from the tag,
   - build,
   - publish to GitHub Packages.
1. Create a GitHub Release for that tag.

### Notes

- Keep `.npmrc`/credentials handling aligned with internal Fulcrum security practices.
- Coordinate with your engineering manager when in doubt about release permissions.

## Known Constraints

- Some local workflows that rely on prebuilt images may not immediately reflect dependency changes.
- Skaffold can sync more than once; the first sync can fail before lockfile refresh completes.

## Documentation Ownership Suggestion

For operational accuracy, review this README whenever there is a change to:

- local dependency/debugging workflow,
- release automation,
- Skaffold/container development behavior.

