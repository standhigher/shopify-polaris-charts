import * as Charts from './index';

describe('@standhigher/charts package entry', () => {
  it('can be imported from the package entry', () => {
    expect(Charts.packageName).toBe('@standhigher/charts');
    expect(Charts.packageVersion).toBe('0.8.0');
  });

  it('exports the v0.7 shared foundation APIs', () => {
    expect(Charts.ChartLocalizationProvider).toBeDefined();
    expect(Charts.ChartStateRegion).toBeDefined();
    expect(Charts.MetricCard).toBeDefined();
    expect(Charts.formatMoney).toBeDefined();
    expect(Charts.formatPercentage).toBeDefined();
  });
});
