# Chart Usage Guide

Language: English | [中文](usage.zh-CN.md)

`@standhigher/charts` provides a phase one set of Polaris-style chart primitives for Shopify App dashboards. Use the Storybook overview to compare the components together with realistic dashboard density and static sample data.

## ChartCard

Use `ChartCard` as the standard dashboard card shell around a chart or compact analytical view. It is best for consistent titles, subtitles, headline metrics, trend labels, filters, actions, and loading, empty, stale, permission, and error states.

## TrendChart

Use `TrendChart` when the user needs to see change over time, such as gross sales, net sales, sessions, orders, or customer count by day. Use the line mode for direct comparisons and the area mode when overall movement should carry more visual weight.

## DonutChart

Use `DonutChart` for a small number of parts-of-a-whole categories, such as traffic source mix, order status share, or revenue by plan. Keep categories limited so the legend stays scannable in a dashboard card.

## StackedBarChart

Use `StackedBarChart` when comparing category totals and their composition at the same time, such as fulfilled, pending, and returned orders by sales channel. It works best when every category shares the same series definitions.

## ComboChart

Use `ComboChart` when two related measures need to be read together, such as order volume and conversion rate. Use bars for volume and a line for the rate or benchmark so the relationship is visible without implying both measures use the same scale.

## Local Preview

Run Storybook to inspect the examples:

```bash
npm run storybook
```

Then open the `Examples/Phase One Overview` story.

For detailed props, defaults, and AI-readable implementation guidance, see
[api.md](api.md).
