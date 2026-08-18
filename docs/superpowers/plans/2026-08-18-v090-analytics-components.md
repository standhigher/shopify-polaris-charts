# v0.9.0 Analytics Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add typed comparison and conversion trend components, shared analytics presentation helpers, and a Shopify-style composed dashboard example without adding data fetching or metric calculation.

**Architecture:** `ComparisonChart` and `ConversionChart` are semantic adapters over `TrendChart`; `TrendChart` remains the only Cartesian rendering implementation. Analytics contracts use explicit datum keys, and small internal helpers convert those contracts into existing `ChartSeries` values while preserving the common state, localization, formatting, tooltip, legend, and controlled Recharts behavior.

**Tech Stack:** React 18+, TypeScript 5, Recharts 3, Vitest, Testing Library, Storybook 10, tsup.

---

### Task 1: Add analytics series contracts and helpers

**Files:**
- Create: `src/components/Analytics/analytics.ts`
- Create: `src/components/Analytics/analytics.test.ts`
- Create: `src/components/Analytics/index.ts`
- Modify: `src/index.ts`
- Modify: `src/index.test.ts`

- [ ] **Step 1: Write failing contract/helper tests**

Test an exported `createAnalyticsSeries` helper with datum keys `currentRevenue` and `previousRevenue`. Assert that it returns existing `ChartSeries` objects whose `id` matches `dataKey`, whose `data` is the original array, and whose presentation fields are retained. Test `normalizePercentageData` with ratio input (same array reference) and percent input (new rows with selected numeric fields divided by 100 while `null` stays `null`).

```ts
const data = [{date: '2026-08-01', current: 120, previous: 100}];
expect(createAnalyticsSeries(data, {dataKey: 'current', label: 'Current'})).toMatchObject({
  id: 'current', label: 'Current', data
});
expect(normalizePercentageData([{date: 'A', conversion: 4.2}], ['conversion'], 'percent'))
  .toEqual([{date: 'A', conversion: 0.042}]);
```

- [ ] **Step 2: Run the test and verify RED**

Run: `npm test -- src/components/Analytics/analytics.test.ts src/index.test.ts`
Expected: FAIL because the Analytics module and public exports do not exist.

- [ ] **Step 3: Implement minimal contracts and helpers**

Define:

```ts
export interface AnalyticsSeries<TDatum extends object> {
  dataKey: keyof TDatum & string;
  label: string;
  color?: string;
  opacity?: number;
  strokeDasharray?: string | number;
  strokeWidth?: number;
}

export type PercentageInput = 'percent' | 'ratio';
```

Implement `createAnalyticsSeries<TDatum>(data, definition): ChartSeries<TDatum>` and immutable `normalizePercentageData<TDatum>(data, dataKeys, input)`. Export the types from the package root and assert their runtime helpers in `src/index.test.ts`.

- [ ] **Step 4: Run focused tests and typecheck**

Run: `npm test -- src/components/Analytics/analytics.test.ts src/index.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Analytics src/index.ts src/index.test.ts
git commit -m "feat: add analytics series contracts"
```

### Task 2: Implement ComparisonChart as a TrendChart adapter

**Files:**
- Create: `src/components/ComparisonChart/ComparisonChart.tsx`
- Create: `src/components/ComparisonChart/ComparisonChart.test.tsx`
- Create: `src/components/ComparisonChart/ComparisonChart.stories.tsx`
- Create: `src/components/ComparisonChart/index.ts`
- Modify: `src/index.ts`
- Modify: `src/index.test.ts`

- [ ] **Step 1: Write failing behavior tests**

