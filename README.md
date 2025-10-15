## Fulcrum Query SQL

This is shared code for the Fulcrum Query API and the Fulcrum Editor applications.

### Build

```sh
yarn build
```

### Publishing
Reach out to your local engineering manager for this step.

- `yarn clean && yarn build`
- Bump package.json version
- Merge to `main`
- Checkout `main`, `git pull`
- `git tag -a vx.x.x -m "x.x.x"` (use actual tag number of next release)
- `git push origin --tags`
- Create a release for the tag in github
- Move .npmrc off to fulcrum.npmrc and `npm login` (Credentials in 1password)
- `npm publish`
- Move fulcrum.npmrc back to .npmrc to reset back to your own configurations

### Debugging

- Create a branch
- Add logs or a `debugger` in fulcrum-query-sql where applicable
- Run `yalc publish`
- In your other repo (most likely `fulcrum-components`)
  - Run `yalc add fulcrum-query-sql`
  - Rebuild the lock file by running `./yarn` if the version or commit has changed.
- Re-skaffold or let skaffold sync and the changes will now be visible for debugging. Skaffold may sync twice and the first attempt may produce an error because the lock file has not yet been updated.
- Run `yalc publish --push` for subsequent changes and to push these changes automatically to any applications where the `yalc` version has been insalled. You still need to run `./yarn` if the version or commit has changed.

### Debugging troubleshooting

***Issue: Changes not visible in `fulcrum` after following the `Debugging` steps.***

***Solution***: If changes are not reflecting even after following the debugging steps, you might need to ensure a completely clean environment for your dependencies. Here are some steps to ensure that the `fulcrum` repository is correctly picking up the changes from `fulcrum-query-sql`:

1. Update Dependencies Safely:
- Inside `fulcrum-components` run:

```
yarn remove fulcrum-query-sql
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

