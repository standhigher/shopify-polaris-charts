# v0.7.0 Unified Foundations Design

## Goal

Add a shared, accessible chart-content state API, a presentational metric card,
localized component copy and locale-aware component defaults, and canonical
display formatters without broadening the library into a dashboard framework.

## State model

`ChartState` is a public render wrapper for `ready`, `loading`, `empty`, and
`error`. Each chart resolves its own data validity before passing an explicit
content state to the wrapper. An explicit non-ready state wins; otherwise empty
data resolves to `empty`. The wrapper owns the standard skeleton, empty panel,
error panel/retry button, ARIA roles, and a reveal overlay. Reveal keeps ready
children mounted and fades the overlay before unmounting it; reduced-motion
users see no timed animation.

`ChartCardState` becomes the canonical card-level state type. The existing
`ChartState`, `ChartInlineState`, `TrendChartSkeletonOptions`, and
`TrendChartRevealOptions` names remain deprecated aliases through v1.0.
`no-permission` and `stale` stay card-level states.

## Localization and formatting defaults

`ChartLocalizationProvider` is a lightweight React context, not a dashboard
provider. It supplies partial translated messages plus default `locale`,
`timeZone`, and `currency` for component formatting. Explicit chart and
series `formatOptions` override provider defaults, which override `en-US` and
`USD`. Standalone formatters remain pure functions and never read React
context. Percentage input basis is a data contract and must be explicit:
`ratio` is the default, while `percent` divides an already-percent value by
100 before Intl formatting.

## MetricCard

`MetricCard` accepts formatted display nodes for title, value, comparison, and
an optional trend. It accepts `ready` and `loading` states only; loading renders
an accessible skeleton. A trend has independent `direction` and optional visual
`tone`, so business metrics such as costs can use a down arrow with a positive
tone. Direction is announced in visually hidden text, so color is not the only
carrier of meaning.

## Compatibility and dependency contract

The existing `formatChart*`, `formatChartValue`, and `chartFormatters` exports
remain functional and receive JSDoc deprecation notices. Canonical display
formatters are `formatMoney`, `formatPercentage`, `formatNumber`,
`formatCompactNumber`, and `formatDate`.

The library has no Polaris runtime imports. `@shopify/polaris` therefore becomes
an optional peer dependency; React, React DOM, and Recharts remain required
peers. No Shopify API, persistence, calculation, or dashboard orchestration is
added.
