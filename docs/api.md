# API Reference

Language: English | [中文](api.zh-CN.md)

This document is optimized for AI agents and code generators. It describes the
public API of `@standhigher/charts` with stable prop tables, defaults, type
contracts, and implementation notes.

## Package Summary

```ts
import {
  ChartCard,
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
  type ChartDatum,
  type ChartFormat,
  type ChartTheme,
  type ChartValueFormatOptions,
  type ChartSeries,
  type ChartState
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
| `ComboChartSeries` | type | Series item for `ComboChart`. |
| `ComboChartSeriesType` | type | `'bar' | 'line'`. |
| `ChartValue` | type | Shared nullable display value. |
| `ChartDatum` | type | Default loose datum shape. |
| `ChartSeries` | type | Shared series shape. |
| `ChartFormat` | type | Value format union. |
| `ChartState` | type | `ChartCard` state union. |
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
}
```

| Field | Type | Required | Description |
|---|---|---:|---|
| `id` | `string` | Yes | Data key for the series. Must match a field in each datum for Cartesian charts. |
| `label` | `string` | Yes | Human-readable legend and tooltip label. |
| `data` | `TDatum[]` | Yes | Series-owned data. Current chart components read from the chart-level `data` prop; keep this aligned for API consistency. |
| `color` | `string` | No | CSS color for the whole series. Defaults to `chartTheme.palette[index]`. |

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
```

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
| `mode` | `'line' \| 'area'` | No | `'line'` | Chart renderer mode. |
| `height` | `number` | No | `280` | Chart viewport height in pixels. |
| `format` | `ChartFormat` | No | `'number'` | Y-axis, tooltip, and legend value format. |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | Formatter options for Y values. |
| `xFormat` | `ChartFormat` | No | - | Optional X-axis and tooltip label format. |
| `xFormatOptions` | `ChartValueFormatOptions` | No | `{}` | Formatter options for X values. |
| `emptyMessage` | `ReactNode` | No | `'No data available'` | Empty-state content when no series values are renderable. |

### Notes for AI code generation

- Each `series[].id` must exist as a key on each datum, such as
  `{ date: '2026-07-20', grossSales: 18342.8 }`.
- Use `mode="area"` when overall movement should carry more visual weight.
- Use `series[].color` for series-level color. Individual point colors are not
  supported by this component.

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
