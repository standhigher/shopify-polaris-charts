import type {
  AnalyticsFunnelPreset,
  AnalyticsSeriesPreset,
  AnalyticsTrendPreset
} from './types';

const primaryTextColor = '#202223';
const secondaryTextColor = '#6d7175';
const blue = '#2c6ecb';
const green = '#008060';
const gold = '#b98900';
const purple = '#5c6ac4';

const freezeSeries = (series: AnalyticsSeriesPreset) => Object.freeze({ ...series });

const freezeTrendPreset = (preset: AnalyticsTrendPreset): AnalyticsTrendPreset =>
  Object.freeze({
    ...preset,
    axis: Object.freeze({ ...preset.axis }),
    comparisonSeries: preset.comparisonSeries
      ? freezeSeries(preset.comparisonSeries)
      : undefined,
    currentSeries: freezeSeries(preset.currentSeries),
    formatOptions: preset.formatOptions
      ? Object.freeze({ ...preset.formatOptions })
      : undefined
  });

const comparisonSeries: AnalyticsSeriesPreset = {
  color: secondaryTextColor,
  label: 'Previous period',
  opacity: 0.64,
  strokeDasharray: '6 4',
  strokeWidth: 2
};

export const revenueTrendPreset = /* @__PURE__ */ freezeTrendPreset({
  axis: { format: 'currency' },
  comparisonSeries,
  currentSeries: {
    color: primaryTextColor,
    label: 'Current period',
    strokeWidth: 2
  },
  format: 'currency'
});

export const orderTrendPreset = /* @__PURE__ */ freezeTrendPreset({
  axis: { format: 'number' },
  comparisonSeries,
  currentSeries: {
    color: blue,
    label: 'Current period',
    strokeWidth: 2
  },
  format: 'number'
});

export const conversionTrendPreset = /* @__PURE__ */ freezeTrendPreset({
  axis: { format: 'percent' },
  currentSeries: {
    color: green,
    label: 'Conversion rate',
    strokeWidth: 2
  },
  format: 'percent'
});

export const customerTrendPreset = /* @__PURE__ */ freezeTrendPreset({
  axis: { format: 'compact' },
  comparisonSeries,
  currentSeries: {
    color: purple,
    label: 'Current period',
    strokeWidth: 2
  },
  format: 'compact'
});

export const upsellConversionPreset = /* @__PURE__ */ freezeTrendPreset({
  axis: { format: 'percent' },
  currentSeries: {
    color: gold,
    label: 'Upsell conversion',
    strokeWidth: 2
  },
  format: 'percent'
});

export const funnelPreset: AnalyticsFunnelPreset = /* @__PURE__ */ Object.freeze({
  colors: /* @__PURE__ */ Object.freeze([
    primaryTextColor,
    blue,
    green,
    gold
  ]),
  format: 'compact',
  percentageInput: 'ratio'
});
