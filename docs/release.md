# Release Guide

This package is prepared for manual npm publishing as `@standhigher/charts`, a
public scoped package under the `@standhigher` npm scope. The package metadata
sets `publishConfig.access` to `public`, so publish commands must keep public
access explicit.

Publishing is prepared for npmjs at `https://registry.npmjs.org/`, not a private
or mirrored registry. The project `.npmrc` and `publishConfig.registry` both
point at npmjs so local registry defaults do not redirect the release.

Do not publish unless the npm account has confirmed permission for the
`@standhigher` scope and the release version and dist-tag have been reviewed.
This guide prepares the release process only; it does not require running
`npm publish`.

## Package Scope and Access

- Package name: `@standhigher/charts`
- Scope: `@standhigher`
- Access level: public scoped package
- Registry: `https://registry.npmjs.org/`
- Publish command: `npm publish --access public --registry=https://registry.npmjs.org/`

## Login

Log in with an npm account that has publish rights to the `@standhigher` scope:

```bash
npm login --registry=https://registry.npmjs.org/
npm whoami --registry=https://registry.npmjs.org/
```

Do not commit, paste, or expose npm tokens. Use the interactive npm login flow
or an approved secret manager in automation.

## Version Bump

Review the current version in `package.json`, then choose the appropriate
semantic version bump:

```bash
npm version patch
npm version minor
npm version major
```

Use `patch` for compatible fixes, `minor` for backwards-compatible features,
and `major` for breaking changes. The current package is still at `0.0.0`, so
the first real release should choose an intentional version before publishing.

## Prepublish Gate

`prepublishOnly` runs automatically before `npm publish` and must complete
successfully:

```bash
npm run lint
npm run test
npm run typecheck
npm run build
npm run build-storybook
```

Run the same commands manually before a release review so failures are found
before invoking npm publish.

## Dry Run Package Review

Inspect the exact package contents before publishing:

```bash
npm pack --dry-run --registry=https://registry.npmjs.org/
```

The publish whitelist intentionally includes only:

- `dist`
- `README.md`
- `LICENSE`
- `docs/usage.md`
- npm package metadata included by npm, such as `package.json`

`docs/usage.md` is included because the published README links to
`docs/usage.md`; excluding it would create a broken documentation link in the
npm package. Other repository docs, including this release guide, are not part
of the published package.

## Publish

After login, version review, quality checks, and dry-run review, publish
manually:

```bash
npm publish --access public --registry=https://registry.npmjs.org/
```

Do not run this command during release-preparation tasks or dry-run validation.

## Dist-Tags

Use dist-tags to control which version npm installs by default:

```bash
npm publish --access public --tag next --registry=https://registry.npmjs.org/
npm dist-tag ls @standhigher/charts --registry=https://registry.npmjs.org/
npm dist-tag add @standhigher/charts@<version> latest --registry=https://registry.npmjs.org/
npm dist-tag add @standhigher/charts@<version> next --registry=https://registry.npmjs.org/
npm dist-tag rm @standhigher/charts next --registry=https://registry.npmjs.org/
```

Use `latest` for stable releases and `next` for prerelease or validation builds
that should not become the default install.

## Self-Review Checklist

- Confirm package name is `@standhigher/charts`.
- Confirm npm account has permission to publish under `@standhigher`.
- Confirm public access is intentional.
- Confirm npm registry is `https://registry.npmjs.org/`.
- Confirm the version has been intentionally bumped for the release.
- Confirm `npm pack --dry-run` contains only necessary publish files.
- Confirm `docs/usage.md` remains included while README links to it.
- Confirm no npm token or credential appears in the repository or terminal
  output.
