# API Reference

Language: English | [中文](api.zh-CN.md)

This document is optimized for AI agents and code generators. It describes the
public API of `@standhigher/charts` with stable prop tables, defaults, type
contracts, and implementation notes.

## Package Summary

```ts
import {
  ChartCard,
  ChartRevealRegion,
  ChartSkeletonLayout,
  ComboChart,
  DonutChart,
  StackedBarChart,
  TrendChart,
  chartFormatters,
  chartTheme,
  formatChartCurrency,
  formatChartDate,
  formatChartNumber,
  formatChartPercent,
  formatChartValue,
  packageName,
  packageVersion,
  type CartesianAxisOptions,
  type ChartActiveDotOptions,
  type ChartDatum,
  type ChartDotOptions,
  type ChartFormat,
  type ChartGridOptions,
  type ChartInlineState,
  type ChartLineOptions,
  type ChartMargin,
  type ChartTheme,
  type ChartTooltipContentProps,
  type ChartTooltipContentRenderer,
  type ChartTooltipCursorOptions,
  type ChartTooltipOptions,
  type ChartTooltipPayloadItem,
  type ChartValueFormatOptions,
  type ChartSeries,
  type ChartState,
  type TrendChartRevealOptions,
  type TrendChartSkeletonOptions
} from '@standhigher/charts';
```

Runtime peer dependencies:

| Package | Required range | Purpose |
|---|---:|---|
| `react` | `>=18` | React rendering runtime |
| `react-dom` | `>=18` | React DOM runtime |
| `@shopify/polaris` | `>=12` | Consumer app design-system peer |
| `recharts` | `>=2` | Chart rendering engine |

### Public Entry Exports

| Export | Kind | Description |
|---|---|---|
| `ChartCard` | component | Polaris-style dashboard card shell with built-in chart states. |
| `ChartSkeletonLayout` | component | Dashboard-level skeleton container for independently revealed chart regions. |
| `ChartRevealRegion` | component | Region wrapper that swaps a chart-area skeleton for ready children. |
| `TrendChart` | component | Line or area chart for trends. |
| `DonutChart` | component | Donut chart for parts-of-a-whole data. |
| `StackedBarChart` | component | Stacked bar chart for category composition. |
| `ComboChart` | component | Combined bar and line chart. |
| `formatChartNumber` | function | Formats nullable numbers. |
| `formatChartCurrency` | function | Formats nullable numbers as currency. |
| `formatChartPercent` | function | Formats nullable numbers as percentages. |
| `formatChartDate` | function | Formats nullable date-like values. |
| `formatChartValue` | function | Dispatches to a formatter based on `ChartFormat`. |
| `chartFormatters` | object | Named formatter helper map. |
| `chartTheme` | object | Default visual theme. |
| `packageName` | constant | Package name string exported from the entry point. |
| `packageVersion` | constant | Package version string exported from the entry point. |
| `ChartCardProps` | type | Props for `ChartCard`. |
| `TrendChartProps` | type | Props for `TrendChart`. |
| `DonutChartProps` | type | Props for `DonutChart`. |
| `StackedBarChartProps` | type | Props for `StackedBarChart`. |
| `ComboChartProps` | type | Props for `ComboChart`. |
| `TrendChartRechartsProps` | type | Controlled Recharts props for `TrendChart`. |
| `StackedBarChartRechartsProps` | type | Controlled Recharts props for `StackedBarChart`. |
| `ComboChartRechartsProps` | type | Controlled Recharts props for `ComboChart`. |
| `ComboChartSeries` | type | Series item for `ComboChart`. |
| `ComboChartSeriesType` | type | `'bar' | 'line'`. |
| `ChartValue` | type | Shared nullable display value. |
| `ChartDatum` | type | Default loose datum shape. |
| `ChartSeries` | type | Shared series shape. |
| `ChartFormat` | type | Value format union. |
| `ChartState` | type | `ChartCard` state union. |
| `ChartInlineState` | type | Chart-area-only state union used by `TrendChart`. |
| `TrendChartSkeletonOptions` | type | Options for the `TrendChart` chart-area skeleton. |
| `TrendChartRevealOptions` | type | Options for the `TrendChart` reveal overlay. |
| `ChartMargin` | type | Cartesian chart margin options. |
| `CartesianAxisOptions` | type | Cartesian X/Y axis presentation options. |
| `ChartGridOptions` | type | Cartesian grid presentation options. |
| `ChartTooltipOptions` | type | Tooltip presentation options. |
| `ChartTooltipContentProps` | type | Context provided to Cartesian custom tooltip content. |
| `ChartTooltipContentRenderer` | type | Custom Cartesian tooltip component or render function. |
| `ChartTooltipPayloadItem` | type | Tooltip payload item enriched with its chart series. |
| `ChartTooltipCursorOptions` | type | Tooltip cursor stroke options. |
| `ChartLineOptions` | type | Line and area dot presentation options. |
| `ChartDotOptions` | type | Non-active line or area dot options. |
| `ChartActiveDotOptions` | type | Active hover dot options. |
| `ChartValueFormatOptions` | type | Shared formatter options. |
| `ChartTheme` | type | Shape of `chartTheme`. |

