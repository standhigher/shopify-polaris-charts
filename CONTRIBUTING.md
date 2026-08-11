# Contributing

Thanks for helping improve `@standhigher/charts`.

## Development Setup

Use Node.js 20 or newer and install dependencies from the lockfile:

```bash
npm ci
```

Run Storybook during component development:

```bash
npm run storybook
```

## Quality Gate

Run the full local gate before opening a pull request:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run build-storybook
npm pack --dry-run
```

## Pull Requests

- Keep changes focused on one feature, bug fix, or documentation improvement.
- Update tests when behavior changes.
- Update Storybook stories when a component state, prop, or visual behavior changes.
- Update `docs/api.md` and `docs/api.zh-CN.md` when public component props change.
- Update `CHANGELOG.md` for user-visible changes.

## Release Notes

Package releases are published to npmjs as `@standhigher/charts`.

The preferred release path is tag-based publishing from GitHub Actions. The tag
must match the package version, for example `v0.2.0` for `"version": "0.2.0"`.

Manual publishing should use npmjs only:

```bash
npm publish --access public --registry=https://registry.npmjs.org/ --auth-type=web
```
