# Chart Customization Options Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add stable customization props for chart legend visibility, chart margin, axes, grid, tooltip cursor, and line dots so business teams can reproduce BestUpsell Analytics chart details without forking or DOM-patching `@standhigher/charts`.

**Architecture:** Add shared option types in `src/types/chart.ts`, then apply them consistently across `TrendChart`, `StackedBarChart`, `ComboChart`, and `DonutChart`. Keep defaults exactly as they are today; every new prop is optional and only overrides the current built-in Polaris-style defaults when provided.

**Tech Stack:** React 18, TypeScript, Recharts, Vitest, React Testing Library, tsup.

---

## Scope

Implement P0 plus the low-risk P1 options from the Feishu requirement document:

- `showLegend`
- `margin`
- `xAxis` / `yAxis` options: `domain`, `ticks`, `tickColor`, `tickFontSize`, `axisLine`, `tickLine`, `minTickGap`, `interval`, `width`
- `grid` options: `horizontal`, `vertical`, `stroke`, `strokeDasharray`
- `tooltip.cursor`
- `line.dot` and `line.activeDot`

Do **not** implement full `tooltip.content` or `experimentalRechartsProps` in this task. Those are intentionally deferred until a second business use case proves the need.

## Files

- Modify: `src/types/chart.ts`
- Modify: `src/types/index.ts`
- Modify: `src/components/TrendChart/TrendChart.tsx`
- Modify: `src/components/StackedBarChart/StackedBarChart.tsx`
- Modify: `src/components/ComboChart/ComboChart.tsx`
- Modify: `src/components/DonutChart/DonutChart.tsx`
- Modify: `src/components/TrendChart/TrendChart.test.tsx`
- Modify: `src/components/StackedBarChart/StackedBarChart.test.tsx`
- Modify: `src/components/ComboChart/ComboChart.test.tsx`
- Modify: `src/components/DonutChart/DonutChart.test.tsx`
- Modify: `docs/api.md`
- Modify: `docs/api.zh-CN.md`

## API Design

Add these exported types:

```ts
export interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface CartesianAxisOptions {
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

export interface ChartGridOptions {
  horizontal?: boolean;
  vertical?: boolean;
  stroke?: string;
  strokeDasharray?: string;
}

export interface ChartTooltipOptions {
  cursor?: false | Record<string, unknown>;
}

export interface ChartLineOptions {
  dot?: boolean | Record<string, unknown>;
  activeDot?: boolean | Record<string, unknown>;
}
```

Add props:

```ts
showLegend?: boolean;
margin?: ChartMargin;
xAxis?: CartesianAxisOptions;
yAxis?: CartesianAxisOptions;
grid?: ChartGridOptions;
tooltip?: ChartTooltipOptions;
line?: ChartLineOptions;
```

Component coverage:

| Prop | TrendChart | StackedBarChart | ComboChart | DonutChart |
|---|---:|---:|---:|---:|
| `showLegend` | Yes | Yes | Yes | Yes |
| `margin` | Yes | Yes | Yes | No |
| `xAxis` | Yes | Yes | Yes | No |
| `yAxis` | Yes | Yes | Yes | No |
| `grid` | Yes | Yes | Yes | No |
| `tooltip` | Yes | Yes | Yes | No |
| `line` | Yes | No | Yes | No |

Default behavior must remain unchanged:

```ts
showLegend = true
line.dot default = false
line.activeDot default = { r: 4 }
grid.stroke default = chartTheme.grid.stroke
grid.strokeDasharray default = chartTheme.grid.strokeDasharray
grid.horizontal default = true
grid.vertical default = true
```

---

### Task 1: Add Shared Option Types

**Files:**
- Modify: `src/types/chart.ts`
- Modify: `src/types/index.ts`

- [ ] **Step 1: Add the shared option types**

Append the new type definitions to `src/types/chart.ts` after `ChartState`:

```ts
export interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface CartesianAxisOptions {
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

export interface ChartGridOptions {
  horizontal?: boolean;
  vertical?: boolean;
  stroke?: string;
  strokeDasharray?: string;
}

export interface ChartTooltipOptions {
  cursor?: false | Record<string, unknown>;
}

export interface ChartLineOptions {
  dot?: boolean | Record<string, unknown>;
  activeDot?: boolean | Record<string, unknown>;
}
```

- [ ] **Step 2: Re-export the new types**

Update `src/types/index.ts` so the export list includes the new types:

```ts
export type {
  CartesianAxisOptions,
  ChartDatum,
  ChartFormat,
  ChartGridOptions,
  ChartLineOptions,
  ChartMargin,
  ChartSeries,
  ChartState,
  ChartTooltipOptions,
  ChartValue
} from './chart';
```

- [ ] **Step 3: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: command exits `0`.

- [ ] **Step 4: Commit**

```bash
git add src/types/chart.ts src/types/index.ts
git commit -m "feat: add chart customization option types"
```

---

### Task 2: Support `showLegend`

**Files:**
- Modify: `src/components/TrendChart/TrendChart.tsx`
- Modify: `src/components/StackedBarChart/StackedBarChart.tsx`
- Modify: `src/components/ComboChart/ComboChart.tsx`
- Modify: `src/components/DonutChart/DonutChart.tsx`
- Modify: `src/components/TrendChart/TrendChart.test.tsx`
- Modify: `src/components/StackedBarChart/StackedBarChart.test.tsx`
- Modify: `src/components/ComboChart/ComboChart.test.tsx`
- Modify: `src/components/DonutChart/DonutChart.test.tsx`

- [ ] **Step 1: Write failing tests for hidden legends**

Add this test to `src/components/TrendChart/TrendChart.test.tsx` inside the existing `describe('TrendChart', ...)` block:

```tsx
it('hides the built-in legend when showLegend is false', () => {
  render(
    <TrendChart
      data={revenueData}
      xKey="date"
      series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      showLegend={false}
    />
  );

  expect(screen.queryByLabelText('Chart legend')).not.toBeInTheDocument();
});
```

Add this test to `src/components/StackedBarChart/StackedBarChart.test.tsx`:

```tsx
it('hides the built-in legend when showLegend is false', () => {
  render(
    <StackedBarChart
      data={channelCompositionData}
      xKey="channel"
      series={[{ id: 'fulfilled', label: 'Fulfilled', data: channelCompositionData }]}
      showLegend={false}
    />
  );

  expect(screen.queryByLabelText('Chart legend')).not.toBeInTheDocument();
});
```

Add this test to `src/components/ComboChart/ComboChart.test.tsx`:

```tsx
it('hides the built-in legend when showLegend is false', () => {
  render(
    <ComboChart
      data={orderConversionData}
      xKey="date"
      series={[{ id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar' }]}
      showLegend={false}
    />
  );

  expect(screen.queryByLabelText('Chart legend')).not.toBeInTheDocument();
});
```

Add this test to `src/components/DonutChart/DonutChart.test.tsx`:

```tsx
it('hides the built-in legend when showLegend is false', () => {
  render(
    <DonutChart
      data={orderStatusData}
      categoryKey="status"
      valueKey="value"
      showLegend={false}
    />
  );

  expect(screen.queryByLabelText('Chart legend')).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused tests and verify they fail**

Run:

```bash
npm run test -- src/components/TrendChart/TrendChart.test.tsx src/components/StackedBarChart/StackedBarChart.test.tsx src/components/ComboChart/ComboChart.test.tsx src/components/DonutChart/DonutChart.test.tsx
```

Expected: TypeScript/Vitest fails because `showLegend` does not exist on the component props yet.

- [ ] **Step 3: Add `showLegend` to component props and rendering**

In each component props interface, add:

```ts
showLegend?: boolean;
```

In each component function parameter list, default it:

```ts
showLegend = true,
```

Wrap each legend block with `showLegend ? ... : null`.

For example, in `TrendChart.tsx`, replace:

```tsx
<div aria-label="Chart legend" style={styles.legend}>
  {seriesWithColor.map((item) => {
    const firstDatum = data.find((datum) => !isEmptyValue(getDatumValue(datum, item.id)));

    return (
      <span key={item.id} style={styles.legendItem}>
        <span aria-hidden="true" style={{ ...styles.marker, background: item.color }} />
        <span>{item.label}</span>
        <span style={styles.legendValue}>
          {formatChartValue(toChartValue(getDatumValue(firstDatum, item.id)), format, formatOptions)}
        </span>
      </span>
    );
  })}