## Shared Types

### `ChartValue`

```ts
type ChartValue = string | number | Date | null | undefined;
```

Use `ChartValue` for values that can be displayed by the built-in formatters.

### `ChartDatum`

```ts
interface ChartDatum {
  label?: string;
  value?: ChartValue;
  date?: string | number | Date;
}
```

This is the default loose datum shape. Components are generic and accept richer
object shapes through `TDatum extends object`.

### `ChartSeries<TDatum>`

```ts
interface ChartSeries<TDatum extends object = ChartDatum> {
  id: string;
  label: string;
  data: TDatum[];
  color?: string;
  opacity?: number;
  strokeDasharray?: string | number;
  strokeWidth?: number;
}
```

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | `string` | Yes | Data key for the series. Must match a field in each datum for Cartesian charts. |
| `label` | `string` | Yes | Human-readable legend and tooltip label. |
| `data` | `TDatum[]` | Yes | Series-owned data. Current chart components read from the chart-level `data` prop; keep this aligned for API consistency. |
| `color` | `string` | No | CSS color for the whole series. Defaults to `chartTheme.palette[index]`. |
| `opacity` | `number` | No | Series-level opacity for Cartesian line and area renderers. |
| `strokeDasharray` | `string \| number` | No | Series-level dashed stroke pattern, useful for current vs previous comparisons. |
| `strokeWidth` | `number` | No | Series-level stroke width. Overrides the global `rechartsProps.line.strokeWidth` or `rechartsProps.area.strokeWidth`. |

Important: `color` is currently series-level. Per-bar or per-point colors are
not part of the public API yet.

### `ChartFormat`

```ts
type ChartFormat = 'number' | 'currency' | 'percent' | 'compact' | 'date';
```

### `ChartState`

```ts
type ChartState =
  | 'loading'
  | 'empty'
  | 'error'
  | 'no-permission'
  | 'stale'
  | 'ready';

type ChartInlineState = 'loading' | 'empty' | 'error' | 'ready';

interface TrendChartSkeletonOptions {
  label?: ReactNode;
  lineCount?: number;
}

interface TrendChartRevealOptions {
  active?: boolean;
  delayMs?: number;
  durationMs?: number;
  label?: ReactNode;
}
```

### Chart presentation options

```ts
interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface CartesianAxisOptions {
  domain?: [number | 'auto', number | 'auto'];
  ticks?: Array<number | string>;
  tickColor?: string;
  tickFontSize?: number;
  axisLine?: boolean;
  tickLine?: boolean;
  minTickGap?: number;
  interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
  width?: number;
}

interface ChartGridOptions {
  horizontal?: boolean;
  vertical?: boolean;
  stroke?: string;
  strokeDasharray?: string;
}

interface ChartTooltipCursorOptions {
  stroke?: string;
  strokeDasharray?: string;
  strokeWidth?: number;
  fill?: string;
}

interface ChartTooltipPayloadItem<TDatum, TSeries> {
  color?: string;
  data?: TDatum;
  dataKey?: string;
  name?: string;
  series?: TSeries;
  value?: ChartValue;
}

interface ChartTooltipContentProps<TDatum, TSeries> {
  active?: boolean;
  label?: ChartValue;
  payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>;
  series: Array<TSeries>;
  format: ChartFormat;
  formatOptions: ChartValueFormatOptions;
  xFormat?: ChartFormat;
  xFormatOptions: ChartValueFormatOptions;
  formatLabel: (label: ChartValue, payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>) => ReactNode;
  formatValue: (value: ChartValue, series?: TSeries) => ReactNode;
}

type ChartTooltipContentRenderer<TDatum, TSeries> =
  (props: ChartTooltipContentProps<TDatum, TSeries>) => ReactNode;

interface ChartTooltipOptions<TDatum, TSeries> {
  cursor?: false | ChartTooltipCursorOptions;
  content?: ChartTooltipContentRenderer<TDatum, TSeries>;
  labelFormatter?: (label: ChartValue, payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>) => ReactNode;
  valueFormatter?: (value: ChartValue, series?: TSeries) => ReactNode;
  minWidth?: number;
  className?: string;
}

interface ChartDotOptions {
  className?: string;
  cx?: number;
  cy?: number;
  r?: number | string;
  clipDot?: boolean;
}

interface ChartActiveDotOptions extends ChartDotOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

interface ChartLineOptions {
  dot?: boolean | ChartDotOptions;
  activeDot?: boolean | ChartActiveDotOptions;
}
```

