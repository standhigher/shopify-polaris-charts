# Changelog

All notable changes to `@standhigher/charts` are documented in this file.

This project follows semantic versioning while the public API is stabilizing.

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
