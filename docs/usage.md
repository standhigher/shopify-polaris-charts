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

## ComparisonChart

Use `ComparisonChart` for same-metric period comparisons. Put both periods on
the same pre-aligned datum; the application owns fetching, aggregation, time
shifting, alignment, and the policy for missing comparison values.

```tsx
<ComparisonChart
  data={revenueByDay}
  currentSeries={{ dataKey: 'currentRevenue', label: 'Current period' }}
  comparisonSeries={{ dataKey: 'previousRevenue', label: 'Previous period' }}
  format="currency"
  xKey="date"
/>
```

The comparison series is dashed and softened by default. Override its
`strokeDasharray`, `opacity`, `color`, or `strokeWidth` through
`AnalyticsSeries`. All shared chart-area states are supported, including
`state="loading"`, automatic empty detection, `state="error"`, `retryAction`,
`skeleton`, and `reveal`.

## ConversionChart

Use `ConversionChart` for store, checkout, upsell, or channel conversion trends.
Ratio input is the default: `0.042` displays as `4.2%`. Set `input="percent"`
only when the source is already on a 0–100 scale, where `4.2` means `4.2%`.

```tsx
<ConversionChart
  data={conversionByDay}
  input="ratio"
  series={[{ dataKey: 'storeConversion', label: 'Store conversion' }]}
  target={{ label: 'Goal', value: 0.05 }}
  xKey="date"
/>
```

The optional target uses the same input basis. Multiple series are supported,
and percent normalization does not mutate caller data. The component inherits
the complete shared state and presentation contract from `TrendChart`.

Neither Analytics component calculates conversion, requests Shopify data,
stores metrics, aligns periods, or supplies a dashboard data layer.

## DonutChart

Use `DonutChart` for a small number of parts-of-a-whole categories, such as traffic source mix, order status share, or revenue by plan. Keep categories limited so the legend stays scannable in a dashboard card.

## StackedBarChart

Use `StackedBarChart` when comparing category totals and their composition at the same time, such as fulfilled, pending, and returned orders by sales channel. It works best when every category shares the same series definitions.

## ComboChart

Use `ComboChart` when two related measures need to be read together, such as order volume and conversion rate. Use bars for volume and a line for the rate or benchmark so the relationship is visible without implying both measures use the same scale.

## Shared chart states

`TrendChart`, `ComboChart`, `StackedBarChart`, and `DonutChart` expose the same
chart-area state contract: `state`, `emptyMessage`, `errorMessage`,
`loadingLabel`, `onRetry`, `retryLabel`, `retryAction`, `skeleton`, and `reveal`. An explicit
`loading`, `empty`, or `error` state wins. With `state="ready"` (the default),
no renderable values automatically resolve to an empty state.

```tsx
<DonutChart
  categoryKey="source"
  data={trafficSources}
  errorMessage="Traffic sources could not be loaded."
  onRetry={reloadTrafficSources}
  retryLabel="Try again"
  state="error"
  valueKey="visits"
/>
```

Pass `retryAction` to replace the complete retry control with a consumer-owned
node. A non-null custom action takes precedence over `onRetry` and `retryLabel`;
otherwise `onRetry` renders the library's black fallback button.

```tsx
<TrendChart
  {...props}
  retryAction={<a href="/support">Contact support</a>}
  state="error"
/>
```

Use `skeleton={{ lineCount: 4, label: 'Loading orders' }}` to adjust loading
copy and density. Use `reveal={{ active: isRefreshing, label: 'Preparing chart' }}`
when ready content should remain mounted behind a short overlay. The state UI
has accessible status/alert roles and honors reduced-motion preferences.

## MetricCard

Use `MetricCard` for concise, already-formatted KPIs. It deliberately does not
calculate revenue, conversion, comparisons, or trends; provide display values
from your application.

```tsx
import { MetricCard, formatMoney, formatPercentage } from '@standhigher/charts';

<MetricCard
  comparison="vs. previous 30 days"
  title="Revenue"
  trend={{ direction: 'up', value: '+8.2%' }}
  value={formatMoney(12400, { currency: 'USD', locale: 'en-US' })}
/>

<MetricCard
  state="loading"
  title="Conversion rate"
  value={formatPercentage(0)}
/>
```

Set `trend.direction` to `up`, `down`, or `neutral`; it is announced to
assistive technology. Set `trend.tone` separately when business meaning differs
from direction, for example a cost decrease with `direction: 'down'` and
`tone: 'positive'`.

## Localized copy and formatting

`ChartLocalizationProvider` supplies component copy plus default `locale`,
`currency`, and `timeZone` for charts. It is not a data or business-logic
provider. Explicit chart or `ComboChart` series `formatOptions` override the
provider; provider values override the built-in `en-US` and `USD` defaults.

```tsx
<ChartLocalizationProvider
  currency="CNY"
  locale="zh-CN"
  messages={{ chartEmpty: '暂无数据', chartError: '图表加载失败', retry: '重试' }}
  timeZone="Asia/Shanghai"
>
  <TrendChart format="currency" {...revenueChartProps} />
</ChartLocalizationProvider>
```

Standalone formatters are pure functions and do not read the provider. For new
display code, prefer `formatMoney`, `formatPercentage`, `formatNumber`,
`formatCompactNumber`, and `formatDate`. `formatPercentage` assumes ratio input
by default (`0.082` becomes `8.2%`); specify `input: 'percent'` only for a
source already expressed as `8.2`.

The older `formatChart*` helpers and `chartFormatters` remain compatible but
are deprecated through v1.0. Use them only where the legacy `ChartFormat`
dispatcher is specifically useful.

## Dashboard phased reveal

Use `ChartSkeletonLayout` and `ChartRevealRegion` when a dashboard has several
chart regions that depend on independent API requests.

```tsx
<ChartSkeletonLayout ariaLabel="Revenue dashboard loading" columns={2} gap={20}>
  <ChartRevealRegion label="Revenue chart" mode="overlay" ready={revenueReady}>
    <TrendChart {...revenueChartProps} />
  </ChartRevealRegion>
  <ChartRevealRegion label="Orders chart" ready={ordersReady}>
    <TrendChart {...ordersChartProps} />
  </ChartRevealRegion>
</ChartSkeletonLayout>
```

Choose `mode="overlay"` for chart regions that should stay mounted behind a
skeleton overlay during reveal transitions. Keep the default `mode="replace"`
for regions that should not mount until their API data is ready.

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

The `Components/ChartStateRegion` and `Components/MetricCard` stories
demonstrate the new state and accessibility behavior.

For detailed props, defaults, and AI-readable implementation guidance, see
[api.md](api.md).
