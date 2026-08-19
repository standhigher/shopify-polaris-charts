# Release and rollback checklist

## Before publishing

- Confirm the version, changelog date, clean worktree, reviewed API reports, and
  absence of an existing tag/npm version.
- Run unit, type, lint, package build, API, Storybook, performance, peer/type,
  Next.js, Vite, browser, and npm-pack gates.
- Inspect the tarball: runtime, declarations, license, README and approved docs
  only; no source, tests, stories, scripts, fixtures, or generated reports.
- Verify npm registry/account/scope and publish with public access using the
  intended dist-tag. Push commit/tag only after all checks pass.

## After publishing

- Verify `npm view @standhigher/charts version dist-tags peerDependencies` and
  install the published package in a clean consumer.
- Check GitHub tag/release and the hosted Storybook.

## Rollback

npm versions are immutable. For a bad release, stop rollout, move `latest` back
to the last known-good version with `npm dist-tag add`, and deprecate the bad
version with a precise message. Publish a new patch rather than reusing a version.
Document the incident and do not delete Git history or tags used by consumers.
