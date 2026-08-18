# Retry Action Customization Design

## Goal

Allow consumers to replace the chart error-state retry control with any React
node while keeping the existing `onRetry` and `retryLabel` API compatible. The
library-provided retry button should use a neutral black-and-white treatment
instead of the current blue treatment.

## Public API

Add the following optional property to `ChartStateRegionProps` and to the props
for `TrendChart`, `ComboChart`, `StackedBarChart`, and `DonutChart`:

```ts
retryAction?: ReactNode;
```

Each chart passes `retryAction` directly to its shared `ChartStateRegion`.
No `retryButtonClassName`, render callback, or replacement for the complete
error action container is added.

## Rendering Contract

The error panel resolves its action in this order:

1. When `retryAction` is non-nullish, render it unchanged.
2. Otherwise, when `onRetry` exists, render the library-provided retry button
   using `retryLabel` or the localized retry message.
3. Otherwise, render no action.

Passing `retryAction={null}` is equivalent to omitting `retryAction`, so the
default button remains available when `onRetry` is supplied. When a custom
action is rendered, `onRetry` and `retryLabel` are not applied to it; the
consumer owns its behavior and accessibility.

## Default Appearance

Change the shared default retry button to use `chartTheme.text.primary` as its
background and white text. Retain its existing border, radius, typography,
cursor, and spacing so this change does not alter error-panel layout.

## Compatibility

The existing `onRetry` and `retryLabel` behavior remains unchanged when
`retryAction` is absent or null. The new property is optional, so existing
consumers require no changes. All primary chart components expose the same
error-action contract.

## Testing and Documentation

Tests will cover custom-action replacement, custom action interaction, fallback
button behavior, the new default color, and property forwarding through all
four primary charts. Storybook will show the custom action, and the English and
Chinese API and usage documentation plus the changelog will describe the new
property and fallback behavior.