Render same-datum data with `currentSeries={{dataKey: 'currentRevenue', label: 'Current period'}}` and `comparisonSeries={{dataKey: 'previousRevenue', label: 'Previous period'}}`. Assert both legend labels and currency values render. Add cases for comparison `null`, all-null data resolving to Empty, custom comparison dash/opacity, `state="error"` with `retryAction`, and `mode="area"`.

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/components/ComparisonChart/ComparisonChart.test.tsx`
Expected: FAIL because `ComparisonChart` does not exist.

- [ ] **Step 3: Implement the adapter**

Define `ComparisonChartProps<TDatum>` by omitting `series` from `TrendChartProps<TDatum>` and adding:

```ts
currentSeries: AnalyticsSeries<TDatum>;
comparisonSeries: AnalyticsSeries<TDatum>;
```

Call `createAnalyticsSeries` for both definitions. Apply `strokeDasharray: '6 4'` and `opacity: 0.64` only when the comparison definition omits them. Pass every remaining prop to `TrendChart` unchanged so state, localization, tooltip, axes, formatters, reveal and Recharts controls remain centralized.

- [ ] **Step 4: Add Storybook stories**

Add Revenue year-over-year, partial previous-period data, Loading, Empty and Error/custom action stories using static same-datum data.

- [ ] **Step 5: Verify focused behavior and exports**

Run: `npm test -- src/components/ComparisonChart/ComparisonChart.test.tsx src/index.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ComparisonChart src/index.ts src/index.test.ts
git commit -m "feat: add comparison chart"
```

### Task 3: Implement ConversionChart as a percentage TrendChart adapter

**Files:**
- Create: `src/components/ConversionChart/ConversionChart.tsx`
- Create: `src/components/ConversionChart/ConversionChart.test.tsx`
- Create: `src/components/ConversionChart/ConversionChart.stories.tsx`
- Create: `src/components/ConversionChart/index.ts`
- Modify: `src/index.ts`
- Modify: `src/index.test.ts`

- [ ] **Step 1: Write failing behavior tests**

Test ratio data `0.042` renders `4.2%`; `input="percent"` data `4.2` renders identically without mutating the caller data. Test multiple conversion series, `target={{label: 'Goal', value: 0.05}}`, zero/null values, state forwarding, and explicit formatter options.

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/components/ConversionChart/ConversionChart.test.tsx`
Expected: FAIL because `ConversionChart` does not exist.

- [ ] **Step 3: Implement conversion contracts and adapter**

Define:

```ts
export interface ConversionTarget {
  color?: string;
  label: string;
  value: number;
}

export interface ConversionChartProps<TDatum extends object>
  extends Omit<TrendChartProps<TDatum>, 'data' | 'format' | 'series'> {
  data: TDatum[];
  input?: PercentageInput;
  series: Array<AnalyticsSeries<TDatum>>;
  target?: ConversionTarget;
}
```

Use `normalizePercentageData` for percent input. For a target, add one collision-safe internal field to each copied row and one dashed neutral series; do not modify caller data. Pass `format="percent"` and the normalized rows to `TrendChart`.

- [ ] **Step 4: Add Storybook stories**

Add store conversion trend, multi-channel conversion, percent input, target line, Loading and Error stories.

- [ ] **Step 5: Verify focused behavior and exports**

Run: `npm test -- src/components/ConversionChart/ConversionChart.test.tsx src/components/Analytics/analytics.test.ts src/index.test.ts && npm run typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/ConversionChart src/index.ts src/index.test.ts
git commit -m "feat: add conversion chart"
```

### Task 4: Stabilize shared analytics presentation semantics

**Files:**
- Modify: `src/components/Analytics/analytics.ts`
- Modify: `src/components/Analytics/analytics.test.ts`
- Modify: `src/components/ComparisonChart/ComparisonChart.test.tsx`
- Modify: `src/components/ConversionChart/ConversionChart.test.tsx`

- [ ] **Step 1: Add failing semantic edge-case tests**

Cover a definition whose explicit `opacity: 0` and `strokeDasharray: 0` must not be replaced, a target field collision with a user datum key, Date/string x values remaining untouched during percent normalization, and deterministic current-before-comparison series ordering.

- [ ] **Step 2: Verify RED where gaps exist**

Run: `npm test -- src/components/Analytics/analytics.test.ts src/components/ComparisonChart/ComparisonChart.test.tsx src/components/ConversionChart/ConversionChart.test.tsx`
Expected: at least one new edge-case assertion fails before the minimal correction.

