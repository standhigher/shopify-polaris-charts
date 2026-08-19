# v0.10.0 Shopify Analytics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver the v0.10.0 Shopify Analytics scenario layer with a vertical accessible funnel, reusable presentation presets, a complete dashboard pattern, and a reproducible performance baseline.

**Architecture:** `FunnelChart` owns a small vertical funnel renderer because its stage/value/conversion/drop-off semantics do not fit the Cartesian adapters. It reuses localization, formatters, theme tokens, and `ChartStateRegion`. Analytics presets remain immutable presentation-only constants with no data keys or business calculations. Examples compose existing public components, while performance tooling stays outside the runtime package.

**Tech Stack:** React 18+, TypeScript 5, Recharts 3, Vitest, Testing Library, Storybook 10, tsup, Node.js performance hooks, JSDOM.

---

### Task 0: Close inherited presentation-state regressions

**Files:**
- Modify: `src/components/ChartState/ChartState.tsx`
- Modify: `src/components/ChartState/ChartState.test.tsx`
- Modify: `src/components/ComboChart/ComboChart.tsx`
- Modify: `src/components/ComboChart/ComboChart.test.tsx`

- [ ] **Step 1: Write failing regressions**

Add a fake-timer test proving `reveal={{active: false, durationMs: 0}}` unmounts the overlay and returns `aria-busy` to `false` without waiting for a `transitionend` event. Add a ComboChart provider test where provider defaults supply locale/currency/timeZone and a series supplies only `maximumFractionDigits: 0`; assert Legend, Tooltip, and secondary axis use the merged options consistently.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- src/components/ChartState/ChartState.test.tsx src/components/ComboChart/ComboChart.test.tsx`

Expected: the zero-duration overlay remains mounted and the partial series format options drop provider defaults in the legend.

- [ ] **Step 3: Implement minimal fixes**

Unmount the reveal overlay synchronously in the scheduled frame when reduced motion is active or the resolved duration is `0`; retain `transitionend` for animated transitions. Merge ComboChart legend options as `{...formatOptions, ...item.formatOptions}` to match Tooltip and axis precedence.

- [ ] **Step 4: Run focused tests, typecheck, and lint**

Run: `npm test -- src/components/ChartState/ChartState.test.tsx src/components/ComboChart/ComboChart.test.tsx && npm run typecheck && npm run lint`

Expected: all commands exit `0`.

- [ ] **Step 5: Commit**

```bash
git add src/components/ChartState src/components/ComboChart
git commit -m "fix: harden chart reveal and legend formatting"
```

### Task 1: Funnel data contract and normalization helpers

**Files:**
- Create: `src/components/FunnelChart/funnel.ts`
- Create: `src/components/FunnelChart/funnel.test.ts`

- [ ] **Step 1: Write failing contract and normalization tests**

Cover these exact behaviors:

```ts
const stages: FunnelDatum[] = [
  {id: 'view', label: 'Product view', value: 1000},
  {id: 'cart', label: 'Add to cart', value: 0, conversion: 0, dropOff: 1},
];

expect(normalizeFunnelData(stages, 'ratio')).toEqual(stages);
expect(normalizeFunnelData([{...stages[1], conversion: 25}], 'percent')[0].conversion).toBe(0.25);
expect(normalizeFunnelData(stages, 'percent')).not.toBe(stages);
expect(stages[1].conversion).toBe(0);
```

Also assert that array order, duplicate labels, long labels, IDs, zero values, missing conversion/drop-off values, and non-selected fields are preserved. Ratio input must preserve the original array reference; percent input must clone rows and divide only finite conversion/drop-off numbers by 100.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npm test -- src/components/FunnelChart/funnel.test.ts`

Expected: FAIL because `FunnelDatum` and `normalizeFunnelData` do not exist.

- [ ] **Step 3: Implement the minimal contract and helper**

Use this public contract:

