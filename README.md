## Fulcrum Query SQL

This is shared code for the Fulcrum Query API and the Fulcrum Editor applications.

### Build

```sh
yarn build
```

### Publishing
Pull requests, merge queue entries and main changes run CI on GitHub-hosted
runners. After main validation succeeds, a GitHub App commits the next version
to `package.json` and creates its matching SemVer tag. Do not edit the root
package version manually. Tag creation starts the GitHub Packages publishing
workflow; this repository does not publish to npmjs.org.

As in the previous CI workflow, lint failures are reported but do not block
the release. Type checking, building, and tests must succeed.

Before enabling releases, configure fork-run approval, required CI checks,
GitHub Packages access, and the release App's branch and tag protection
bypasses. Disable the old Tekton publisher at cutover. If publishing fails,
rerun the tag workflow against the same tag; it verifies the release commit and
the package version before publishing.

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
