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
    expect(screen.getAllByText('3.2%')[0]).toBeVisible();
  });

  it('hides the built-in legend when showLegend is false', () => {
    render(
      <ComboChart
        data={orderConversionData}
        xKey="date"
        series={[{ id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar' }]}
        showLegend={false}
      />
    );

    expect(screen.queryByLabelText('Chart legend')).not.toBeInTheDocument();
  });

  it('accepts cartesian and line presentation options without changing render output', () => {
    render(
      <ComboChart
        data={orderConversionData}
        xKey="date"
        series={[
          { id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar' },
          { id: 'conversionRate', label: 'Conversion rate', data: orderConversionData, type: 'line', format: 'percent' }
        ]}
        margin={{ left: -8 }}
        yAxis={{ domain: [0, 200], ticks: [0, 100, 200], width: 56 }}
        xAxis={{ axisLine: false, tickLine: false, minTickGap: 0 }}
        grid={{ horizontal: true, vertical: false }}
        tooltip={{ cursor: { strokeDasharray: '3 3' } }}
        line={{ dot: false, activeDot: { r: 3 } }}
      />
    );

    expect(screen.getByText('Orders')).toBeVisible();
    expect(screen.getByText('Conversion rate')).toBeVisible();
  });

  it('passes per-series format details to custom tooltip content', () => {
    render(
      <ComboChart
        data={orderConversionData}
        xKey="date"
        series={[
          { id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar' },
          { id: 'conversionRate', label: 'Conversion rate', data: orderConversionData, type: 'line', format: 'percent' }
        ]}
        tooltip={{
          content: ({ format, series }) => {
            const conversionRate = series.find((item) => item.id === 'conversionRate');

            return `${format}:${conversionRate?.format}`;
          }
        }}
      />
    );

    expect(screen.getByText('Orders')).toBeVisible();
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

  it('requires alternate-axis series to share format options', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    try {
      expect(() =>
        render(
          <ComboChart
            data={[{ date: '2026-07-01', orders: 138, usdRevenue: 12430.4, eurRevenue: 9820.2 }]}
            xKey="date"
            series={[
              { id: 'orders', label: 'Orders', data: [], type: 'bar', format: 'number' },
              {
                id: 'usdRevenue',
                label: 'USD revenue',
                data: [],
                type: 'line',
                format: 'currency',
                formatOptions: { currency: 'USD' }
              },
              {
                id: 'eurRevenue',
                label: 'EUR revenue',
                data: [],
                type: 'line',
                format: 'currency',
                formatOptions: { currency: 'EUR' }
              }
            ]}
          />
        )
      ).toThrow('ComboChart supports one alternate series format');
    } finally {
      consoleError.mockRestore();
    }
  });

  it('treats chart-level and series-level equivalent format options as the same axis', () => {
    render(
      <ComboChart
        data={[{ date: '2026-07-01', revenue: 12430.4, forecastRevenue: 13200, conversionRate: 0.032 }]}
        xKey="date"
        format="currency"
        formatOptions={{ currency: 'USD' }}
        series={[
          { id: 'revenue', label: 'Revenue', data: [], type: 'bar' },
          {
            id: 'forecastRevenue',
            label: 'Forecast revenue',
            data: [],
            type: 'bar',
            format: 'currency',
            formatOptions: { currency: 'USD' }
          },
          { id: 'conversionRate', label: 'Conversion rate', data: [], type: 'line', format: 'percent' }
        ]}
      />
    );

    expect(screen.getByText('$12,430.40')).toBeVisible();
    expect(screen.getByText('$13,200.00')).toBeVisible();
    expect(screen.getAllByText('3.2%')[0]).toBeVisible();
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
