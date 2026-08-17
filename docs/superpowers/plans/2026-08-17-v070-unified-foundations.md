# v0.7.0 Unified Foundations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver reusable chart content states, MetricCard, localized component defaults, canonical display formatters, and a backwards-compatible v0.7.0 public API.

**Architecture:** A `ChartLocalizationProvider` supplies copy and formatting defaults; `ChartState` owns chart-area state rendering; each chart keeps its data validity and Recharts bindings. `MetricCard` is a standalone presentational component sharing the theme and localization context. Legacy type and formatter exports remain aliases or wrappers.

**Tech Stack:** React 18, TypeScript, Recharts, Vitest, Testing Library, Storybook, tsup.

---

### Task 1: Canonical types, localization, and state container

**Files:**
- Create: `src/components/ChartLocalization/ChartLocalization.tsx`
- Create: `src/components/ChartLocalization/ChartLocalization.test.tsx`
- Create: `src/components/ChartLocalization/index.ts`
- Create: `src/components/ChartState/ChartState.tsx`
- Create: `src/components/ChartState/ChartState.test.tsx`
- Create: `src/components/ChartState/ChartState.stories.tsx`
- Create: `src/components/ChartState/index.ts`
- Modify: `src/types/chart.ts`, `src/types/index.ts`, `src/index.ts`, `src/theme/chartTheme.ts`

- [ ] Add failing tests for provider default/override precedence, loading/empty/error/retry roles, reveal mounting, and reduced-motion behavior.
- [ ] Implement canonical state types and deprecated aliases.
- [ ] Implement the merged localization context and provider.
- [ ] Implement `ChartState` with the documented resolution inputs and accessibility behavior.
- [ ] Run focused tests and typecheck.

### Task 2: Apply one chart-state contract to all primary charts

**Files:**
- Modify: `src/components/TrendChart/TrendChart.tsx`, `TrendChart.test.tsx`, `TrendChart.stories.tsx`
- Modify: `src/components/ComboChart/ComboChart.tsx`, `ComboChart.test.tsx`, `ComboChart.stories.tsx`
- Modify: `src/components/StackedBarChart/StackedBarChart.tsx`, `StackedBarChart.test.tsx`, `StackedBarChart.stories.tsx`
- Modify: `src/components/DonutChart/DonutChart.tsx`, `DonutChart.test.tsx`, `DonutChart.stories.tsx`
- Modify: `src/components/ChartCard/ChartCard.tsx`, `ChartCard.test.tsx`

- [ ] Add failing state parity tests for each chart, including explicit error/retry and ready-with-no-data behavior.
- [ ] Replace TrendChart’s local panels with `ChartState` while preserving legacy props and aliases.
- [ ] Add the same props to ComboChart, StackedBarChart, and DonutChart.
- [ ] Use localization defaults in ChartCard’s existing card-level states.
- [ ] Add discoverable Storybook state examples and run focused tests.

### Task 3: Add MetricCard

**Files:**
- Create: `src/components/MetricCard/MetricCard.tsx`
- Create: `src/components/MetricCard/MetricCard.test.tsx`
- Create: `src/components/MetricCard/MetricCard.stories.tsx`
- Create: `src/components/MetricCard/index.ts`
- Modify: `src/index.ts`, `src/examples/PhaseOneOverview.stories.tsx`, `src/examples/PhaseOneOverview.test.tsx`

- [ ] Add failing tests for static content, loading skeleton, positive/negative accessible trends, and provider copy.
- [ ] Implement the minimal themed card with visually hidden trend direction text.
- [ ] Replace the example’s local metric tiles with five MetricCard instances.
- [ ] Run focused tests and typecheck.

### Task 4: Add canonical display formatters

**Files:**
- Modify: `src/formatters/formatters.ts`, `src/formatters/index.ts`, `src/formatters/formatters.test.ts`, `src/index.test.ts`

- [ ] Add failing tests for locale/currency defaults, compact values, ratio versus percent basis, date timezone, and legacy-output compatibility.
- [ ] Implement pure wrappers and their option types.
- [ ] Mark old formatter exports deprecated without runtime warnings.
- [ ] Run formatter and root-entry tests.

### Task 5: Publishable API and v0.7.0 documentation

**Files:**
- Modify: `package.json`, `package-lock.json`, `src/index.ts`, `src/index.test.ts`
- Modify: `README.md`, `README.zh-CN.md`, `docs/api.md`, `docs/api.zh-CN.md`, `docs/usage.md`, `docs/usage.zh-CN.md`, `CHANGELOG.md`

- [ ] Add failing root-export checks for new components and formatter helpers.
- [ ] Set v0.7.0 and make Polaris peer metadata optional.
- [ ] Document Provider precedence, percentage basis, deprecated aliases, and all new public props in both languages.
- [ ] Run lint, typecheck, all tests, package build, Storybook build, and npm pack dry run.