`content` receives active state, label, payload items enriched with the matching
series, all series, and chart format configuration. It may be a React component
or render function. `formatLabel` and `formatValue` let custom content reuse
the built-in fallback formatting. `ComboChart` payload series retain their own
`format` and `formatOptions`.

Without `content`, the built-in Polaris-style tooltip remains in use.
`labelFormatter` changes its label, `valueFormatter` changes each value, and
`minWidth` and `className` apply to its inner container. These options map to
stable Recharts concepts, but intentionally do not expose a full Recharts
escape hatch.

### Controlled Recharts props

`TrendChart`, `StackedBarChart`, and `ComboChart` expose a controlled
`rechartsProps` escape hatch for visual Recharts props not represented by the
standard chart props. The value is based on the corresponding Recharts component
props, with internal bindings omitted.

```ts
interface TrendChartRechartsProps {
  chart?: Omit<ComponentProps<typeof LineChart>, 'children' | 'data' | 'dataKey' | 'layout'>;
  xAxis?: Omit<ComponentProps<typeof XAxis>, 'children' | 'dataKey' | 'tickFormatter' | 'type' | 'xAxisId' | 'yAxisId'>;
  yAxis?: Omit<ComponentProps<typeof YAxis>, 'children' | 'dataKey' | 'tickFormatter' | 'type' | 'xAxisId' | 'yAxisId'>;
  tooltip?: Omit<ComponentProps<typeof Tooltip>, 'axisId' | 'content' | 'formatter' | 'labelFormatter'>;
  cartesianGrid?: Omit<ComponentProps<typeof CartesianGrid>, 'children' | 'xAxisId' | 'yAxisId'>;
  line?: Omit<ComponentProps<typeof Line>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stroke' | 'type' | 'xAxisId' | 'yAxisId'>;
  area?: Omit<ComponentProps<typeof Area>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stackId' | 'stroke' | 'type' | 'xAxisId' | 'yAxisId'>;
}

interface StackedBarChartRechartsProps extends Omit<TrendChartRechartsProps, 'area' | 'line'> {
  bar?: Omit<ComponentProps<typeof Bar>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stroke' | 'stackId' | 'xAxisId' | 'yAxisId'>;
}

interface ComboChartRechartsProps extends Omit<TrendChartRechartsProps, 'area'> {
  bar?: Omit<ComponentProps<typeof Bar>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stroke' | 'stackId' | 'xAxisId' | 'yAxisId'>;
}
```

`chart.margin` takes precedence over the chart component's top-level `margin`.
User-provided safe visual props take precedence over library defaults. The
library always controls the chart `data`, axis bindings, axis type, and
formatters; tooltip axis/content/formatters; and series `dataKey`, `name`,
`fill`, `stroke`, `type`, `stackId`, and `yAxisId`. Runtime sanitization removes these protected keys even
when callers bypass TypeScript. Tooltip custom content is intentionally not
supported through this API.

Use `tooltip.content` for custom tooltip content. Custom content is deliberately
not accepted through `rechartsProps.tooltip`, which preserves the chart's
tooltip data and formatting integration.

## Formatting

### Formatter option types

```ts
interface ChartNumberFormatOptions {
  locale?: string;
  notation?: 'standard' | 'compact';
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

interface ChartCurrencyFormatOptions {
  locale?: string;
  currency?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

interface ChartPercentFormatOptions {
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

interface ChartDateFormatOptions {
  locale?: string;
  timeZone?: string;
}

interface ChartValueFormatOptions
  extends ChartNumberFormatOptions,
    ChartCurrencyFormatOptions,
    ChartPercentFormatOptions,
    ChartDateFormatOptions {}
```

All formatter helpers return an empty string for `null` and `undefined`.
Numeric formatters also return an empty string when a string value cannot be
converted to a number through `Number(value)`.

### `formatChartNumber(value, options)`

Formats a nullable number with `Intl.NumberFormat`. Defaults to locale `en-US`,
up to 2 fraction digits, and standard notation unless `notation` is set.