- [ ] **Step 3: Make minimal corrections**

Use nullish defaults rather than truthy defaults, isolate target-key generation in a tested helper, and keep analytics helpers pure. Do not export Recharts payload objects or add a new public Tooltip API.

- [ ] **Step 4: Verify all component tests**

Run: `npm test -- src/components/Analytics src/components/ComparisonChart src/components/ConversionChart src/components/TrendChart && npm run typecheck`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Analytics src/components/ComparisonChart src/components/ConversionChart
git commit -m "test: harden analytics presentation semantics"
```

### Task 5: Build the v0.9 analytics dashboard example

**Files:**
- Create: `src/examples/AnalyticsDashboard.stories.tsx`
- Create: `src/examples/AnalyticsDashboard.test.tsx`
- Modify: `src/examples/sampleData.ts`

- [ ] **Step 1: Write a failing composed-example test**

Render the exported `AnalyticsDashboard` and assert headings/labels for Gross sales, Orders, Conversion rate, Revenue trend, Orders compared with previous period and Store conversion. Assert the page uses `ComparisonChart`, `ConversionChart`, and `MetricCard` output rather than manually reproducing charts.

- [ ] **Step 2: Run and verify RED**

Run: `npm test -- src/examples/AnalyticsDashboard.test.tsx`
Expected: FAIL because the example does not exist.

- [ ] **Step 3: Add realistic static data**

Add same-datum revenue/order comparison data and ratio conversion data to `sampleData.ts`. Values are presentation fixtures only and contain no fetch or aggregation functions.

- [ ] **Step 4: Implement responsive composed Story**

Create a full-width Shopify App style dashboard with three MetricCards and three chart cards. Use CSS grid `repeat(auto-fit, minmax(min(100%, 360px), 1fr))`, expose ready/loading/error story variants, and keep every chart readable at a 320px container width.

- [ ] **Step 5: Verify example tests and Storybook build**

Run: `npm test -- src/examples/AnalyticsDashboard.test.tsx && npm run build-storybook`
Expected: PASS and Storybook build exits 0.

- [ ] **Step 6: Commit**

```bash
git add src/examples
git commit -m "docs: add analytics dashboard example"
```

### Task 6: Complete v0.9 documentation and release readiness

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Modify: `docs/api.md`
- Modify: `docs/api.zh-CN.md`
- Modify: `docs/usage.md`
- Modify: `docs/usage.zh-CN.md`
- Modify: `CHANGELOG.md`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/index.ts`
- Modify: `src/index.test.ts`

- [ ] **Step 1: Update positioning and API documentation**

Lead README with “Polaris-style charts for Shopify App analytics and app-owned data.” Document `AnalyticsSeries`, `ComparisonChart`, `ConversionChart`, ratio/percent semantics, same-datum alignment responsibility, target lines, state props and non-goals in both languages.

- [ ] **Step 2: Add release notes and version assertions**

Add a dated `0.9.0` changelog section. Update `packageVersion` and its test to `0.9.0`; update package metadata with `npm version 0.9.0 --no-git-tag-version` only after tests for the new exports pass.

- [ ] **Step 3: Run the full quality gate**

Run: `npm test && npm run typecheck && npm run lint && npm run build && npm run build-storybook`
Expected: all tests PASS and every command exits 0.

- [ ] **Step 4: Verify package contents and tree-shaking surface**

Run: `npm pack --dry-run --registry=https://registry.npmjs.org/`
Expected: package contains built declarations and runtime exports for both new components, with no Storybook static output or source tests.

- [ ] **Step 5: Commit release readiness changes**

```bash
git add README.md README.zh-CN.md docs CHANGELOG.md package.json package-lock.json src/index.ts src/index.test.ts
git commit -m "chore: prepare v0.9.0 analytics components"
```

Do not create or push the `v0.9.0` tag and do not publish npm until the branch is reviewed and explicitly approved for release.