</div>
```

with:

```tsx
{showLegend ? (
  <div aria-label="Chart legend" style={styles.legend}>
    {seriesWithColor.map((item) => {
      const firstDatum = data.find((datum) => !isEmptyValue(getDatumValue(datum, item.id)));

      return (
        <span key={item.id} style={styles.legendItem}>
          <span aria-hidden="true" style={{ ...styles.marker, background: item.color }} />
          <span>{item.label}</span>
          <span style={styles.legendValue}>
            {formatChartValue(toChartValue(getDatumValue(firstDatum, item.id)), format, formatOptions)}
          </span>
        </span>
      );
    })}
  </div>
) : null}
```

Repeat the same conditional pattern for `StackedBarChart`, `ComboChart`, and `DonutChart`.

- [ ] **Step 4: Run focused tests and verify they pass**

Run:

```bash
npm run test -- src/components/TrendChart/TrendChart.test.tsx src/components/StackedBarChart/StackedBarChart.test.tsx src/components/ComboChart/ComboChart.test.tsx src/components/DonutChart/DonutChart.test.tsx
```

Expected: all focused tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/components/TrendChart/TrendChart.tsx src/components/StackedBarChart/StackedBarChart.tsx src/components/ComboChart/ComboChart.tsx src/components/DonutChart/DonutChart.tsx src/components/TrendChart/TrendChart.test.tsx src/components/StackedBarChart/StackedBarChart.test.tsx src/components/ComboChart/ComboChart.test.tsx src/components/DonutChart/DonutChart.test.tsx
git commit -m "feat: allow hiding chart legends"
```

---

### Task 3: Support Cartesian `margin`, `xAxis`, `yAxis`, `grid`, `tooltip`, and `line` Options

**Files:**
- Modify: `src/components/TrendChart/TrendChart.tsx`
- Modify: `src/components/StackedBarChart/StackedBarChart.tsx`
- Modify: `src/components/ComboChart/ComboChart.tsx`
- Modify: `src/components/TrendChart/TrendChart.test.tsx`
- Modify: `src/components/StackedBarChart/StackedBarChart.test.tsx`
- Modify: `src/components/ComboChart/ComboChart.test.tsx`

- [ ] **Step 1: Add props to chart interfaces**

Import the new types in `TrendChart.tsx`, `StackedBarChart.tsx`, and `ComboChart.tsx`:

```ts
import type {
  CartesianAxisOptions,
  ChartDatum,
  ChartFormat,
  ChartGridOptions,
  ChartLineOptions,
  ChartMargin,
  ChartSeries,
  ChartTooltipOptions,
  ChartValue
} from '../../types';
```

For `StackedBarChart.tsx`, omit `ChartLineOptions`.

Add these props to `TrendChartProps`:

```ts
margin?: ChartMargin;
xAxis?: CartesianAxisOptions;
yAxis?: CartesianAxisOptions;
grid?: ChartGridOptions;
tooltip?: ChartTooltipOptions;
line?: ChartLineOptions;
```

Add these props to `StackedBarChartProps`:

```ts
margin?: ChartMargin;
xAxis?: CartesianAxisOptions;
yAxis?: CartesianAxisOptions;
grid?: ChartGridOptions;
tooltip?: ChartTooltipOptions;
```

Add these props to `ComboChartProps`:

```ts
margin?: ChartMargin;
xAxis?: CartesianAxisOptions;
yAxis?: CartesianAxisOptions;
grid?: ChartGridOptions;
tooltip?: ChartTooltipOptions;
line?: ChartLineOptions;
```

