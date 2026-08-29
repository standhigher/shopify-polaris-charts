# Changelog

All notable changes to `@standhigher/charts` are documented in this file.

This project follows semantic versioning.

## 1.2.1 - 2026-08-29

### Fixed

- Fixed date-axis trend charts so unsorted date input is rendered chronologically, and hover/tooltip dates stay aligned with the visible point sequence.

## 1.2.0 - 2026-08-25

### Added

- Added a single full-length dashed overlay line under gapped line series when breakpoint connection is enabled, so gaps read as smooth dashed bridges while the solid line keeps its breaks (`TrendChart`, `ComboChart`).
- Added width-aware x-axis tick density: the axis always shows the first and last points and spaces the middle ticks evenly based on label width and chart width, dropping labels only when they would collide.
- Added a monthly (30-day) demo story and browser coverage for endpoint-anchored, collision-free x-axis ticks.

### Changed

- Solid line segments of gapped series now follow the full-data smooth monotone curve (matching the dashed overlay) instead of straight two-point lines, and keep the entrance draw-in animation.
- Isolated single observations render with a dot radius equal to the line width (previously half), so they stay visible next to the line.

## 1.1.1 - 2026-08-25

### Fixed

- Prevented mouse clicks on accessible charts from leaving a browser focus outline while preserving keyboard focus.
- Synchronized TrendChart and ComboChart dashed gap connectors with the corresponding line animation settings.

## 1.1.0 - 2026-08-24

### Added

- Added opt-in isolated-point dots and configurable dashed gap connectors for line series in `TrendChart` and `ComboChart`.
- Added `ChartGapConnectorOptions`, `ChartDotOptions.show`, and automatic dot-radius support with `r: 'auto'`.
- Added browser, tooltip, dual-axis, and axis-domain regression coverage for gap visualization.

## 1.0.0 - 2026-08-19

### Added

- Added a stable optional chart accessibility contract with named regions,
  caller-owned semantic tables, localized legends, protected Recharts
  accessibility, and reduced-motion behavior.
- Added an isolated `@standhigher/charts/formatters` ESM entry for server usage.
- Added SSR/hydration, Next.js 16 App Router, Vite 8, React 18/19, TypeScript
  5.4/current, and Chromium/Firefox/WebKit compatibility gates.
- Added byte-for-byte public declaration reports, enforced analytics performance
  budgets, migration/upgrade/rollback guides, and Shopify Analytics patterns.

### Changed

- Declared stable support for React/React DOM `>=18.3 <20`, Recharts `>=3 <4`,
  Node tooling `>=20 <25`, and modern evergreen merchant-admin browsers.
- Deep-froze the readonly chart theme, improved responsive shrink/wrap behavior,
  and darkened one green palette value to meet graphical contrast requirements.
- Memoized localization and derived chart presentation data for repeated
  Dashboard renders. Deprecated v0.x aliases remain available through 1.x.

### Removed

- Removed Recharts 2 compatibility; applications must migrate to Recharts 3.

## 0.10.0 - 2026-08-19

### Added

- Added an accessible vertical `FunnelChart` with ratio/percent inputs, shared chart states, keyboard and pointer details, and zero-stage support.
- Added tree-shakeable presentation presets for revenue, orders, conversion, customers, upsell conversion, and funnels.
- Added a complete Shopify Analytics Dashboard example with six KPI cards, date-range variants, partial states, retry, and progressive reveal.
- Added deterministic 5/10/20-chart performance baselines across 100/500/1000 points and a packaged Recharts 2.15.4 compatibility smoke test.

### Changed

- Hardened zero-duration reveal teardown and merged provider formatting defaults with partial ComboChart series options.
- Updated English and Chinese documentation for funnels, presets, dashboard composition, performance measurement, and data-layer boundaries.

## 0.9.0 - 2026-08-18

### Added

