import { render, screen } from '@testing-library/react';

import { ComboChart } from './ComboChart';

const orderConversionData = [
  { date: '2026-07-01', orders: 138, conversionRate: 0.032 },
  { date: '2026-07-02', orders: 156, conversionRate: 0.036 },
  { date: '2026-07-03', orders: 171, conversionRate: 0.041 }
];

describe('ComboChart', () => {
  it('renders bar and line series labels', () => {
    render(
      <ComboChart
        title="Orders and conversion"
        data={orderConversionData}
        xKey="date"
        series={[
          { id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar' },
          { id: 'conversionRate', label: 'Conversion rate', data: orderConversionData, type: 'line' }
        ]}
        xFormat="date"
        height={320}
      />
    );

    expect(screen.getByRole('heading', { name: 'Orders and conversion' })).toBeVisible();
    expect(screen.getByText('Orders')).toBeVisible();
    expect(screen.getByText('Conversion rate')).toBeVisible();
  });

  it('renders mixed-format legend values per series', () => {
    render(
      <ComboChart
        data={orderConversionData}
        xKey="date"
        series={[
          { id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar', format: 'number' },
          {
            id: 'conversionRate',
            label: 'Conversion rate',
            data: orderConversionData,
            type: 'line',
            format: 'percent'
          }
        ]}
      />
    );

    expect(screen.getByText('138')).toBeVisible();
    expect(screen.getByText('3.2%')).toBeVisible();
  });

  it('requires all alternate-axis series to share one format', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      expect(() =>
        render(
          <ComboChart
            data={[{ date: '2026-07-01', orders: 138, revenue: 12430.4, conversionRate: 0.032 }]}
            xKey="date"
            series={[
              { id: 'orders', label: 'Orders', data: [], type: 'bar', format: 'number' },
              { id: 'revenue', label: 'Revenue', data: [], type: 'bar', format: 'currency' },
              { id: 'conversionRate', label: 'Conversion rate', data: [], type: 'line', format: 'percent' }
            ]}
          />
        )
      ).toThrow('ComboChart supports one alternate series format');
    } finally {
      consoleError.mockRestore();
    }
  });

  it('renders an empty state when every combo series value is empty', () => {
    render(
      <ComboChart
        title="Orders and conversion"
        data={[{ date: '2026-07-01', orders: null, conversionRate: '' }]}
        xKey="date"
        series={[
          { id: 'orders', label: 'Orders', data: [], type: 'bar' },
          { id: 'conversionRate', label: 'Conversion rate', data: [], type: 'line', format: 'percent' }
        ]}
        emptyMessage="No conversion data"
      />
    );

    expect(screen.getByRole('heading', { name: 'Orders and conversion' })).toBeVisible();
    expect(screen.getByText('No conversion data')).toBeVisible();
  });
});
