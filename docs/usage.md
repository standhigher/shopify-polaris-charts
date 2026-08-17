# Chart Usage Guide

Language: English | [中文](usage.zh-CN.md)

`@standhigher/charts` provides a phase one set of Polaris-style chart primitives for Shopify App dashboards. Use the Storybook overview to compare the components together with realistic dashboard density and static sample data.

## ChartCard

Use `ChartCard` as the standard dashboard card shell around a chart or compact analytical view. It is best for consistent titles, subtitles, headline metrics, trend labels, filters, actions, and loading, empty, stale, permission, and error states.

## TrendChart

Use `TrendChart` when the user needs to see change over time, such as gross sales, net sales, sessions, orders, or customer count by day. Use the line mode for direct comparisons and the area mode when overall movement should carry more visual weight.

For current-vs-previous revenue comparisons, set line styling on the individual
series so the current period stays solid and the previous period is dashed:

```tsx
<TrendChart
  data={data}
  format="currency"
  series={[
    { id: 'current', label: 'Current period', data, color: '#008060' },
    { id: 'previous', label: 'Previous period', data, color: '#6d7175', strokeDasharray: '4 4', opacity: 0.72 }
  ]}
  xKey="date"
/>
```

When the chart is embedded in an existing business card, use `TrendChart`'s
chart-area states instead of replacing the whole card with `ChartCard` state UI:

```tsx
<TrendChart
  data={data}
  errorMessage="Revenue API unavailable"
  onRetry={reloadRevenue}
  retryLabel="Try again"
  state="error"
  xKey="date"
  series={[{ id: 'current', label: 'Current period', data }]}
/>
```

Use `state="loading"` for a line-chart skeleton, and `reveal` when the real
chart should stay mounted behind a temporary overlay to avoid a static flash.

## DonutChart

Use `DonutChart` for a small number of parts-of-a-whole categories, such as traffic source mix, order status share, or revenue by plan. Keep categories limited so the legend stays scannable in a dashboard card.

## StackedBarChart

Use `StackedBarChart` when comparing category totals and their composition at the same time, such as fulfilled, pending, and returned orders by sales channel. It works best when every category shares the same series definitions.

## ComboChart

Use `ComboChart` when two related measures need to be read together, such as order volume and conversion rate. Use bars for volume and a line for the rate or benchmark so the relationship is visible without implying both measures use the same scale.

## Dashboard phased reveal

Use `ChartSkeletonLayout` and `ChartRevealRegion` when a dashboard has several
chart regions that depend on independent API requests.

```tsx
<ChartSkeletonLayout ariaLabel="Revenue dashboard loading">
  <ChartRevealRegion label="Revenue chart" ready={revenueReady}>
    <TrendChart {...revenueChartProps} />
  </ChartRevealRegion>
  <ChartRevealRegion label="Orders chart" ready={ordersReady}>
    <TrendChart {...ordersChartProps} />
  </ChartRevealRegion>
</ChartSkeletonLayout>
```

## Controlled Recharts props

`TrendChart`, `StackedBarChart`, and `ComboChart` accept a focused
`rechartsProps` escape hatch for visual options that the regular component props
do not yet cover. It is intended for small, version-tolerant presentation
adjustments, not for replacing the component's data model or tooltip content.

```tsx
<TrendChart
  data={data}
  rechartsProps={{
    chart: { margin: { left: -8 } },
    xAxis: { minTickGap: 0 },
    yAxis: { width: 56 },
    tooltip: { cursor: { strokeDasharray: '3 3' } },
    cartesianGrid: { vertical: false },
    line: { activeDot: { r: 3 } },
    area: { fillOpacity: 0.18 }
  }}
  series={[{ id: 'grossSales', label: 'Gross sales', data }]}
  xKey="date"
/>
```

`rechartsProps.chart.margin` overrides the top-level `margin`. The library
continues to own chart `data`, axis `dataKey`/formatters, tooltip content and
formatters, and series `dataKey`, `name`, colors, type, stack, and axis IDs.
For `ComboChart`, use `bar` and `line` to style their respective series.

## Local Preview

Run Storybook to inspect the examples:

```bash
npm run storybook
```

Then open the `Examples/Phase One Overview` story.

For detailed props, defaults, and AI-readable implementation guidance, see
[api.md](api.md).
