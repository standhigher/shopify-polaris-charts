# @standhigher/charts

[![npm version](https://img.shields.io/npm/v/%40standhigher%2Fcharts.svg)](https://www.npmjs.com/package/@standhigher/charts)
[![npm downloads](https://img.shields.io/npm/dm/%40standhigher%2Fcharts.svg)](https://www.npmjs.com/package/@standhigher/charts)
[![CI](https://github.com/standhigher/shopify-polaris-charts/actions/workflows/ci.yml/badge.svg)](https://github.com/standhigher/shopify-polaris-charts/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/%40standhigher%2Fcharts.svg)](LICENSE)
[![Storybook](https://img.shields.io/badge/storybook-demo-ff4785.svg)](https://standhigher.github.io/shopify-polaris-charts/)

Language: English | [中文](README.zh-CN.md)

Reusable React chart components for Shopify App dashboards built with Polaris.

This package provides reusable React chart components for Polaris-style chart
experiences, including card shells, metric cards, trend charts, donut charts,
stacked bar charts, and combo charts.

## Links

- npm package: [@standhigher/charts](https://www.npmjs.com/package/@standhigher/charts)
- Storybook demo: [standhigher.github.io/shopify-polaris-charts](https://standhigher.github.io/shopify-polaris-charts/)
- GitHub repository: [standhigher/shopify-polaris-charts](https://github.com/standhigher/shopify-polaris-charts)
- API reference: [docs/api.md](docs/api.md)
- Usage guide: [docs/usage.md](docs/usage.md)
- Changelog: [CHANGELOG.md](CHANGELOG.md)
- Contributing guide: [CONTRIBUTING.md](CONTRIBUTING.md)
- Security policy: [SECURITY.md](SECURITY.md)
- Code of conduct: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## Installation

```bash
npm install @standhigher/charts react react-dom recharts
```

## Component Overview

| Component | Purpose | Start with |
| --- | --- | --- |
| `ChartCard` | Polaris-style chart shell with title, subtitle, metric, trend, actions, and loading or empty states. | Use around every chart to keep dashboard cards consistent. |
| `MetricCard` | Accessible headline metric with comparison, trend, and loading skeleton. | Revenue, orders, conversion rate, AOV, and customer KPIs. |
| `ChartStateRegion` | Shared chart-area loading, empty, error/retry, skeleton, and reveal renderer. | Consistent states across all primary charts. |
| `TrendChart` | Single or multi-series line charts for time-series metrics. | Use for revenue, orders, conversion rate, and other trends. |
| `DonutChart` | Category share visualization with optional legend controls. | Use for channel, market, source, or segment breakdowns. |
| `StackedBarChart` | Stacked or grouped bar charts with axis, grid, tooltip, and margin customization. | Use for comparing multiple metrics across time or categories. |
| `ComboChart` | Bar plus line composition for mixed metric dashboards. | Use when volume and rate metrics need to be read together. |

## Compatibility

| Dependency | Supported range |
| --- | --- |
| React | `>=18` |
| React DOM | `>=18` |
| Shopify Polaris | Optional `>=12` peer; no runtime import |
| Recharts | `>=2` |
| Node.js for local development | `>=20` |

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

## v0.7 foundations

Wrap a view in `ChartLocalizationProvider` to localize component copy and set
display defaults. Explicit chart or series `formatOptions` take precedence.
Standalone formatters stay pure functions; use `formatPercentage` with
`input: 'percent'` only for values already expressed on a 0–100 scale.

```tsx
<ChartLocalizationProvider locale="zh-CN" timeZone="Asia/Shanghai" currency="CNY"
  messages={{ chartEmpty: '暂无数据', retry: '重试' }}>
  <MetricCard title="Revenue" value={formatMoney(12400, { currency: 'CNY', locale: 'zh-CN' })} trend={{ direction: 'up', value: '+8.2%' }} />
  <TrendChart {...props} />
</ChartLocalizationProvider>
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
For detailed component props and AI-readable API guidance, see
[docs/api.md](docs/api.md).
For Chinese documentation, see [README.zh-CN.md](README.zh-CN.md) and
[docs/usage.zh-CN.md](docs/usage.zh-CN.md).

## Package Quality

The package publishes TypeScript declarations, tree-shakeable ESM output, and a
small npm tarball containing only runtime build output, README files, API docs,
usage docs, changelog, license, and npm metadata.

The CI workflow runs linting, type checking, tests, package build, Storybook
build, and `npm pack --dry-run` on pull requests and pushes to `main`.

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