```ts
export interface FunnelDatum {
  id: string;
  label: ReactNode;
  value: number;
  conversion?: number;
  dropOff?: number;
}

export type FunnelPercentageInput = PercentageInput;

export function normalizeFunnelData(
  data: FunnelDatum[],
  percentageInput: FunnelPercentageInput,
): FunnelDatum[];
```

Do not calculate conversion or drop-off, infer missing values, filter zero stages, sort data, or mutate caller objects.

- [ ] **Step 4: Run the focused tests and typecheck**

Run: `npm test -- src/components/FunnelChart/funnel.test.ts && npm run typecheck`

Expected: all focused tests pass and TypeScript exits `0`.

- [ ] **Step 5: Commit**

```bash
git add src/components/FunnelChart/funnel.ts src/components/FunnelChart/funnel.test.ts
git commit -m "feat: add funnel data contract"
```

### Task 2: Accessible vertical FunnelChart

**Files:**
- Create: `src/components/FunnelChart/FunnelChart.tsx`
- Create: `src/components/FunnelChart/FunnelChart.test.tsx`
- Create: `src/components/FunnelChart/FunnelChart.stories.tsx`
- Create: `src/components/FunnelChart/index.ts`
- Modify: `src/index.ts`
- Modify: `src/index.test.ts`

- [ ] **Step 1: Write failing rendering and public-export tests**

Test a product funnel with Product view → Add to cart → Checkout → Purchase and assert:

- DOM order equals input order, including duplicate labels distinguished by unique IDs.
- Every stage exposes its label, formatted value, conversion, and drop-off as text; information is not color-only.
- `value: 0` remains visible and is not treated as empty.
- long labels wrap and the component has no fixed minimum width that breaks a 320px container.
- `percentageInput="percent"` displays `25` as `25%`, while the default ratio displays `0.25` as `25%`.
- missing conversion/drop-off values render an em dash rather than inferred metrics.
- hover and keyboard focus reveal an accessible tooltip/status description for the same stage.
- `loading`, `empty`, `error`, default Retry, custom `retryAction`, skeleton, reveal, and localized defaults flow through `ChartStateRegion`.
- the root package exports `FunnelChart` and its public types.

- [ ] **Step 2: Run focused tests and verify RED**

Run: `npm test -- src/components/FunnelChart/FunnelChart.test.tsx src/index.test.ts`

Expected: FAIL because the component and exports do not exist.

- [ ] **Step 3: Implement the vertical renderer**

Expose:

```ts
export interface FunnelChartProps {
  colors?: readonly string[];
  data: FunnelDatum[];
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
  height?: number;
  loadingLabel?: ReactNode;
  onRetry?: () => void;
  percentageInput?: FunnelPercentageInput;
  retryAction?: ReactNode;
  retryLabel?: ReactNode;
  reveal?: boolean | ChartRevealOptions;
  skeleton?: boolean | ChartSkeletonOptions;
  state?: ChartContentState;
  title?: ReactNode;
}
```

Render an ordered semantic list. Each row contains a centered proportional funnel segment plus visible Stage, Value, Conversion, and Drop-off fields. Segment width is `value / maxFiniteNonNegativeValue`, clamped only for visual width; the displayed value remains the caller value. Never reorder stages. A zero-value stage gets a visible minimum outline but displays `0`.

Use `id` as the stable React key and document that IDs must be unique; duplicate labels remain valid when their IDs differ. Use the existing `formatChartValue`, localization defaults, `chartTheme`, and `ChartStateRegion`. Tooltip behavior uses a focusable stage button/row and local active-stage state; its accessible description must match the visible stage metrics. No orientation prop is introduced.

- [ ] **Step 4: Add Storybook states**

Provide Product funnel, Upsell funnel, Zero stage, Long and duplicate labels, 320px container, Loading, Empty, Error with Retry, and custom Retry action stories.

- [ ] **Step 5: Run focused and component-suite verification**

Run: `npm test -- src/components/FunnelChart src/index.test.ts && npm run typecheck && npm run lint`

Expected: all commands exit `0`.

- [ ] **Step 6: Commit**

```bash
git add src/components/FunnelChart src/index.ts src/index.test.ts
git commit -m "feat: add accessible funnel chart"
```