```ts
formatChartNumber(9876.543); // "9,876.54"
formatChartNumber(9876543, { notation: 'compact' }); // "9.9M"
```

### `formatChartCurrency(value, options)`

Formats a nullable number as currency. Defaults to locale `en-US` and currency
`USD`.

```ts
formatChartCurrency(12400); // "$12,400.00"
formatChartCurrency(12400, { currency: 'CNY', locale: 'zh-CN' }); // "¥12,400.00"
```

### `formatChartPercent(value, options)`

Formats a nullable number as a percentage. Pass ratios as decimals: `0.082`
renders as `8.2%`.

```ts
formatChartPercent(0.082); // "8.2%"
```

### `formatChartDate(value, options)`

Formats a nullable `string | number | Date` through `Intl.DateTimeFormat`.
Default output uses `year`, short `month`, and numeric `day`.

```ts
formatChartDate('2026-07-20'); // "Jul 20, 2026"
```

### `formatChartValue(value, format, options)`

Formats a `ChartValue` for legends, axis ticks, metrics, and tooltips.

```ts
formatChartValue(12400, 'currency'); // "$12,400.00"
formatChartValue(0.082, 'percent'); // "8.2%"
formatChartValue(12400, 'compact'); // "12K"
```

Supported options are passed to `Intl.NumberFormat` or `Intl.DateTimeFormat`.
Use `formatOptions` on chart components to control value formatting and
`xFormatOptions` to control category or date formatting.

### `chartFormatters`

```ts
const chartFormatters = {
  currency: formatChartCurrency,
  date: formatChartDate,
  number: formatChartNumber,
  percent: formatChartPercent,
  value: formatChartValue
};
```

## ChartCard

Use `ChartCard` as the Polaris-style dashboard card shell around a chart or
compact analytical view.

```tsx
<ChartCard
  actions={<button>Export</button>}
  filters={<button>Last 30 days</button>}
  metric="$12,400"
  state="ready"
  subtitle="Last 30 days"
  title="Sales over time"
  trendLabel="+8.2%"
>
  <TrendChart data={data} series={series} xKey="date" />
</ChartCard>
```

### Props

| Prop | Type | Required | Default | Description |
|---|---|---:|---|---|
| `title` | `ReactNode` | Yes | - | Card heading. Used as the accessible region label. |
| `subtitle` | `ReactNode` | No | - | Secondary text below the title. |
| `metric` | `ReactNode` | No | - | Large headline metric. |
| `trendLabel` | `ReactNode` | No | - | Inline trend text beside `metric`. Styled as positive green by default. |
| `actions` | `ReactNode` | No | - | Right-aligned command controls. |
| `filters` | `ReactNode` | No | - | Right-aligned filter controls before `actions`. |
| `state` | `ChartState` | Yes | - | Controls whether children render or a status panel renders. |
| `errorMessage` | `ReactNode` | No | - | Extra message shown only when `state="error"`. |
| `children` | `ReactNode` | No | - | Chart or analytical content shown only when `state="ready"`. |

### State behavior

| State | Rendered behavior |
|---|---|
| `ready` | Renders `children`. |
| `loading` | Renders a polite status panel with "Loading chart". |
| `empty` | Renders a polite status panel with "No data available". |
| `error` | Renders an assertive alert panel with "Unable to load chart" and optional `errorMessage`. |
| `no-permission` | Renders a polite status panel with "No permission to view this chart". |
| `stale` | Renders a polite status panel with "Data may be out of date". |

## TrendChart

Use `TrendChart` for time-series or ordered category trends. It supports line
and area modes.

```tsx
const data = [
  { date: '2026-07-20', grossSales: 18342.8 },
  { date: '2026-07-21', grossSales: 19218.1 }
];

<TrendChart
  data={data}
  format="currency"
  mode="area"
  series={[{ id: 'grossSales', label: 'Gross sales', data, color: '#008060' }]}
  xFormat="date"
  xKey="date"
/>;
```

### Props

