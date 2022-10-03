## Fulcrum Query SQL

This is shared code for the Fulcrum Query API and the Fulcrum Editor applications.

### Build

```sh
make
```

### Publishing

- `yarn clean && yarn build`
- Bump package.json version
- Merge to master
- Checkout master, `git pull`
- `git tag -a vx.x.x -m "x.x.x"`
- `git push origin --tags`
- Create vx.x.x release for tag in github
- Move .npmrc off to fulcrum.npmrc and `npm login` (Username: fulcrumapp, Password: 1password, Email: support@fulcrumapp.com)
- `npm publish`
- Move fulcrum.npmrc back to .npmrc to reset back to your own configurations

### Debugging

- Create a branch
- Add logs or a `debugger` in fulcrum-query-sql where applicable
- Build the package, commit and push the changes
- In your other repo (most likely `fulcrum-components`)
  -  In `package.json`, point your `fulcrum-query-sql` npm package to that branch in this format
  - `fulcrum-query-sql: github:fulcrumapp/fulcrum-query-sql#BRANCH-NAME` 
- Delete the existing `yarn.lock` file
- Rebuild the lock file by running `./yarn`
- Re-skaffold and the changes will now be visible for debugging

