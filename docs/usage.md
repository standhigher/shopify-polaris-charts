# Chart Usage Guide

Language: English | [中文](usage.zh-CN.md)

`@standhigher/charts` provides a phase one set of Polaris-style chart primitives for Shopify App dashboards. Use the Storybook overview to compare the components together with realistic dashboard density and static sample data.

## ChartCard

Use `ChartCard` as the standard dashboard card shell around a chart or compact analytical view. It is best for consistent titles, subtitles, headline metrics, trend labels, filters, actions, and loading, empty, stale, permission, and error states.

## TrendChart

Use `TrendChart` when the user needs to see change over time, such as gross sales, net sales, sessions, orders, or customer count by day. Use the line mode for direct comparisons and the area mode when overall movement should carry more visual weight.

## DonutChart

Use `DonutChart` for a small number of parts-of-a-whole categories, such as traffic source mix, order status share, or revenue by plan. Keep categories limited so the legend stays scannable in a dashboard card.

## StackedBarChart

Use `StackedBarChart` when comparing category totals and their composition at the same time, such as fulfilled, pending, and returned orders by sales channel. It works best when every category shares the same series definitions.

## ComboChart

Use `ComboChart` when two related measures need to be read together, such as order volume and conversion rate. Use bars for volume and a line for the rate or benchmark so the relationship is visible without implying both measures use the same scale.

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
