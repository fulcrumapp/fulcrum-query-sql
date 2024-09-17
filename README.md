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
- Build the package, commit and push the changes
- In your other repo (most likely `fulcrum-components`)
  - In `package.json`, point your `fulcrum-query-sql` npm package to that branch in this format
  - `'fulcrum-query-sql': 'github:fulcrumapp/fulcrum-query-sql#BRANCH-NAME'`
- Rebuild the lock file by running `./yarn` (Do NOT delete the existing `yarn.lock`)
- Re-skaffold and the changes will now be visible for debugging

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