- Added `AnalyticsSeries` and percentage-input contracts for typed Analytics presentation adapters.
- Added `ComparisonChart` for aligned current-versus-previous period trends with comparison defaults.
- Added `ConversionChart` for ratio or percent conversion trends, multiple series, and optional target lines.
- Added a responsive Shopify App Analytics Dashboard Storybook example with metric, comparison, and conversion cards.

### Changed

- Positioned the package around Polaris-style Shopify App analytics and app-owned data, with documented data-layer boundaries.
- Hardened percentage normalization and conversion target-field collision handling without mutating caller data.

## 0.8.0 - 2026-08-18

### Added

- Added `retryAction` to `ChartStateRegion`, `TrendChart`, `ComboChart`, `StackedBarChart`, and `DonutChart` for fully custom error actions.

### Changed

- Changed the built-in retry button from blue to a neutral black-and-white style.

## 0.7.0 - 2026-08-17

### Added

- Added `ChartStateRegion` and one shared chart-area state API to `TrendChart`, `ComboChart`, `StackedBarChart`, and `DonutChart`.
- Added `MetricCard` with accessible trend direction and loading skeleton states.
- Added `ChartLocalizationProvider` for localized copy and component formatting defaults.
- Added `formatMoney`, `formatPercentage`, `formatNumber`, `formatCompactNumber`, and `formatDate`.

### Changed

- Made `@shopify/polaris` an optional peer dependency; the package has no Polaris runtime import.
- Deprecated `ChartInlineState`, Trend-specific reveal/skeleton option types, and `formatChart*` helpers in favor of canonical v0.7 names while retaining compatibility.

## 0.6.0 - 2026-08-17

### Added

- Added `ChartSkeletonLayout` grid density controls with `columns`, `gap`, `className`, and `style`.
- Added `ChartRevealRegion` `mode="overlay"` to keep chart content mounted behind a skeleton overlay during reveal transitions.
- Added `ChartRevealRegion` `minHeight`, `className`, and `style` options for dashboard-level skeleton layout control.
- Added dedicated Storybook examples for two-column dashboard skeletons and overlay reveal behavior.
- Updated English and Chinese API/usage documentation for the enhanced dashboard skeleton and reveal APIs.

## 0.5.0 - 2026-08-17

### Added

- Added per-series `strokeDasharray`, `strokeWidth`, and `opacity` support for `TrendChart` revenue comparisons.
- Added chart-area `TrendChart` loading, empty, and error states with retry action support.
- Added `TrendChart` reveal overlay support to keep charts mounted during loading transitions.
- Added `ChartSkeletonLayout` and `ChartRevealRegion` for dashboard-level phased chart reveal.
- Added Storybook examples and English/Chinese docs for revenue comparison, inline retry, skeleton loading, reveal overlay, and dashboard phased reveal.

## 0.4.0 - 2026-08-13

### Added

- Added controlled Recharts props escape hatches for `TrendChart`, `StackedBarChart`, and `ComboChart`, including protected chart data, series identity, axis identity, and tooltip content bindings.

## 0.3.0 - 2026-08-12

### Added

- Added Cartesian chart tooltip content, label and value formatter, minimum-width, and class-name customization for `TrendChart`, `StackedBarChart`, and `ComboChart`.

## 0.2.0 - 2026-08-11

### Added

- Added npm package keywords, homepage, issue tracker, and package author metadata.
- Added npm and GitHub visibility links, status badges, component overview, compatibility information, and package quality notes to the English and Chinese README files.
- Added `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, issue templates, and a pull request template for external contributors and package consumers.

### Changed

- Included `CHANGELOG.md` in the npm package contents.

## 0.1.2 - 2026-08-11

### Added

- Added chart customization options for legends, axes, grid, margins, tooltip cursor behavior, and line dot controls.
- Added additional Storybook examples and AI-readable API documentation for chart customization.

## 0.1.1 - 2026-08-08

### Added

- Published the initial public npm package release for reusable Polaris-style React chart components.
