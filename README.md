# @standhigher/charts

Reusable React chart components for Shopify App dashboards built with Polaris.

This package provides reusable React chart components for Polaris-style chart
experiences, including card shells, trend charts, donut charts, stacked bar
charts, and combo charts.

## Installation

```bash
npm install @standhigher/charts react react-dom @shopify/polaris recharts
```

## Basic Usage

```tsx
import { ChartCard, TrendChart } from '@standhigher/charts';

const data = [
  { date: '2026-07-20', grossSales: 18342.8 },
  { date: '2026-07-21', grossSales: 19218.1 }
];

export function RevenueCard() {
  return (
    <ChartCard title="Revenue trend" subtitle="Sample period" metric="$37.6K" state="ready">
      <TrendChart
        data={data}
        format="currency"
        series={[{ id: 'grossSales', label: 'Gross sales', data }]}
        xFormat="date"
        xKey="date"
      />
    </ChartCard>
  );
}
```

## Examples and Storybook

Run Storybook locally to view individual component stories and the phase one
overview for product and design review:

```bash
npm run storybook
```

Open `Examples/Phase One Overview` to see `ChartCard`, `TrendChart`,
`DonutChart`, `StackedBarChart`, and `ComboChart` together with Shopify App
dashboard-style sample data.

For usage guidance by chart type, see [docs/usage.md](docs/usage.md).

## Local Development

Install dependencies from the lockfile:

```bash
npm ci
```

Run tests during development:

```bash
npm run test
npm run test:watch
```

Run the full local quality gate before opening or updating a PR. These commands
match the CI workflow:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run build-storybook
npm pack --dry-run
```

Storybook is also available for local previews:

```bash
npm run storybook
```

## Release Preparation

This package is prepared for manual npm publishing as `@standhigher/charts`.
It uses the `@standhigher` scope and `publishConfig.access` is set to
`public`, so a real release must be published with public scoped-package access
to npmjs at `https://registry.npmjs.org/`.

Before publishing, confirm npm account access to the `@standhigher` scope, then
run the local release gate:

```bash
npm config get registry
npm run lint
npm run test
npm run typecheck
npm run build
npm run build-storybook
npm pack --dry-run --registry=https://registry.npmjs.org/
```

The `prepublishOnly` script runs the same lint, test, typecheck, build, and
Storybook build checks automatically when `npm publish` is invoked. This
repository is configured for manual release review; do not publish until the
package name, scope permissions, version, dry-run package contents, and npm
dist-tag are intentionally confirmed.
