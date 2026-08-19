import {
  conversionTrendPreset,
  customerTrendPreset,
  funnelPreset,
  orderTrendPreset,
  revenueTrendPreset,
  upsellConversionPreset
} from './presets';

const presets = [
  revenueTrendPreset,
  orderTrendPreset,
  conversionTrendPreset,
  customerTrendPreset,
  upsellConversionPreset,
  funnelPreset
];

describe('Analytics presets', () => {
  it('provides presentation defaults for every planned Shopify analytics scenario', () => {
    expect(revenueTrendPreset).toMatchObject({
      axis: { format: 'currency' },
      comparisonSeries: { label: 'Previous period', opacity: 0.64, strokeDasharray: '6 4' },
      currentSeries: { label: 'Current period' },
      format: 'currency'
    });
    expect(orderTrendPreset).toMatchObject({ axis: { format: 'number' }, format: 'number' });
    expect(customerTrendPreset).toMatchObject({ axis: { format: 'compact' }, format: 'compact' });
    expect(conversionTrendPreset).toMatchObject({
      axis: { format: 'percent' },
      currentSeries: { label: 'Conversion rate' },
      format: 'percent'
    });
    expect(upsellConversionPreset).toMatchObject({
      currentSeries: { label: 'Upsell conversion' },
      format: 'percent'
    });
    expect(funnelPreset).toMatchObject({ format: 'compact', percentageInput: 'ratio' });
    expect(funnelPreset.colors.length).toBeGreaterThanOrEqual(4);
  });

  it('contains presentation data only', () => {
    const serialized = JSON.stringify(presets);

    for (const forbiddenKey of ['data', 'dataKey', 'fetch', 'calculate', 'shopify']) {
      expect(serialized.toLowerCase()).not.toContain(`"${forbiddenKey.toLowerCase()}"`);
    }
  });

  it('freezes top-level and nested values', () => {
    for (const preset of presets) {
      expect(Object.isFrozen(preset)).toBe(true);
      for (const value of Object.values(preset)) {
        if (typeof value === 'object' && value !== null) {
          expect(Object.isFrozen(value)).toBe(true);
        }
      }
    }
  });

  it('supports local spread overrides without changing the shared preset', () => {
    const overridden = {
      ...revenueTrendPreset,
      currentSeries: { ...revenueTrendPreset.currentSeries, color: '#000000' }
    };

    expect(overridden.currentSeries.color).toBe('#000000');
    expect(revenueTrendPreset.currentSeries.color).not.toBe('#000000');
    expect(overridden.comparisonSeries).toBe(revenueTrendPreset.comparisonSeries);
  });
});
