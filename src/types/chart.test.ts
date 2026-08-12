import type { ChartSeries, ChartTooltipOptions } from './chart';

interface SalesDatum {
  date: string;
  revenue: number;
}

describe('chart types', () => {
  it('allows consumer datum interfaces without index signatures', () => {
    const series: ChartSeries<SalesDatum> = {
      id: 'revenue',
      label: 'Revenue',
      data: [{ date: '2026-08-08', revenue: 1200 }]
    };

    expect(series.data[0].revenue).toBe(1200);
  });

  it('exposes shared tooltip content and formatter options', () => {
    const tooltip: ChartTooltipOptions<SalesDatum> = {
      className: 'analytics-tooltip',
      content: ({ format, payload, series }) => {
        expect(format).toBe('number');
        expect(payload?.[0]?.series?.id).toBe('revenue');
        expect(series[0]?.label).toBe('Revenue');

        return null;
      },
      labelFormatter: (label) => `Date: ${label}`,
      minWidth: 180,
      valueFormatter: (value, item) => `${item?.label}: ${value}`
    };

    expect(tooltip.minWidth).toBe(180);
  });
});