| Prop | Type | Required | Default | Description |
|---|---|---:|---|---|
| `title` | `ReactNode` | No | - | Optional chart heading rendered above the chart. |
| `data` | `TDatum[]` | Yes | - | Chart-level data source. |
| `xKey` | `keyof TDatum & string` | Yes | - | Datum field used for the X axis. |
| `series` | `Array<ChartSeries<TDatum>>` | Yes | - | Line or area series definitions. |
| `showLegend` | `boolean` | No | `true` | Controls whether the built-in legend below the chart is rendered. |
| `margin` | `ChartMargin` | No | - | Recharts chart margin for Cartesian charts. |
| `xAxis` | `CartesianAxisOptions` | No | - | X-axis presentation options such as tick style, axis line, tick line, interval, and min tick gap. |
| `yAxis` | `CartesianAxisOptions` | No | - | Y-axis presentation options such as domain, ticks, width, tick style, axis line, and tick line. |
| `grid` | `ChartGridOptions` | No | - | Cartesian grid visibility and stroke options. |
| `tooltip` | `ChartTooltipOptions<TDatum>` | No | - | Tooltip cursor, default-content formatting and styling, or custom content. |
| `line` | `ChartLineOptions` | No | - | Line and area dot options. |
| `rechartsProps` | `TrendChartRechartsProps` | No | - | Controlled Recharts visual props for chart, axes, tooltip, grid, line, and area. `chart.margin` overrides `margin`. |
| `mode` | `'line' \| 'area'` | No | `'line'` | Chart renderer mode. |
| `height` | `number` | No | `280` | Chart viewport height in pixels. |
| `format` | `ChartFormat` | No | `'number'` | Y-axis, tooltip, and legend value format. |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | Formatter options for Y values. |
| `xFormat` | `ChartFormat` | No | - | Optional X-axis and tooltip label format. |
| `xFormatOptions` | `ChartValueFormatOptions` | No | `{}` | Formatter options for X values. |
| `emptyMessage` | `ReactNode` | No | `'No data available'` | Empty-state content when no series values are renderable. |
| `state` | `ChartInlineState` | No | `'ready'` | Chart-area-only state. Use this when `TrendChart` is embedded in an existing business card. |
| `errorMessage` | `ReactNode` | No | - | Optional body content for the inline chart error panel. |
| `onRetry` | `() => void` | No | - | Renders a retry button in the inline error panel. |
| `retryLabel` | `ReactNode` | No | `'Retry'` | Retry button label. |
| `loadingLabel` | `ReactNode` | No | `'Loading chart'` | Accessible label shown in the chart skeleton. |
| `skeleton` | `boolean \| TrendChartSkeletonOptions` | No | - | Enables skeleton options such as `lineCount` and custom label. |
| `reveal` | `boolean \| TrendChartRevealOptions` | No | - | Keeps the chart mounted and places a chart-area reveal overlay above it. |

### Notes for AI code generation

- Each `series[].id` must exist as a key on each datum, such as
  `{ date: '2026-07-20', grossSales: 18342.8 }`.
- Use `mode="area"` when overall movement should carry more visual weight.
- Use `series[].color` for series-level color. Individual point colors are not
  supported by this component.
- Use `series[].strokeDasharray`, `series[].strokeWidth`, and `series[].opacity`
  for per-series comparison styling. These values override global line or area
  presentation from `rechartsProps`.
- Use `state="error"` with `onRetry` for chart-area errors inside existing
  business cards. Use `ChartCard state="error"` only when the full card shell
  should be replaced by a card-level state.

### Revenue comparison with a dashed previous period

```tsx
<TrendChart
  data={data}
  format="currency"
  series={[
    { id: 'current', label: 'Current period', data, color: '#008060' },
    {
      id: 'previous',
      label: 'Previous period',
      data,
      color: '#6d7175',
      opacity: 0.72,
      strokeDasharray: '4 4',
      strokeWidth: 2
    }
  ]}
  xKey="date"
/>;
```

### Chart-area error and retry

```tsx
<TrendChart
  data={data}
  errorMessage="Revenue API unavailable"
  onRetry={reloadRevenue}
  retryLabel="Try again"
  state="error"
  xKey="date"
  series={[{ id: 'current', label: 'Current period', data }]}
/>;
```

### Chart-area loading and reveal

```tsx
<TrendChart
  data={data}
  loadingLabel="Loading revenue trend"
  state="loading"
  xKey="date"
  series={[{ id: 'current', label: 'Current period', data }]}
/>;

<TrendChart
  data={data}
  reveal={{ active: isPreparing, label: 'Preparing chart', durationMs: 240 }}
  xKey="date"
  series={[{ id: 'current', label: 'Current period', data }]}
/>;
```

## ChartSkeletonLayout and ChartRevealRegion

Use these primitives for dashboard-level phased reveal when each chart depends
on a different API request.

