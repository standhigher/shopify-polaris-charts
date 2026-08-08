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

## Trusted Publishing

The package is prepared for npm Trusted Publishing from GitHub Actions. Configure
the npm package trusted publisher with these values:

- Publisher: GitHub Actions
- Organization or user: `standhigher`
- Repository: `shopify-polaris-charts`
- Workflow filename: `publish.yml`
- Environment name: leave empty unless a GitHub Actions environment is added
- Allowed actions: allow `npm publish`

The workflow at `.github/workflows/publish.yml` only runs when a `v*` tag is
pushed. The tag must match the package version exactly, such as `v0.1.1` for
`"version": "0.1.1"`.

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
- `README.zh-CN.md`
- `LICENSE`
- `docs/usage.md`
- `docs/usage.zh-CN.md`
- npm package metadata included by npm, such as `package.json`

`README.zh-CN.md`, `docs/usage.md`, and `docs/usage.zh-CN.md` are included
because the published README links to them for the language switcher and chart
usage guidance; excluding them would create broken documentation links in the
npm package. Other repository docs, including this release guide, are not part
of the published package.

## Publish

Preferred release path:

```bash
npm version patch
git push origin main --follow-tags
```

The pushed `v*` tag triggers GitHub Actions to publish through npm Trusted
Publishing. The workflow runs `npm publish --access public`, and the
`prepublishOnly` script runs lint, test, typecheck, build, and Storybook build.

Manual publishing is still available after login, version review, quality
checks, and dry-run review:

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
- Confirm English remains the default README and Chinese docs stay reachable
  through the language switcher.
- Confirm no npm token or credential appears in the repository or terminal
  output.