- [ ] **Step 2: Add helper functions**

In each Cartesian chart file, add these helpers near the existing utility functions:

```ts
const resolveAxisTick = (axis?: CartesianAxisOptions) => ({
  fill: axis?.tickColor ?? chartTheme.axis.tickColor,
  fontSize: axis?.tickFontSize ?? chartTheme.axis.fontSize
});

const resolveGridProps = (grid?: ChartGridOptions) => ({
  horizontal: grid?.horizontal ?? true,
  stroke: grid?.stroke ?? chartTheme.grid.stroke,
  strokeDasharray: grid?.strokeDasharray ?? chartTheme.grid.strokeDasharray,
  vertical: grid?.vertical ?? true
});

const defaultActiveDot = { r: 4 };
```

In `StackedBarChart.tsx`, do not add `defaultActiveDot`.

- [ ] **Step 3: Apply options in `TrendChart`**

Add the new parameters to `TrendChart`:

```ts
grid,
line,
margin,
tooltip,
xAxis,
yAxis,
```

Pass `margin` to both `<AreaChart>` and `<LineChart>`:

```tsx
<AreaChart data={data} margin={margin}>
```

```tsx
<LineChart data={data} margin={margin}>
```

Replace each `<CartesianGrid ... />` with:

```tsx
<CartesianGrid {...resolveGridProps(grid)} />
```

Update each `<XAxis>`:

```tsx
<XAxis
  axisLine={xAxis?.axisLine}
  dataKey={xKey as never}
  interval={xAxis?.interval}
  minTickGap={xAxis?.minTickGap}
  stroke={chartTheme.axis.lineColor}
  tick={resolveAxisTick(xAxis)}
  tickFormatter={(value) => formatCategoryValue(toChartValue(value), xFormat, xFormatOptions)}
  tickLine={xAxis?.tickLine}
  ticks={xAxis?.ticks}
/>
```

Update each `<YAxis>`:

```tsx
<YAxis
  axisLine={yAxis?.axisLine}
  domain={yAxis?.domain}
  stroke={chartTheme.axis.lineColor}
  tick={resolveAxisTick(yAxis)}
  tickFormatter={(value) => formatChartValue(toChartValue(value), format, formatOptions)}
  tickLine={yAxis?.tickLine}
  ticks={yAxis?.ticks}
  width={yAxis?.width}
/>
```

Update each `<Tooltip>`:

```tsx
<Tooltip
  cursor={tooltip?.cursor}
  content={
    <TrendTooltip
      format={format}
      formatOptions={formatOptions}
      seriesById={seriesById}
      xFormat={xFormat}
      xFormatOptions={xFormatOptions}
    />
  }
/>
```

Update `<Area>` and `<Line>`:

```tsx
activeDot={line?.activeDot ?? defaultActiveDot}
dot={line?.dot ?? false}
```

For `<Area>`, add `dot={line?.dot ?? false}` because the business request expects the line-like area series to accept the same dot controls.

- [ ] **Step 4: Apply options in `StackedBarChart`**

Add the new parameters:

```ts
grid,
margin,
tooltip,
xAxis,
yAxis,
```

Pass `margin` to `<BarChart>`:

```tsx
<BarChart data={data} margin={margin}>
```

Use:

```tsx
<CartesianGrid {...resolveGridProps(grid)} />
```

Update `<XAxis>`, `<YAxis>`, and `<Tooltip>` using the same option mapping as `TrendChart`.

- [ ] **Step 5: Apply options in `ComboChart`**

Add the new parameters:

```ts
grid,
line,
margin,
tooltip,
xAxis,
yAxis,
```

Pass `margin` to `<ComposedChart>`:

```tsx
<ComposedChart data={data} margin={margin}>
```

Use:

```tsx
<CartesianGrid {...resolveGridProps(grid)} />
```

Update the left `<YAxis>` with `domain`, `ticks`, `tickLine`, `axisLine`, `width`, and `resolveAxisTick(yAxis)`.

