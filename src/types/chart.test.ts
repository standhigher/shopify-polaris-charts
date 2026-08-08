import type { ChartSeries } from './chart';

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
});
