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

```bash
npm install
npm run test
npm run test:watch
npm run typecheck
npm run build
npm run pack:dry-run
```

Storybook scripts are available for local previews and static verification:

```bash
npm run storybook
npm run build-storybook
```