### Task 3: Tree-shakeable Analytics presets

**Files:**
- Create: `src/presets/types.ts`
- Create: `src/presets/presets.ts`
- Create: `src/presets/presets.test.ts`
- Create: `src/presets/index.ts`
- Modify: `src/index.ts`
- Modify: `src/index.test.ts`

- [ ] **Step 1: Write failing preset contract tests**

Assert named exports for:

```ts
revenueTrendPreset
orderTrendPreset
conversionTrendPreset
customerTrendPreset
upsellConversionPreset
funnelPreset
```

Each preset must be deeply immutable (`Readonly` types plus frozen top-level and nested values), contain only presentation fields, and omit `data`, `dataKey`, Shopify API types, fetchers, calculations, and React components. Verify local override usage with object spread does not mutate the preset:

```ts
const overridden = {
  ...revenueTrendPreset,
  currentSeries: {...revenueTrendPreset.currentSeries, color: '#000000'},
};
```

- [ ] **Step 2: Run tests and verify RED**

Run: `npm test -- src/presets/presets.test.ts src/index.test.ts`

Expected: FAIL because preset exports do not exist.

- [ ] **Step 3: Implement presentation-only constants**

Define focused types:

```ts
export interface AnalyticsSeriesPreset {
  readonly color: string;
  readonly label: string;
  readonly opacity?: number;
  readonly strokeDasharray?: string | number;
  readonly strokeWidth?: number;
}

export interface AnalyticsTrendPreset {
  readonly axis: Readonly<{format: ChartFormat}>;
  readonly currentSeries: AnalyticsSeriesPreset;
  readonly format: ChartFormat;
  readonly comparisonSeries?: AnalyticsSeriesPreset;
}

export interface FunnelPreset {
  readonly colors: readonly string[];
  readonly format: ChartFormat;
  readonly percentageInput: FunnelPercentageInput;
}
```

Revenue uses currency formatting; orders and customers use `number`/`compact` recommendations; conversion and upsell use percentage semantics; comparison styling is dashed and lower opacity. `funnelPreset` supplies theme colors and ratio percentage semantics. Keep constants in a side-effect-free module so named imports tree-shake under the existing `sideEffects: false` package setting.

- [ ] **Step 4: Verify tests, types, and isolated bundle imports**

Run: `npm test -- src/presets src/index.test.ts && npm run typecheck && npm run build`

Then bundle a temporary entry that imports only `revenueTrendPreset` with the installed `esbuild` path used by tsup, and assert the output does not include `FunnelChart`, `Recharts`, or React runtime imports.

Expected: tests and builds pass; the isolated preset bundle contains only preset data.

- [ ] **Step 5: Commit**

```bash
git add src/presets src/index.ts src/index.test.ts
git commit -m "feat: add analytics presentation presets"
```

### Task 4: Complete Shopify Analytics Dashboard pattern

**Files:**
- Create: `src/examples/ShopifyAnalyticsDashboard.stories.tsx`
- Create: `src/examples/ShopifyAnalyticsDashboard.test.tsx`
- Modify: `src/examples/sampleData.ts`

- [ ] **Step 1: Write failing composition tests**

Export `ShopifyAnalyticsDashboard` and assert the page contains this order:

1. Metric Cards: Revenue, Orders, Conversion Rate, AOV, Customers, Upsell Conversion.
2. Trend.
3. Comparison.
4. Conversion.
5. Funnel.

Assert that the implementation composes `MetricCard`, `ComparisonChart`, `ConversionChart`, and `FunnelChart`; exposes an accessible date-range selector; shows partial Empty and localized Error/Retry without hiding unaffected cards; includes multi-column loading skeletons; and applies progressive reveal only to ready regions.

- [ ] **Step 2: Run focused test and verify RED**

Run: `npm test -- src/examples/ShopifyAnalyticsDashboard.test.tsx`

Expected: FAIL because the dashboard pattern does not exist.

- [ ] **Step 3: Add deterministic scenario data**

