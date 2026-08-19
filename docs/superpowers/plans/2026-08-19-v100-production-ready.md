# v1.0.0 Production Ready Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Freeze a production-ready v1 API and prove SSR/hydration, accessibility, responsive behavior, performance, tree-shaking, and the documented Shopify Admin compatibility matrix.

**Architecture:** Keep every chart as an interactive client component while making package import and initial server markup deterministic. Add one shared accessibility wrapper and one reduced-motion hook rather than duplicating semantics. Keep formatters in a React-free subpath, enforce peer/browser/performance contracts with reproducible scripts, and retain deprecated v0.x aliases through 1.x with a documented v2 removal plan.

**Tech Stack:** React 18.3/19.2, TypeScript 5.4+, Recharts 3, Vitest, React DOM server/hydration, Next.js 16 App Router smoke, Playwright Chromium/Firefox/WebKit, Storybook 10, tsup, Node 20/22/24.

---

### Task 1: Freeze package, peer, and public API boundaries

**Files:**
- Create: `scripts/compatibility-contract.test.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `tsup.config.ts`
- Modify: `vitest.config.ts`
- Modify: `src/index.ts`
- Modify: `src/index.test.ts`
- Delete: `scripts/recharts-legacy-smoke.mjs`
- Delete: `scripts/recharts-legacy-smoke.test.ts`

- [ ] **Step 1: Write failing package-contract tests**

Read `package.json` and assert version `1.0.0`, React/React DOM `>=18.3 <20`, Recharts `>=3 <4`, Node `>=20 <25`, a `./formatters` export pointing at `dist/formatters.js` and `dist/formatters.d.ts`, and no legacy Recharts smoke script. Update `src/index.test.ts` to expect `packageVersion === '1.0.0'` while retaining every v0.10 export.

- [ ] **Step 2: Verify RED**

Run: `npm test -- scripts/compatibility-contract.test.ts src/index.test.ts`

Expected: version/range/subpath assertions fail against v0.10 metadata.

- [ ] **Step 3: Apply the v1 package contract**

Run `npm version 1.0.0 --no-git-tag-version`. Set:

```json
"exports": {
  ".": {"types": "./dist/index.d.ts", "import": "./dist/index.js"},
  "./formatters": {"types": "./dist/formatters.d.ts", "import": "./dist/formatters.js"}
},
"peerDependencies": {
  "@shopify/polaris": ">=12",
  "react": ">=18.3 <20",
  "react-dom": ">=18.3 <20",
  "recharts": ">=3 <4"
},
"engines": {"node": ">=20 <25"}
```

Build with `entry: ['src/index.ts', 'src/formatters/index.ts']`. Exclude `**/.worktrees/**` in Vitest so a parent checkout never runs a nested worktree twice. Remove the Recharts 2 runner/test/script. Keep all deprecated aliases and formatter exports, with removal deferred to v2.

- [ ] **Step 4: Verify GREEN**

Run: `npm test -- scripts/compatibility-contract.test.ts src/index.test.ts && npm run typecheck && npm run build`

Expected: both entries and their declarations build, and all focused tests pass.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsup.config.ts vitest.config.ts src/index.ts src/index.test.ts scripts
git commit -m "chore: freeze v1 package compatibility"
```

### Task 2: Prove SSR, hydration, formatter isolation, and Next.js usage

**Files:**
- Create: `scripts/ssr-smoke.test.tsx`
- Create: `scripts/next-app-smoke.mjs`
- Create: `scripts/next-app-smoke.test.ts`
- Create: `scripts/vite-consumer-smoke.mjs`
- Create: `scripts/vite-consumer-smoke.test.ts`
- Modify: `package.json`

- [ ] **Step 1: Write SSR and hydration tests**

In a Node-environment test, import the root entry and render `TrendChart`, `ComparisonChart`, `ConversionChart`, `ComboChart`, `StackedBarChart`, `DonutChart`, `FunnelChart`, and `MetricCard` with `renderToString`; assert no global `window` or `document` is required and server markup is non-empty. In JSDOM, server-render a representative chart, call `hydrateRoot` with identical props, and assert no hydration-mismatch message reaches `console.error`. Import `@standhigher/charts/formatters` from a packed temporary consumer without React/Recharts installed and verify `formatMoney` works.

- [ ] **Step 2: Verify the formatter isolation test is RED**

Run: `npm run build && npm test -- scripts/ssr-smoke.test.tsx`

Expected: the subpath consumer fails until Task 1's multi-entry package is present; if component SSR already passes, record it as an audited existing guarantee and do not add unnecessary runtime branches.

- [ ] **Step 3: Add a reproducible Next App Router smoke**

The runner must pack the library into a temporary directory, install `next@16.3.1`, `react@19.2.8`, `react-dom@19.2.8`, and `recharts@3.10.1`, then generate:

```tsx
// app/chart.tsx
'use client';
import {TrendChart} from '@standhigher/charts';
export function Chart() {
  const data = [{date: '2026-08-19', revenue: 1}];
  return <TrendChart data={data} series={[{id: 'revenue', label: 'Revenue', data}]} xKey="date" />;
}
```

The server page imports `formatMoney` from `@standhigher/charts/formatters`, renders the value, and composes `<Chart />`. Run `next build`; always remove the temporary directory.

Add a parallel Vite consumer smoke with `vite@8.2.1`, React `19.2.8`, and
Recharts `3.10.1`. It imports the package root and formatter subpath in a small
client entry and runs `vite build`, independently of Storybook's builder.

- [ ] **Step 4: Verify SSR/Next GREEN**

Run: `npm test -- scripts/ssr-smoke.test.tsx scripts/next-app-smoke.test.ts scripts/vite-consumer-smoke.test.ts && npm run next:smoke && npm run vite:smoke`

Expected: render, hydration, React-free formatter import, and Next production build all exit `0`.

- [ ] **Step 5: Commit**

```bash
git add scripts/ssr-smoke.test.tsx scripts/next-app-smoke.mjs scripts/next-app-smoke.test.ts scripts/vite-consumer-smoke.mjs scripts/vite-consumer-smoke.test.ts package.json package-lock.json
git commit -m "test: establish v1 ssr and next compatibility"
```

### Task 3: Add one stable accessibility contract

**Files:**
- Create: `src/components/ChartAccessibility/ChartAccessibility.tsx`
- Create: `src/components/ChartAccessibility/ChartAccessibility.test.tsx`
- Create: `src/components/ChartAccessibility/index.ts`
- Create: `src/hooks/usePrefersReducedMotion.ts`
- Create: `src/hooks/usePrefersReducedMotion.test.tsx`
- Modify: `src/types/chart.ts`
- Modify: `src/components/ChartLocalization/ChartLocalization.tsx`
- Modify: `src/components/ChartState/ChartState.tsx`
- Modify: every primary chart component and focused test
- Modify: `src/index.ts`

- [ ] **Step 1: Write failing accessibility-contract tests**

Define the desired public contract:

```ts
interface ChartAccessibilityOptions {
  label: string;
  description?: ReactNode;
  dataTable?: ReactNode;
}
```

Assert every primary chart accepts `accessibility`, exposes a named `region`, connects a hidden description, and keeps a caller-owned table in the accessibility tree. The library must never derive table cells or business summaries. Assert all legends use localized `messages.chartLegend`. Assert Funnel's focus tooltip still mirrors visible values.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/components/ChartAccessibility src/components/TrendChart src/components/DonutChart src/components/FunnelChart`

Expected: the shared wrapper/type and localized legend contract do not exist.

- [ ] **Step 3: Implement the shared wrapper and localization**

`ChartAccessibilityRegion` uses `useId`, `role="region"`, `aria-label`, and `aria-describedby`. It visually hides `description` and `dataTable` with the standard one-pixel clipping style while retaining semantic descendants. Add optional `accessibility?: ChartAccessibilityOptions` to Trend, Combo, StackedBar, Donut, and Funnel; Comparison/Conversion inherit it through Trend props. Add `chartLegend: 'Chart legend'` to `ChartMessages` and replace every hard-coded legend label.

- [ ] **Step 4: Enforce reduced motion across state and chart animation**

Move the existing media-query logic into `usePrefersReducedMotion`. Use it in ChartState and Funnel; Funnel stage width transition becomes `none` when reduced motion is active. Pass `isAnimationActive={false}` to Recharts Area/Line/Bar/Pie when reduced motion is active, after consumer-controlled props so accessibility wins.

- [ ] **Step 5: Add contrast and keyboard assertions**

Extend theme tests with WCAG relative-luminance helpers. Assert text/tooltip colors are at least 4.5:1 on their surfaces and graphical palette/status colors are at least 3:1 where they carry meaning. Assert Recharts chart props retain its default accessibility layer and cannot be disabled through protected controlled props.

- [ ] **Step 6: Verify GREEN and commit**

Run: `npm test -- src/components src/theme && npm run typecheck && npm run lint`

```bash
git add src/components src/hooks src/types src/theme src/index.ts
git commit -m "feat: stabilize chart accessibility contract"
```

### Task 4: Stabilize responsive and theme behavior

**Files:**
- Modify: `src/theme/chartTheme.ts`
- Modify: `src/theme/chartTheme.test.ts`
- Create: `src/components/ResponsiveContract.test.tsx`
- Modify: relevant chart styles only when a failing test proves overflow
- Modify: Storybook narrow/long-content stories

- [ ] **Step 1: Write failing theme immutability and responsive tests**

Assert `chartTheme` and every nested object/array are frozen and typed readonly. Render each primary chart inside 320px, 768px, and 1280px containers with long translated titles/legend labels, large currency values, null/zero/negative values, and assert outer wrappers use `width: 100%`, `minWidth: 0` where flex/grid children need it, and legends wrap without fixed widths.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/theme/chartTheme.test.ts src/components/ResponsiveContract.test.tsx`

Expected: theme mutation/freeze assertions fail and any real overflow contract gaps are identified.

- [ ] **Step 3: Freeze the theme and fix only proven layout gaps**

Change `ChartTheme` fields to readonly, expose `readonly string[]`, and construct `chartTheme` with frozen nested objects/arrays. Add `boxSizing: 'border-box'`, `minWidth: 0`, or wrapping styles only where the focused test demonstrates a gap. Preserve the current theme values and do not introduce a Theme Provider.

- [ ] **Step 4: Verify GREEN and commit**

Run: `npm test -- src/theme/chartTheme.test.ts src/components/ResponsiveContract.test.tsx && npm run typecheck && npm run build-storybook`

```bash
git add src/theme src/components/ResponsiveContract.test.tsx src/components/**/*.stories.tsx
git commit -m "fix: stabilize responsive theme behavior"
```

### Task 5: Bound repeated work and freeze performance budgets

**Files:**
- Modify: `src/components/ChartLocalization/ChartLocalization.tsx`
- Modify: chart adapters/components with derived data
- Modify: `scripts/benchmark-analytics.mjs`
- Modify: `scripts/benchmark-analytics.test.ts`
- Create: `docs/performance/v1.0-budget.md`
- Modify: `package.json`

- [ ] **Step 1: Write failing memoization and budget tests**

Use a React Profiler/probe to show a parent rerender with unchanged localization inputs does not notify context consumers. Spy on percent normalization and derived-series helpers to prove stable data/series references do not recompute across unrelated rerenders. Add `assertBenchmarkBudgets(report)` tests for every matrix cell and bundle measurements.

- [ ] **Step 2: Verify RED**

Run: `npm test -- src/components/ChartLocalization scripts/benchmark-analytics.test.ts`

Expected: context identity/recomputation or absent-budget assertions fail.

- [ ] **Step 3: Implement bounded memoization**

Memoize localization provider values/messages. Use `useMemo` for series colors, normalized percentage/funnel data, donut slices, and format-axis derivation when dependencies are referentially stable. Do not cache across component instances or mutate caller data.

- [ ] **Step 4: Enforce reproducible release budgets**

Fail `benchmark:analytics` when any cell is missing/non-finite, `dist/index.js + dist/formatters.js` exceeds 100 KiB raw or 18 KiB gzip, any cell exceeds 2,500ms initial/update, or heap delta exceeds 256 MiB. These intentionally broad local/CI ceilings catch order-of-magnitude regressions; browser interaction remains a separate Playwright gate.

- [ ] **Step 5: Verify and record**

Run the benchmark twice. Document environment, thresholds, both-entry bundle accounting, and JSDOM limitations in `docs/performance/v1.0-budget.md`.

- [ ] **Step 6: Commit**

```bash
git add src/components scripts/benchmark-analytics.mjs scripts/benchmark-analytics.test.ts docs/performance/v1.0-budget.md package.json
git commit -m "perf: enforce v1 analytics budgets"
```

### Task 6: Enforce peer, browser, and CI compatibility matrices

**Files:**
- Create: `scripts/peer-matrix-smoke.mjs`
- Create: `scripts/peer-matrix-smoke.test.ts`
- Create: `scripts/serve-storybook.mjs`
- Create: `playwright.config.ts`
- Create: `tests/browser/analytics.spec.ts`
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Write failing peer-matrix tests**

Generate two temporary packed-package consumers:

```ts
[
  {react: '18.3.1', reactDom: '18.3.1', recharts: '3.10.1'},
  {react: '19.2.8', reactDom: '19.2.8', recharts: '3.10.1'}
]
```

Each imports the root, renders a TrendChart server-side, and imports the formatter subpath. Assert no Recharts 2 matrix remains.

Add a TypeScript declaration matrix that compiles a strict consumer with
TypeScript `5.4.5` and the repository's current compiler. The fixture imports
all primary components, `ChartAccessibilityOptions`, Analytics presets, and
the formatter subpath.

- [ ] **Step 2: Verify RED, then implement the runner**

Run: `npm test -- scripts/peer-matrix-smoke.test.ts`

Expected: missing runner. Implement pack/install/import/render cleanup like the v0.10 legacy runner, but iterate the two supported matrices.

- [ ] **Step 3: Add browser acceptance tests**

Add `@playwright/test@1.62.1`. Serve built Storybook with a small Node static server. In Chromium, Firefox, and WebKit, open the Shopify Analytics Dashboard ready story at 320/768/1280 widths, assert no horizontal overflow, all five section headings and six metric cards, and usable date selection. Add a mobile-Chromium project matching Chrome Android dimensions. Open FunnelChart, focus a stage, assert tooltip details, then emulate reduced motion and assert no funnel segment transition.

- [ ] **Step 4: Update CI**

Quality uses Node 20, 22, and 24. A peer job runs both React matrices plus TypeScript 5.4/current declaration checks. A browser job builds Storybook, installs Playwright Chromium/Firefox/WebKit, and runs `npm run test:browser`. A framework job runs Vite 8 and Next 16 once. Keep npm pack/API/performance checks in the release job; do not run expensive framework builds three times.

- [ ] **Step 5: Verify and commit**

Run: `npm test -- scripts/peer-matrix-smoke.test.ts && npm run compatibility:peers && npm run compatibility:types && npm run test:browser`

```bash
git add scripts playwright.config.ts tests/browser package.json package-lock.json .github/workflows/ci.yml
git commit -m "ci: enforce v1 compatibility matrix"
```

### Task 7: Freeze API reports and complete production documentation

**Files:**
- Create: `scripts/public-api-report.mjs`
- Create: `scripts/public-api-report.test.ts`
- Create: `docs/public-api/index.d.ts`
- Create: `docs/public-api/formatters.d.ts`
- Create: `docs/migration-v1.md`
- Create: `docs/migration-v1.zh-CN.md`
- Create: `docs/upgrade-guide.md`
- Create: `docs/upgrade-guide.zh-CN.md`
- Create: `docs/release-checklist.md`
- Create: `docs/shopify-analytics-patterns.md`
- Create: `docs/shopify-analytics-patterns.zh-CN.md`
- Modify: README/API/Usage EN and ZH
- Modify: `CHANGELOG.md`
- Modify: `package.json`

- [ ] **Step 1: Write failing API-report tests**

The report runner compares built `dist/index.d.ts` and `dist/formatters.d.ts` byte-for-byte with tracked v1 reports. `api:check` fails on unreviewed additions/removals/changes and prints the affected report path. Add a `--write` mode used only for intentional snapshot updates.

- [ ] **Step 2: Verify RED, implement, and write reviewed snapshots**

Run: `npm run build && npm test -- scripts/public-api-report.test.ts`

Expected: missing snapshots/runner. Implement, run `node scripts/public-api-report.mjs --write`, then `npm run api:check`.

- [ ] **Step 3: Complete bilingual documentation**

Document the exact support matrix, SSR-safe client-component promise, Formatter server subpath, accessibility options and caller-owned table boundary, responsive sizes, budgets, deprecated APIs retained through 1.x and removed in v2, Recharts 2 migration, Next/Vite examples, and all public defaults/null semantics. Add migration, upgrade, release/rollback, and Shopify Analytics pattern guides. Include all new files in npm `files`.

- [ ] **Step 4: Add dated v1 changelog and package-content assertions**

The changelog date is `2026-08-19`. Pack tests require runtime/types/new docs and exclude source, tests, stories, scripts, Storybook output, Playwright output, and fixtures.

Update `prepublishOnly` to run lint, tests, typecheck, build, API report check,
Storybook, performance budgets, peer/type compatibility, both framework smokes,
and package dry-run. Browser engines remain a CI release gate rather than being
downloaded during every local publish.

- [ ] **Step 5: Verify and commit**

Run: `npm run api:check && npm run build-storybook && npm pack --dry-run --registry=https://registry.npmjs.org/`

```bash
git add scripts/public-api-report* docs README* CHANGELOG.md package.json package-lock.json
git commit -m "docs: freeze v1 public contract"
```

### Task 8: Final v1 release audit

**Files:**
- Review all changes since `50b8325`

- [ ] **Step 1: Audit scope and public boundaries**

Map every 1.0 acceptance point in the approved roadmap to tests, implementation, CI, or documentation. Confirm no Shopify request/data/calculation layer, Dashboard Framework, Theme Provider, Recharts internals, or React Server Component claim leaked into v1.

- [ ] **Step 2: Run the complete release gate**

```bash
npm test
npm run typecheck
npm run lint
npm run build
npm run api:check
npm run build-storybook
npm run benchmark:analytics
npm run compatibility:peers
npm run compatibility:types
npm run next:smoke
npm run vite:smoke
npm run test:browser
npm pack --dry-run --registry=https://registry.npmjs.org/
git diff --check
```

Expected: every command exits `0`; the known Storybook large-chunk warning is non-blocking.

- [ ] **Step 3: Inspect clean status and finish the branch**

Confirm no `v1.0.0` tag, push, or npm publish occurred. Use the branch-finishing workflow and wait for explicit integration/release approval.
