import * as Charts from './index';

describe('@standhigher/charts package entry', () => {
  it('can be imported from the package entry', () => {
    expect(Charts.packageName).toBe('@standhigher/charts');
    expect(Charts.packageVersion).toBe('1.2.2');
  });

  it('exports the v0.7 shared foundation APIs', () => {
    expect(Charts.ChartLocalizationProvider).toBeDefined();
    expect(Charts.ChartStateRegion).toBeDefined();
    expect(Charts.MetricCard).toBeDefined();
    expect(Charts.formatMoney).toBeDefined();
    expect(Charts.formatPercentage).toBeDefined();
  });

  it('exports analytics helpers', () => {
    expect(Charts.createAnalyticsSeries).toBeDefined();
    expect(Charts.normalizePercentageData).toBeDefined();
  });

  it('exports ComparisonChart', () => {
    expect(Charts.ComparisonChart).toBeDefined();
  });

  it('exports ConversionChart', () => {
    expect(Charts.ConversionChart).toBeDefined();
  });

  it('exports FunnelChart', () => {
    expect(Charts.FunnelChart).toBeDefined();
    expect(Charts.normalizeFunnelData).toBeDefined();
  });

  it('exports Shopify analytics presets', () => {
    expect(Charts.revenueTrendPreset).toBeDefined();
    expect(Charts.orderTrendPreset).toBeDefined();
    expect(Charts.conversionTrendPreset).toBeDefined();
    expect(Charts.customerTrendPreset).toBeDefined();
    expect(Charts.upsellConversionPreset).toBeDefined();
    expect(Charts.funnelPreset).toBeDefined();
  });
});