Extend `sampleData.ts` with explicit current/previous revenue and order fields, conversion ratio values, AOV/customer/upsell values, and two ordered funnel datasets. The date selector switches between two static prepared datasets; it must not fetch, align dates, or calculate business metrics.

- [ ] **Step 4: Implement the dashboard pattern and stories**

Use CSS grids with `minmax(min(100%, ...), 1fr)` so 320px containers do not overflow. Add Ready, Date range interaction, Loading, Partial Empty, Localized Error with Retry, and Progressive Reveal stories. Section headings must follow `h1 → h2 → h3`, and regions must use `aria-labelledby`.

Presets are applied explicitly with caller-owned data keys. Map the preset's axis recommendation to the existing chart props rather than blindly spreading unknown fields:

```tsx
<ComparisonChart
  format={revenueTrendPreset.format}
  currentSeries={{dataKey: 'currentRevenue', ...revenueTrendPreset.currentSeries}}
  comparisonSeries={{dataKey: 'previousRevenue', ...revenueTrendPreset.comparisonSeries}}
/>
```

Do not add a dashboard framework, provider, data hook, query library, or Shopify API dependency.

- [ ] **Step 5: Verify focused tests, accessibility semantics, and Storybook**

Run: `npm test -- src/examples/ShopifyAnalyticsDashboard.test.tsx && npm run typecheck && npm run lint && npm run build-storybook`

Expected: all commands exit `0`; only the existing non-blocking Vite large-chunk warning is acceptable.

- [ ] **Step 6: Commit**

```bash
git add src/examples/ShopifyAnalyticsDashboard.stories.tsx src/examples/ShopifyAnalyticsDashboard.test.tsx src/examples/sampleData.ts
git commit -m "docs: add complete shopify analytics dashboard"
```

### Task 5: Reproducible v0.10 performance baseline

**Files:**
- Create: `scripts/benchmark-analytics.mjs`
- Create: `scripts/benchmark-analytics.test.ts`
- Create: `docs/performance/v0.10-baseline.md`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Write failing deterministic workload tests**

Export pure workload helpers from the benchmark module and test that they generate exactly 100, 500, and 1000 time points and exactly 5, 10, and 20 chart descriptors without randomness. Assert the runner reports `initialRenderMs`, `updateMs`, `heapDeltaBytes`, raw bundle bytes, and gzip bundle bytes for every matrix cell.

- [ ] **Step 2: Run focused test and verify RED**

Run: `npm test -- scripts/benchmark-analytics.test.ts`

Expected: FAIL because the benchmark module does not exist.

- [ ] **Step 3: Implement the benchmark runner**

Use Node `performance.now()`, `process.memoryUsage()`, React DOM `createRoot`, JSDOM, fixed container dimensions, and deterministic prepared datasets. Stub `ResizeObserver`, `matchMedia`, and animation frames only inside the benchmark process. Build first, then measure initial render and one immutable data update for 5/10/20 charts at 100/500/1000 points. Measure `dist/index.js` raw and gzip bytes. Print machine-readable JSON plus a compact Markdown table.

Add:

```json
"benchmark:analytics": "npm run build && node scripts/benchmark-analytics.mjs"
```

This is a recorded baseline, not a strict v1 performance budget. The command must fail only for execution errors, missing matrix cells, non-finite timings, or invalid bundle measurements.

- [ ] **Step 4: Record and explain the baseline**

Run: `npm run benchmark:analytics`

Record environment, command, matrix results, bundle measurements, interpretation, and known JSDOM limitations in `docs/performance/v0.10-baseline.md`. Explicitly state that browser, SSR, and hard thresholds are deferred to v1.0.

- [ ] **Step 5: Verify repeatability**

Run the benchmark twice. Expected: both executions complete all nine matrix cells with finite non-negative measurements. Timing values may differ; workload sizes and output schema must not.

- [ ] **Step 6: Commit**

```bash
git add scripts/benchmark-analytics.mjs scripts/benchmark-analytics.test.ts docs/performance/v0.10-baseline.md package.json package-lock.json
git commit -m "perf: establish v0.10 analytics baseline"
```

