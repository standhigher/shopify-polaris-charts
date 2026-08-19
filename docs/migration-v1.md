# Migrating to v1

## Supported runtime matrix

`@standhigher/charts@1` supports React and React DOM `>=18.3 <20`, Recharts
`>=3 <4`, and modern evergreen Chrome, Firefox, Safari, and Edge. Package
development and release automation support Node.js `>=20 <25`. Type declarations
are tested with TypeScript 5.4.5 and the repository's current compiler.

```bash
npm install @standhigher/charts@^1 react@^18.3 react-dom@^18.3 recharts@^3
```

React 19 is also supported. Keep React and React DOM on the same major/minor.

## Required Recharts 2 migration

v1 no longer supports Recharts 2. Upgrade the application to Recharts 3 before
installing this major version. The charts package still owns data bindings,
tooltip content, series identity, stack/axis identity, and its accessibility
layer; use `rechartsProps` only for the documented presentation escape hatches.

## SSR and framework usage

The package can be imported and rendered on the server without reading browser
globals during render. Recharts-backed interactive charts remain client
components in Next.js App Router:

```tsx
'use client';
import {TrendChart} from '@standhigher/charts';
```

Server components may import display-only formatters without React or Recharts:

```tsx
import {formatMoney} from '@standhigher/charts/formatters';
```

## Accessibility and localization

Primary charts now accept optional `accessibility={{label, description,
dataTable}}`. `dataTable` is caller-owned: the library does not infer business
rows, totals, comparisons, or summaries. Add `chartLegend` when supplying a
fully typed localization message object. Reduced-motion preferences disable
reveal and chart animations that the library controls.

## Compatibility notes

- Deprecated v0.x aliases and formatter names remain available throughout 1.x;
  their planned removal is v2.
- `chartTheme` is now deeply frozen and typed readonly. Copy values before
  customization instead of mutating the exported object.
- One palette green changed from `#50b83c` to `#409c32` to meet 3:1 graphical
  contrast on white.
- The public package has ESM root and `./formatters` entries and requires a
  modern bundler or Node ESM-aware resolver.

Run `npm run typecheck`, the application tests, SSR build, and a 320px dashboard
check after upgrading. See [upgrade-guide.md](upgrade-guide.md) for ongoing 1.x
updates.