| Component | Prop | Type | Required | Default | Description |
|---|---|---:|---:|---|---|
| `ChartSkeletonLayout` | `ariaLabel` | `string` | No | `'Charts loading'` | Accessible label for the dashboard loading container. |
| `ChartSkeletonLayout` | `children` | `ReactNode` | Yes | - | Reveal regions or chart cards. |
| `ChartSkeletonLayout` | `columns` | `number \| string` | No | - | Grid column template. A number maps to `repeat(n, minmax(0, 1fr))`; a string is used directly. |
| `ChartSkeletonLayout` | `gap` | `number \| string` | No | `16` | Grid gap. A number is treated as pixels. |
| `ChartSkeletonLayout` | `className` | `string` | No | - | Optional class name for the layout wrapper. |
| `ChartSkeletonLayout` | `style` | `CSSProperties` | No | - | Optional inline style overrides. |
| `ChartRevealRegion` | `label` | `string` | Yes | - | Accessible region label and default skeleton text prefix. |
| `ChartRevealRegion` | `ready` | `boolean` | Yes | - | When true, renders children; otherwise renders a chart-area skeleton. |
| `ChartRevealRegion` | `children` | `ReactNode` | Yes | - | Ready content. |
| `ChartRevealRegion` | `skeleton` | `ReactNode` | No | - | Custom skeleton content for the region. |
| `ChartRevealRegion` | `mode` | `'replace' \| 'overlay'` | No | `'replace'` | `replace` swaps children for skeleton; `overlay` keeps children mounted behind a skeleton overlay. |
| `ChartRevealRegion` | `minHeight` | `number` | No | `220` | Minimum region height in pixels while loading. |
| `ChartRevealRegion` | `className` | `string` | No | - | Optional class name for the region wrapper. |
| `ChartRevealRegion` | `style` | `CSSProperties` | No | - | Optional inline style overrides. |

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

Use `mode="replace"` when the child chart should not mount until its API data
is ready. Use `mode="overlay"` when the chart should stay mounted behind the
skeleton overlay to preserve measurement or chart animation state.

### Analytics-style customization example

```tsx
<TrendChart
  data={data}
  format="currency"
  grid={{ horizontal: true, vertical: false, stroke: '#e5e7eb', strokeDasharray: '3 3' }}
  line={{ dot: false, activeDot: { r: 3, strokeWidth: 0 } }}
  margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
  series={[{ id: 'grossSales', label: 'Gross sales', data }]}
  showLegend={false}
  tooltip={{ cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }}
  xAxis={{ axisLine: false, tickLine: false, minTickGap: 0 }}
  xKey="date"
  yAxis={{ domain: [0, 800], ticks: [0, 200, 400, 600, 800], width: 56 }}
/>;
```

### Tooltip customization example

```tsx
function RevenueTooltip({ active, formatLabel, formatValue, label, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="analytics-tooltip">
      <strong>{formatLabel(label)}</strong>
      {payload.map((item) => (
        <div key={item.series?.id}>
          {item.series?.label}: {formatValue(item.value, item.series)}
        </div>
      ))}
    </div>
  );
}

<TrendChart
  data={data}
  format="currency"
  series={[{ id: 'grossSales', label: 'Gross sales', data }]}
  tooltip={{
    cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' },
    content: RevenueTooltip,
    labelFormatter: (label) => `Date: ${label}`,
    valueFormatter: (value, series) => `${series?.label}: ${value}`,
    minWidth: 180,
    className: 'analytics-tooltip'
  }}
  xKey="date"
/>;
```

## DonutChart

Use `DonutChart` for small parts-of-a-whole breakdowns.

```tsx
const data = [
  { source: 'Direct', value: 42 },
  { source: 'Search', value: 31 }
];

<DonutChart
  categoryKey="source"
  centerLabel="Traffic"
  data={data}
  format="percent"
  valueKey="value"
/>;
```

### Props

| Prop | Type | Required | Default | Description |
|---|---|---:|---|---|
| `title` | `ReactNode` | No | - | Optional chart heading rendered above the chart. |
| `data` | `TDatum[]` | Yes | - | Slice data source. |
| `categoryKey` | `keyof TDatum & string` | Yes | - | Datum field used for slice names and legend labels. |
| `valueKey` | `keyof TDatum & string` | Yes | - | Datum field used for positive numeric slice values. |
| `centerLabel` | `ReactNode` | No | - | Center overlay content inside the donut. |
| `showLegend` | `boolean` | No | `true` | Controls whether the built-in legend below the chart is rendered. |
| `height` | `number` | No | `280` | Chart viewport height in pixels. |
| `format` | `ChartFormat` | No | `'number'` | Tooltip and legend value format. |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | Formatter options for slice values. |
| `emptyMessage` | `ReactNode` | No | `'No data available'` | Empty-state content when no positive values are renderable. |

### Notes for AI code generation

