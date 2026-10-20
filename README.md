## Fulcrum Query SQL

This is shared code for the Fulcrum Query API and the Fulcrum Editor applications.

### Build

```sh
yarn build
```

### Publishing
To publish a release to GitHub Packages:

1. Merge the changes to release into `main`.
2. Update your local `main` and create an annotated tag for the next version:

   ```sh
   git switch main
   git pull --ff-only origin main
   git tag -a vX.Y.Z -m "vX.Y.Z"
   ```

   Replace `X.Y.Z` with the release's semantic version. The tag must start with `v`.
3. Push the tag to trigger the Publish workflow:

   ```sh
   git push origin vX.Y.Z
   ```

The workflow sets the package version from the tag (removing the leading `v`), installs dependencies, runs the type check and tests, builds the package, and publishes it to GitHub Packages. No manual package version bump, GitHub release, or `npm publish` is needed. Check the Publish workflow run to confirm the release completed.

### Debugging

- Create a branch
- Add logs or a `debugger` in @fulcrumapp/query-sql where applicable
- Run `yalc publish`
- In your other repo (most likely `fulcrum-components`)
  - Run `yalc add @fulcrumapp/query-sql`
  - Rebuild the lock file by running `./yarn` if the version or commit has changed.
  - Run `yalc remove @fulcrumapp/query-sql` when done testing in that repository.
- Re-skaffold or let skaffold sync and the changes will now be visible for debugging. Skaffold may sync twice and the first attempt may produce an error because the lock file has not yet been updated.
- Run `yalc publish --push` for subsequent changes and to push these changes automatically to any applications where the `yalc` version has been installed. You still need to run `./yarn` if the version or commit has changed.
- You can also run `yalc publish` from this repository and `yalc update @fulcrumapp/query-sql` from the other repository.

### Debugging troubleshooting

***Issue: Changes not visible in `fulcrum` after following the `Debugging` steps.***

***Solution***: If changes are not reflecting even after following the debugging steps, you might need to ensure a completely clean environment for your dependencies. Here are some steps to ensure that the `fulcrum` repository is correctly picking up the changes from `@fulcrumapp/query-sql`:

1. Update Dependencies Safely:
- Inside `fulcrum-components` run:

```
yarn remove @fulcrumapp/query-sql
```
- After that

```
yarn add fulcrum-query-sql@github:fulcrumapp/fulcrum-query-sql#BRANCH-NAME
```
2. Clean Yarn Cache: Clear the yarn cache to remove any stored data from previous installs which might conflict

```
./yarn cache clean

```

3. Reinstall Dependencies: Reinstall your dependencies to ensure all links are correctly set up:

```
./yarn install
```

4. Restart Skaffold with your namespace  and No Cache:

```
skaffold dev --cache-artifacts=false
```
or

```
USER=<YOUR NAMESPACE> skaffold dev --cache-artifacts=false
```