Update the right `<YAxis>` with the same visual options. If `yAxis.width` is provided, pass it to both axes.

Update `<Tooltip>`:

```tsx
<Tooltip
  cursor={tooltip?.cursor}
  content={
    <ComboTooltip
      format={format}
      formatOptions={formatOptions}
      seriesById={seriesById}
      xFormat={xFormat}
      xFormatOptions={xFormatOptions}
    />
  }
/>
```

Update line series only:

```tsx
activeDot={line?.activeDot ?? defaultActiveDot}
dot={line?.dot ?? false}
```

- [ ] **Step 6: Write integration-style rendering tests**

Add this test to `TrendChart.test.tsx`:

```tsx
it('accepts cartesian presentation options without changing render output', () => {
  render(
    <TrendChart
      data={revenueData}
      xKey="date"
      series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
      yAxis={{ domain: [0, 800], ticks: [0, 200, 400, 600, 800], width: 56 }}
      xAxis={{ axisLine: false, tickLine: false, minTickGap: 0 }}
      grid={{ horizontal: true, vertical: false, stroke: '#e5e7eb', strokeDasharray: '3 3' }}
      tooltip={{ cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }}
      line={{ dot: false, activeDot: { r: 3, strokeWidth: 0 } }}
    />
  );

  expect(screen.getByText('Gross sales')).toBeVisible();
  expect(screen.getByText('$12,430.40')).toBeVisible();
});
```

Add this test to `StackedBarChart.test.tsx`:

```tsx
it('accepts cartesian presentation options without changing render output', () => {
  render(
    <StackedBarChart
      data={channelCompositionData}
      xKey="channel"
      series={[{ id: 'fulfilled', label: 'Fulfilled', data: channelCompositionData }]}
      margin={{ left: -8 }}
      yAxis={{ domain: [0, 300], ticks: [0, 100, 200, 300], width: 56 }}
      xAxis={{ axisLine: false, tickLine: false, minTickGap: 0 }}
      grid={{ horizontal: true, vertical: false }}
      tooltip={{ cursor: { strokeDasharray: '3 3' } }}
    />
  );

  expect(screen.getByText('Fulfilled')).toBeVisible();
  expect(screen.getByText('184')).toBeVisible();
});
```

Add this test to `ComboChart.test.tsx`:

```tsx
it('accepts cartesian and line presentation options without changing render output', () => {
  render(
    <ComboChart
      data={orderConversionData}
      xKey="date"
      series={[
        { id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar' },
        { id: 'conversionRate', label: 'Conversion rate', data: orderConversionData, type: 'line', format: 'percent' }
      ]}
      margin={{ left: -8 }}
      yAxis={{ domain: [0, 200], ticks: [0, 100, 200], width: 56 }}
      xAxis={{ axisLine: false, tickLine: false, minTickGap: 0 }}
      grid={{ horizontal: true, vertical: false }}
      tooltip={{ cursor: { strokeDasharray: '3 3' } }}
      line={{ dot: false, activeDot: { r: 3 } }}
    />
  );

  expect(screen.getByText('Orders')).toBeVisible();
  expect(screen.getByText('Conversion rate')).toBeVisible();
});
```

- [ ] **Step 7: Run focused tests**

Run:

```bash
npm run test -- src/components/TrendChart/TrendChart.test.tsx src/components/StackedBarChart/StackedBarChart.test.tsx src/components/ComboChart/ComboChart.test.tsx
```

Expected: all focused tests pass.

- [ ] **Step 8: Run TypeScript**

Run:

```bash
npm run typecheck
```

Expected: command exits `0`. If Recharts prop types reject one of the option values, narrow the public type instead of casting to `any`.

- [ ] **Step 9: Commit**

```bash
git add src/components/TrendChart/TrendChart.tsx src/components/StackedBarChart/StackedBarChart.tsx src/components/ComboChart/ComboChart.tsx src/components/TrendChart/TrendChart.test.tsx src/components/StackedBarChart/StackedBarChart.test.tsx src/components/ComboChart/ComboChart.test.tsx
git commit -m "feat: add cartesian chart presentation options"
```