### Task 6: Documentation, compatibility smoke test, and v0.10 release preparation

**Files:**
- Modify: `README.md`
- Modify: `README.zh-CN.md`
- Modify: `docs/api.md`
- Modify: `docs/api.zh-CN.md`
- Modify: `docs/usage.md`
- Modify: `docs/usage.zh-CN.md`
- Modify: `CHANGELOG.md`
- Create: `scripts/recharts-legacy-smoke.mjs`
- Create: `scripts/recharts-legacy-smoke.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `src/index.ts`
- Modify: `src/index.test.ts`

- [ ] **Step 1: Add failing version and public API assertions**

Update `src/index.test.ts` expectations to `0.10.0` and assert all Funnel and preset exports. Add a legacy smoke test that installs/loads against the declared Recharts 2 peer range in a temporary directory and verifies the built package can be imported without evaluating unsupported Recharts 3-only APIs.

- [ ] **Step 2: Run the tests and verify RED**

Run: `npm test -- src/index.test.ts scripts/recharts-legacy-smoke.test.ts`

Expected: FAIL because the package version remains `0.9.0` and the smoke runner is absent.

- [ ] **Step 3: Complete bilingual docs**

Document in English and Chinese:

- `FunnelDatum`, `FunnelChartProps`, percentage input rules, stage order, zero stages, and missing-metric behavior.
- all six presets, their presentation-only boundary, spread-based overrides, and tree-shaking.
- the complete Dashboard Pattern and the business application's responsibility for request, alignment, conversion/drop-off calculations, and date switching.
- performance baseline command/results and the Recharts 2 legacy smoke scope.
- README sequence: Metric Cards → Trend → Comparison → Conversion → Funnel.

Keep the lead sentence: `Polaris-style charts for Shopify App analytics and app-owned data.`

- [ ] **Step 4: Prepare version metadata**

After the RED test is observed, run:

```bash
npm version 0.10.0 --no-git-tag-version
```

Export `packageVersion = '0.10.0'` and add a dated `0.10.0` CHANGELOG entry. Do not create a Git tag, push, or publish npm during implementation.

- [ ] **Step 5: Run the complete release gate**

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run build-storybook
npm run benchmark:analytics
npm run recharts:legacy-smoke
npm pack --dry-run --registry=https://registry.npmjs.org/
git diff --check
```

Expected: every command exits `0`; Storybook may retain the known Vite large-chunk warning. Inspect the tarball list to confirm it contains runtime/types/docs but excludes tests, stories, benchmark scripts, and Storybook output.

- [ ] **Step 6: Commit**

```bash
git add README.md README.zh-CN.md docs/api.md docs/api.zh-CN.md docs/usage.md docs/usage.zh-CN.md CHANGELOG.md scripts/recharts-legacy-smoke.mjs scripts/recharts-legacy-smoke.test.ts package.json package-lock.json src/index.ts src/index.test.ts
git commit -m "chore: prepare v0.10.0 shopify analytics"
```

### Task 7: Final branch audit

**Files:**
- Review all changes since `d670395`

- [ ] **Step 1: Audit design coverage**

Confirm every v0.10 acceptance point in `docs/superpowers/specs/2026-08-18-analytics-roadmap-v090-v100-design.md` maps to implementation, tests, Storybook, or documentation. Confirm no SSR/API-freeze/browser-matrix scope from v1.0 leaked into the release except the explicitly planned Recharts 2 smoke test.

- [ ] **Step 2: Review public boundaries**

Confirm Funnel does not compute or reorder metrics, presets contain no data/business behavior, examples do not ship in the package, benchmark code stays outside `dist`, and no new Shopify runtime dependency exists.

- [ ] **Step 3: Run fresh verification**

Run the complete Task 6 release gate again and inspect `git status --short`.

Expected: all checks pass and the worktree is clean.

- [ ] **Step 4: Use the branch-finishing workflow**

Present local merge, push/PR, keep, or discard options. Never tag, push, or publish `0.10.0` without explicit user approval.