- `valueKey` values must be positive numbers or numeric strings. Zero, negative,
  empty, null, and non-numeric values are filtered out.
- Slice colors are assigned by datum order from `chartTheme.palette`.
- There is no public `colorKey` prop yet.

## StackedBarChart

Use `StackedBarChart` to compare category totals and their composition.

```tsx
const data = [
  { channel: 'Online store', fulfilled: 180, pending: 24, returned: 6 },
  { channel: 'Retail', fulfilled: 90, pending: 12, returned: 3 }
];

<StackedBarChart
  data={data}
  series={[
    { id: 'fulfilled', label: 'Fulfilled', data, color: '#008060' },
    { id: 'pending', label: 'Pending', data, color: '#2C6ECB' },
    { id: 'returned', label: 'Returned', data, color: '#D72C0D' }
  ]}
  xKey="channel"
/>;
```

### Props

| Prop | Type | Required | Default | Description |
|---|---|---:|---|---|
| `title` | `ReactNode` | No | - | Optional chart heading rendered above the chart. |
| `data` | `TDatum[]` | Yes | - | Chart-level data source. |
| `xKey` | `keyof TDatum & string` | Yes | - | Datum field used for the X axis. |
| `series` | `Array<ChartSeries<TDatum>>` | Yes | - | Stacked bar series definitions. |
| `showLegend` | `boolean` | No | `true` | Controls whether the built-in legend below the chart is rendered. |
| `margin` | `ChartMargin` | No | - | Recharts chart margin for Cartesian charts. |
| `xAxis` | `CartesianAxisOptions` | No | - | X-axis presentation options such as tick style, axis line, tick line, interval, and min tick gap. |
| `yAxis` | `CartesianAxisOptions` | No | - | Y-axis presentation options such as domain, ticks, width, tick style, axis line, and tick line. |
| `grid` | `ChartGridOptions` | No | - | Cartesian grid visibility and stroke options. |
| `tooltip` | `ChartTooltipOptions<TDatum>` | No | - | Tooltip cursor, default-content formatting and styling, or custom content. |
| `rechartsProps` | `StackedBarChartRechartsProps` | No | - | Controlled Recharts visual props for chart, axes, tooltip, grid, and bars. `chart.margin` overrides `margin`. |
| `height` | `number` | No | `280` | Chart viewport height in pixels. |
| `format` | `ChartFormat` | No | `'number'` | Y-axis, tooltip, and legend value format. |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | Formatter options for Y values. |
| `xFormat` | `ChartFormat` | No | - | Optional X-axis and tooltip label format. |
| `xFormatOptions` | `ChartValueFormatOptions` | No | `{}` | Formatter options for X values. |
| `emptyMessage` | `ReactNode` | No | `'No data available'` | Empty-state content when no series values are renderable. |

### Notes for AI code generation

- Each `series[].id` must map to a numeric field on the datum.
- All bars use `stackId="stack"` internally.
- `series[].color` changes one stack segment color across all categories.
- Per-category segment colors are not supported by the current public API.

## ComboChart

Use `ComboChart` when related bar and line measures should be read together.

```tsx
const data = [
  { date: '2026-07-20', orders: 210, conversionRate: 0.031 },
  { date: '2026-07-21', orders: 238, conversionRate: 0.034 }
];

<ComboChart
  data={data}
  format="number"
  series={[
    { id: 'orders', label: 'Orders', type: 'bar', data, color: '#008060' },
    {
      id: 'conversionRate',
      label: 'Conversion rate',
      type: 'line',
      data,
      color: '#2C6ECB',
      format: 'percent'
    }
  ]}
  xFormat="date"
  xKey="date"
/>;
```

### `ComboChartSeries<TDatum>`

```ts
type ComboChartSeriesType = 'bar' | 'line';

interface ComboChartSeries<TDatum extends object = ChartDatum>
  extends ChartSeries<TDatum> {
  type: ComboChartSeriesType;
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
}
```

| Field | Type | Required | Description |
|---|---|---:|---|
| `type` | `'bar' \| 'line'` | Yes | Selects bar or line rendering for this series. |
| `format` | `ChartFormat` | No | Optional series-specific value format. |
| `formatOptions` | `ChartValueFormatOptions` | No | Optional series-specific formatter options. |

### Props

