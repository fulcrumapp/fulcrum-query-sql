## Fulcrum Query SQL

This is shared code for the Fulcrum Query API and the Fulcrum Editor applications.

### Build

```sh
make
```
or
```sh
npm run build
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
- Move fulcrum.npmrc back to .npmrc and `npm login` (Username: fulcrumapp, Password: 1password, Email: support@fulcrumapp.com)
- `npm publish`
