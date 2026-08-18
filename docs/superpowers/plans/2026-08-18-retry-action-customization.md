# Retry Action Customization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add custom retry action nodes to every primary chart and change the fallback retry button to black.

**Architecture:** `ChartStateRegion` remains the sole error-action renderer. Each chart adds a `retryAction?: ReactNode` prop and forwards it unchanged; the shared renderer chooses a custom node first and otherwise preserves the existing `onRetry` fallback.

**Tech Stack:** React 18, TypeScript, Vitest, Testing Library, Storybook.

---

### Task 1: Define and test the shared rendering contract

**Files:**
- Modify: `src/components/ChartState/ChartState.test.tsx`
- Modify: `src/components/ChartState/ChartState.tsx`

- [ ] **Step 1: Write failing tests**

Add tests that render `retryAction={<button>Contact support</button>}` together with `onRetry`, verify only the custom action is present, and verify its click handler runs. Add a fallback-button assertion for `background: chartTheme.text.primary` and `color: #ffffff`.

- [ ] **Step 2: Verify the tests fail**

Run: `npm test -- src/components/ChartState/ChartState.test.tsx`
Expected: FAIL because `retryAction` is not a recognized prop and the fallback button is still blue.

- [ ] **Step 3: Implement the shared API**

Add `retryAction?: ReactNode` to `ChartStateRegionProps`, destructure it, change the action background to `chartTheme.text.primary`, and render:

```tsx
{retryAction ?? (onRetry ? (
  <button onClick={onRetry} style={styles.action} type="button">
    {retryLabel ?? messages.retry}
  </button>
) : null)}
```

- [ ] **Step 4: Verify the focused tests pass**

Run: `npm test -- src/components/ChartState/ChartState.test.tsx`
Expected: all ChartState tests PASS.

### Task 2: Expose the property through all primary charts

**Files:**
- Modify: `src/components/TrendChart/TrendChart.test.tsx`
- Modify: `src/components/TrendChart/TrendChart.tsx`
- Modify: `src/components/ComboChart/ComboChart.test.tsx`
- Modify: `src/components/ComboChart/ComboChart.tsx`
- Modify: `src/components/StackedBarChart/StackedBarChart.test.tsx`
- Modify: `src/components/StackedBarChart/StackedBarChart.tsx`
- Modify: `src/components/DonutChart/DonutChart.test.tsx`
- Modify: `src/components/DonutChart/DonutChart.tsx`

- [ ] **Step 1: Write failing forwarding tests**

For each chart, render `state="error"` with `retryAction={<a href="#support">Contact support</a>}` and assert that the link is visible in the alert.

- [ ] **Step 2: Verify the tests fail**

Run: `npm test -- src/components/TrendChart/TrendChart.test.tsx src/components/ComboChart/ComboChart.test.tsx src/components/StackedBarChart/StackedBarChart.test.tsx src/components/DonutChart/DonutChart.test.tsx`
Expected: FAIL because chart prop interfaces do not accept or forward `retryAction`.

- [ ] **Step 3: Add and forward the property**

In each chart props interface add:

```ts
retryAction?: ReactNode;
```

Destructure the property and pass `retryAction={retryAction}` to `ChartStateRegion`.

- [ ] **Step 4: Verify the chart tests pass**

Run the four-file command from Step 2.
Expected: all focused chart tests PASS.

### Task 3: Document and demonstrate the API

**Files:**
- Modify: `src/components/ChartState/ChartState.stories.tsx`
- Modify: `docs/api.md`
- Modify: `docs/api.zh-CN.md`
- Modify: `docs/usage.md`
- Modify: `docs/usage.zh-CN.md`
- Modify: `CHANGELOG.md`

- [ ] **Step 1: Add a Storybook example**

Add an error-state story whose `retryAction` is a consumer-owned black-outline button or link with its own click behavior.

- [ ] **Step 2: Update public documentation**

Document `retryAction?: ReactNode`, its precedence over `onRetry`/`retryLabel`, nullish fallback behavior, availability on all four charts, and the black fallback button in both languages. Add an unreleased changelog entry.

- [ ] **Step 3: Run full verification**

Run: `npm test && npm run typecheck && npm run lint && npm run build && npm run build-storybook`
Expected: all tests PASS and every command exits 0.

- [ ] **Step 4: Commit implementation**

```bash
git add src/components docs CHANGELOG.md
git commit -m "feat: customize chart retry actions"
```