| Prop | Type | Required | Default | Description |
|---|---|---:|---|---|
| `title` | `ReactNode` | No | - | Optional chart heading rendered above the chart. |
| `data` | `TDatum[]` | Yes | - | Chart-level data source. |
| `xKey` | `keyof TDatum & string` | Yes | - | Datum field used for the X axis. |
| `series` | `Array<ComboChartSeries<TDatum>>` | Yes | - | Bar and line series definitions. |
| `showLegend` | `boolean` | No | `true` | Controls whether the built-in legend below the chart is rendered. |
| `margin` | `ChartMargin` | No | - | Recharts chart margin for Cartesian charts. |
| `xAxis` | `CartesianAxisOptions` | No | - | X-axis presentation options such as tick style, axis line, tick line, interval, and min tick gap. |
| `yAxis` | `CartesianAxisOptions` | No | - | Y-axis presentation options such as domain, ticks, width, tick style, axis line, and tick line. |
| `grid` | `ChartGridOptions` | No | - | Cartesian grid visibility and stroke options. |
| `tooltip` | `ChartTooltipOptions<TDatum, ComboChartSeries<TDatum>>` | No | - | Tooltip cursor, default-content formatting and styling, or custom content with per-series formats. |
| `line` | `ChartLineOptions` | No | - | Dot options for `line` series only. |
| `rechartsProps` | `ComboChartRechartsProps` | No | - | Controlled Recharts visual props for chart, axes, tooltip, grid, bars, and lines. `chart.margin` overrides `margin`. |
| `height` | `number` | No | `280` | Chart viewport height in pixels. |
| `format` | `ChartFormat` | No | `'number'` | Base Y-axis, tooltip, and legend value format. |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | Formatter options for base Y values. |
| `xFormat` | `ChartFormat` | No | - | Optional X-axis and tooltip label format. |
| `xFormatOptions` | `ChartValueFormatOptions` | No | `{}` | Formatter options for X values. |
| `emptyMessage` | `ReactNode` | No | `'No data available'` | Empty-state content when no series values are renderable. |

### Axis behavior

`ComboChart` supports the base `format` plus one alternate series format. When a
series has a `format` different from the base format, it is rendered against the
right Y axis. More than one alternate format throws an error.

Allowed:

```tsx
format="number"
series={[
  { id: 'orders', label: 'Orders', type: 'bar', data },
  { id: 'conversionRate', label: 'Conversion rate', type: 'line', data, format: 'percent' }
]}
```

Not allowed:

```tsx
format="number"
series={[
  { id: 'orders', label: 'Orders', type: 'bar', data },
  { id: 'conversionRate', label: 'Conversion rate', type: 'line', data, format: 'percent' },
  { id: 'revenue', label: 'Revenue', type: 'line', data, format: 'currency' }
]}
```

### Notes for AI code generation

- Use bars for volume metrics and lines for rates, benchmarks, or targets.
- Use `series[].format` when one metric needs a separate scale, such as percent.
- `series[].color` changes the whole bar or line series.
- Per-bar colors are not supported by the current public API. If a design needs
  individual bar colors, extend the component with a future `colorKey` or
  `colorAccessor` API.

## Theme

### `chartTheme`

`chartTheme` is exported for consumers that need visual alignment with the
component palette.

Important fields:

| Field | Description |
|---|---|
| `palette` | Ordered chart colors used when a series or slice does not provide a color. |
| `surface` | Card, border, and subtle background colors. |
| `text` | Primary and secondary text colors. |
| `axis` | Axis stroke, tick color, and tick font size. |
| `grid` | Cartesian grid stroke and dash pattern. |
| `legend` | Legend marker size, text color, and font size. |
| `tooltip` | Tooltip background, border, radius, shadow, and text color. |

## Component Selection Guide for AI Agents

| User intent | Prefer | Required data shape |
|---|---|---|
| Dashboard card shell with title, metric, controls, and state handling | `ChartCard` | Any React children |
| Time-series trend or ordered category movement | `TrendChart` | One X field plus one or more numeric series fields |
| Parts-of-a-whole breakdown | `DonutChart` | One category field plus one positive numeric value field |
| Compare category totals and composition | `StackedBarChart` | One category field plus multiple numeric segment fields |
| Compare volume and rate together | `ComboChart` | One X field plus bar/line series fields |

## Common Generation Rules

1. Always pass the same `data` array to the chart-level `data` prop and each
   `series[].data` field.
2. Ensure `xKey`, `categoryKey`, `valueKey`, and `series[].id` match actual
   datum property names.
3. Use `format="currency"` for money, `format="percent"` for ratios, and
   `format="compact"` for dense dashboard values.
4. Use `xFormat="date"` when `xKey` contains dates.
5. Wrap charts in `ChartCard state="ready"` for dashboard layouts.
6. Keep chart `height` stable inside cards to avoid layout shift.
