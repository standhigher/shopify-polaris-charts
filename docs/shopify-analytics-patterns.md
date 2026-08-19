# Shopify App analytics patterns

Use the library as a presentation boundary:

```text
Shopify/API sources -> application fetch/alignment/calculation -> @standhigher/charts -> Recharts
```

- KPI row: six `MetricCard`s for Revenue, Orders, Conversion Rate, AOV,
  Customers, and Upsell Conversion.
- Trend: `TrendChart` plus a presentation preset for one period.
- Comparison: one aligned datum containing current and previous fields, rendered
  by `ComparisonChart`. The application owns period alignment.
- Conversion: caller-calculated ratios or percentages rendered by
  `ConversionChart`; targets use the same declared basis.
- Funnel: ordered, caller-calculated vertical stages rendered by `FunnelChart`.

Keep independent loading/error state per card. A localized failure should not
replace ready metrics or unrelated charts. Provide contextual retry labels or a
custom `retryAction`. For accessibility, supply a concise chart label and, where
raw values are needed, an application-authored semantic table. Do not duplicate
the visible dashboard as a generated framework or move Shopify requests,
storage, aggregation, attribution, or business conclusions into this package.