---

### Task 4: Add Storybook Examples for Business Usage

**Files:**
- Modify: `src/components/TrendChart/TrendChart.stories.tsx`
- Modify: `src/components/ComboChart/ComboChart.stories.tsx`
- Modify: `src/components/StackedBarChart/StackedBarChart.stories.tsx`

- [ ] **Step 1: Add a customized TrendChart story**

Add this story to `src/components/TrendChart/TrendChart.stories.tsx`:

```tsx
export const AnalyticsStyle: Story = {
  render: () => (
    <TrendChart
      data={revenueTrendData}
      format="currency"
      height={260}
      margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
      series={[{ id: 'grossSales', label: 'Gross sales', data: revenueTrendData, color: '#008060' }]}
      showLegend={false}
      tooltip={{ cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }}
      xAxis={{ axisLine: false, minTickGap: 0, tickLine: false }}
      xFormat="date"
      xKey="date"
      yAxis={{ domain: [0, 800], ticks: [0, 200, 400, 600, 800], width: 56 }}
      grid={{ horizontal: true, vertical: false, strokeDasharray: '3 3' }}
      line={{ dot: false, activeDot: { r: 3, strokeWidth: 0 } }}
    />
  )
};
```

- [ ] **Step 2: Add one customized story for ComboChart and StackedBarChart**

Use the same option shape as the `TrendChart` story. Keep story names `AnalyticsStyle`.

- [ ] **Step 3: Run Storybook build**

Run:

```bash
npm run build-storybook
```

Expected: command exits `0`.

- [ ] **Step 4: Commit**

```bash
git add src/components/TrendChart/TrendChart.stories.tsx src/components/ComboChart/ComboChart.stories.tsx src/components/StackedBarChart/StackedBarChart.stories.tsx
git commit -m "docs: add analytics-style chart stories"
```

---

### Task 5: Update API Documentation

**Files:**
- Modify: `docs/api.md`
- Modify: `docs/api.zh-CN.md`
- Modify: `README.md`
- Modify: `README.zh-CN.md`

- [ ] **Step 1: Update English API docs**

In `docs/api.md`, update prop tables for the affected components:

```md
| `showLegend` | `boolean` | No | `true` | Controls whether the built-in legend below the chart is rendered. |
| `margin` | `ChartMargin` | No | - | Recharts chart margin for Cartesian charts. |
| `xAxis` | `CartesianAxisOptions` | No | - | X-axis presentation options such as tick style, axis line, tick line, interval, and min tick gap. |
| `yAxis` | `CartesianAxisOptions` | No | - | Y-axis presentation options such as domain, ticks, width, tick style, axis line, and tick line. |
| `grid` | `ChartGridOptions` | No | - | Cartesian grid visibility and stroke options. |
| `tooltip` | `ChartTooltipOptions` | No | - | Tooltip presentation options. Currently supports `cursor`. |
| `line` | `ChartLineOptions` | No | - | Line and area dot options. Used by `TrendChart` and line series in `ComboChart`. |
```

Add this usage example:

```tsx
<TrendChart
  data={data}
  xKey="date"
  series={[{ id: 'grossSales', label: 'Gross sales', data }]}
  showLegend={false}
  yAxis={{ domain: [0, 800], ticks: [0, 200, 400, 600, 800] }}
  margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
  tooltip={{ cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }}
  line={{ dot: false, activeDot: { r: 3, strokeWidth: 0 } }}
/>
```

- [ ] **Step 2: Update Chinese API docs**

In `docs/api.zh-CN.md`, add the same prop rows and example in Chinese. Use these descriptions:

```md
| `showLegend` | `boolean` | No | `true` | 控制是否渲染组件内置 legend。 |
| `margin` | `ChartMargin` | No | - | Cartesian 图表的 Recharts margin。 |
| `xAxis` | `CartesianAxisOptions` | No | - | X 轴展示选项，例如 tick 样式、轴线、刻度线、interval、minTickGap。 |
| `yAxis` | `CartesianAxisOptions` | No | - | Y 轴展示选项，例如 domain、ticks、width、tick 样式、轴线、刻度线。 |
| `grid` | `ChartGridOptions` | No | - | 网格线方向和线条样式。 |
| `tooltip` | `ChartTooltipOptions` | No | - | Tooltip 展示选项，当前支持 `cursor`。 |
| `line` | `ChartLineOptions` | No | - | 折线/面积图的点位选项，也作用于 `ComboChart` 中的 line series。 |
```

- [ ] **Step 3: Run docs packaging check**

Run:

```bash
npm pack --dry-run --registry=https://registry.npmjs.org/
```

Expected: tarball contents include `docs/api.md` and `docs/api.zh-CN.md`.

- [ ] **Step 4: Commit**

```bash
git add docs/api.md docs/api.zh-CN.md README.md README.zh-CN.md
git commit -m "docs: document chart customization options"
```

---

### Task 6: Full Self-Test and Release Readiness Check

**Files:**
- Read only: all changed files

- [ ] **Step 1: Check whitespace and patch hygiene**

Run:

```bash
git diff --check
```

Expected: no output and exit `0`.

- [ ] **Step 2: Run lint**

Run:

```bash
npm run lint
```

Expected: command exits `0`.

- [ ] **Step 3: Run tests**

Run:

```bash
npm run test
```

Expected: all test files pass. Current baseline before this feature is 10 test files and 43 tests; after this feature the count should increase by at least 7 tests.

- [ ] **Step 4: Run typecheck**

Run:

```bash
npm run typecheck
```

Expected: command exits `0`.

- [ ] **Step 5: Run package build**

Run:

```bash
npm run build
```

Expected: `tsup` ESM and DTS builds both succeed.

- [ ] **Step 6: Run Storybook build**

Run:

```bash
npm run build-storybook
```

Expected: Storybook reports `Storybook build completed successfully`.

- [ ] **Step 7: Confirm package contents**

Run:

```bash
npm pack --dry-run --registry=https://registry.npmjs.org/
```

Expected: tarball includes `dist/index.d.ts`, `dist/index.js`, `docs/api.md`, `docs/api.zh-CN.md`, `docs/usage.md`, and `docs/usage.zh-CN.md`.

- [ ] **Step 8: Review final diff**

Run:

```bash
git diff --stat HEAD~5..HEAD
git log --oneline --max-count=8
```

Expected: changes are limited to chart option types, chart components, chart tests, stories, and API docs.

---

## Acceptance Criteria

- Business can hide built-in chart legends with `showLegend={false}`.
- Business can set fixed Y-axis domain and ticks for revenue and conversion charts.
- Business can tune chart margin without CSS or DOM overrides.
- Business can make tooltip cursor a vertical dashed line.
- Business can hide line dots and shrink active hover dots.
- Business can hide vertical grid lines while keeping horizontal grid lines.
- Existing chart defaults are visually and behaviorally unchanged when new props are omitted.
- Package type declarations expose the new option types.
- English and Chinese API docs include the new props and examples.
- Full verification commands pass:

```bash
git diff --check
npm run lint
npm run test
npm run typecheck
npm run build
npm run build-storybook
npm pack --dry-run --registry=https://registry.npmjs.org/
```

## Explicit Non-Goals

- Do not add `tooltip.content`.
- Do not add `experimentalRechartsProps`.
- Do not support per-bar or per-point colors in this task.
- Do not change package version or publish to npm in this task.
- Do not change GitHub Pages or GitLab mirror configuration in this task.

## Self-Review

- Spec coverage: P0 is fully covered. P1 axis/grid basics are covered. P1 full tooltip content customization is intentionally deferred. P2 escape hatch is intentionally deferred.
- Placeholder scan: no task uses unresolved placeholders or open-ended test instructions without concrete examples.
- Type consistency: prop names are consistent across API design, implementation tasks, test snippets, and docs snippets.
