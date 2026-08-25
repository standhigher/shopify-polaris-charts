import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ChartLocalizationProvider } from '../ChartLocalization';
import { ComboChart } from './ComboChart';

const orderConversionData = [
  { date: '2026-07-01', orders: 138, conversionRate: 0.032 },
  { date: '2026-07-02', orders: 156, conversionRate: 0.036 },
  { date: '2026-07-03', orders: 171, conversionRate: 0.041 }
];

const activateTooltip = (container: HTMLElement, clientX = 320) => {
  const chart = container.querySelector('.recharts-wrapper');

  if (!chart) {
    throw new Error('Expected the Recharts chart wrapper to render');
  }

  fireEvent.mouseMove(chart, { clientX, clientY: 120 });
};

describe('ComboChart', () => {
  it('uses chart-level line data for normalized gaps and isolated dots while ignoring bar gaps', () => {
    const data = [
      { date: '2026-08-01', orders: 10, revenue: 1 },
      { date: '2026-08-02', orders: 12, revenue: null },
      { date: '2026-08-03', orders: 14, revenue: 3 },
      { date: '2026-08-04', orders: 16, revenue: '' },
      { date: '2026-08-05', orders: 18, revenue: 5 }
    ];
    const originalData = data.map((datum) => ({ ...datum }));

    const { container } = render(
      <ComboChart
        data={data}
        line={{ dot: { r: 'auto', show: 'isolated' } }}
        series={[
          { connectGaps: true, data: [], id: 'orders', label: 'Orders', type: 'bar' },
          {
            color: '#008060',
            connectGaps: { opacity: 0.4, strokeDasharray: '2 3', strokeWidth: 3 },
            data: [],
            id: 'revenue',
            label: 'Revenue',
            type: 'line'
          }
        ]}
        xKey="date"
      />
    );

    expect(data).toEqual(originalData);
    expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(2);
    const dots = [...container.querySelectorAll('.recharts-line-dots .recharts-dot')];

    expect(dots).toHaveLength(3);
    expect(dots.every((dot) => dot.getAttribute('r') === '1')).toBe(true);
    expect(dots.every((dot) => dot.getAttribute('fill') === '#008060')).toBe(true);
  });

  it('uses independent line connector switches and preserves line presentation props', () => {
    const data = [
      { date: '2026-08-01', first: 1, second: 10 },
      { date: '2026-08-02', first: null, second: null },
      { date: '2026-08-03', first: 3, second: 30 },
      { date: '2026-08-04', first: 4, second: 40 }
    ];

    const { container } = render(
      <ComboChart
        data={data}
        rechartsProps={{ line: { isAnimationActive: false } }}
        series={[
          {
            color: '#008060',
            connectGaps: { color: '#ff0000', opacity: 0.4, strokeDasharray: '2 3', strokeWidth: 4 },
            data,
            id: 'first',
            label: 'First',
            opacity: 0.6,
            strokeDasharray: '4 2',
            strokeWidth: 5,
            type: 'line'
          },
          { data, id: 'second', label: 'Second', type: 'line' }
        ]}
        xKey="date"
      />
    );

    const paths = [...container.querySelectorAll('.recharts-line-curve')];

    expect(paths).toHaveLength(3);
    expect(paths[0]).toHaveAttribute('stroke', '#ff0000');
    expect(paths[0]).toHaveAttribute('stroke-dasharray', '2 3');
    expect(paths[0]).toHaveAttribute('stroke-width', '4');
    expect(paths[0]).toHaveAttribute('opacity', '0.4');
    expect(paths[1]).toHaveAttribute('stroke', '#008060');
    expect(paths[1]).toHaveAttribute('stroke-dasharray', '4 2');
    expect(paths[1]).toHaveAttribute('stroke-width', '5');
    expect(paths[1]).toHaveAttribute('opacity', '0.6');
  });

  it('keeps right-axis connectors on the right axis', () => {
    const data = [
      { date: '2026-08-01', orders: 10, conversionRate: 0.1 },
      { date: '2026-08-02', orders: 12, conversionRate: null },
      { date: '2026-08-03', orders: 14, conversionRate: 0.3 },
      { date: '2026-08-04', orders: 16, conversionRate: 0.4 }
    ];

    const { container } = render(
      <ComboChart
        data={data}
        series={[
          { data, format: 'number', id: 'orders', label: 'Orders', type: 'bar' },
          { connectGaps: true, data, format: 'percent', id: 'conversionRate', label: 'Conversion', type: 'line' }
        ]}
        xKey="date"
      />
    );

    expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(2);
    expect(container.querySelectorAll('.recharts-yAxis')).toHaveLength(2);
  });

  it('keeps non-gap extrema in the Y-axis domain while rendering connectors', () => {
    const data = [
      { date: '2026-08-01', orders: 10, revenue: 1 },
      { date: '2026-08-02', orders: 12, revenue: null },
      { date: '2026-08-03', orders: 14, revenue: 3 },
      { date: '2026-08-04', orders: 16, revenue: 1000 }
    ];

    const { container } = render(
      <ComboChart
        data={data}
        series={[
          { data, id: 'orders', label: 'Orders', type: 'bar' },
          { connectGaps: true, data, id: 'revenue', label: 'Revenue', type: 'line' }
        ]}
        xKey="date"
      />
    );

    expect(container.textContent).toContain('1,000');
  });

  it('filters connector data keys from custom tooltip payloads', async () => {
    const data = [
      { date: '2026-08-01', orders: 10, revenue: 1 },
      { date: '2026-08-02', orders: 12, revenue: null },
      { date: '2026-08-03', orders: 14, revenue: 3 }
    ];

    const { container } = render(
      <ComboChart
        data={data}
        series={[
          { data, id: 'orders', label: 'Orders', type: 'bar' },
          { connectGaps: true, data, id: 'revenue', label: 'Revenue', type: 'line' }
        ]}
        tooltip={{
          content: ({ payload }) => (
            <div data-testid="combo-gap-tooltip-payload">
              {payload?.map((item) => item.dataKey).join(',')}
            </div>
          )
        }}
        xKey="date"
      />
    );

    activateTooltip(container, 65);

    const payload = await screen.findByTestId('combo-gap-tooltip-payload');

    expect(payload).toHaveTextContent('orders');
    expect(payload).toHaveTextContent('revenue');
    expect(payload).not.toHaveTextContent('__standhigher_gap__');
  });

  it('renders the shared error state with a retry action', () => {
    const onRetry = vi.fn();

    render(
      <ComboChart
        data={orderConversionData}
        errorMessage="Orders API unavailable"
        onRetry={onRetry}
        series={[{ id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar' }]}
        state="error"
        xKey="date"
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load chart');
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('forwards a custom retry action to the error state', () => {
    render(
      <ComboChart
        data={orderConversionData}
        retryAction={<a href="#support">Contact support</a>}
        series={[{ id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar' }]}
        state="error"
        xKey="date"
      />
    );

    expect(screen.getByRole('alert')).toContainElement(screen.getByRole('link', { name: 'Contact support' }));
  });

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

  it('merges provider defaults into partial series format options in the legend', () => {
    render(
      <ChartLocalizationProvider currency="CNY" locale="zh-CN" timeZone="Asia/Shanghai">
        <ComboChart
          data={[{ date: '2026-07-01', revenue: 12430.4 }]}
          format="number"
          series={[
            {
              data: [],
              format: 'currency',
              formatOptions: { maximumFractionDigits: 0 },
              id: 'revenue',
              label: 'Revenue',
              type: 'line'
            }
          ]}
          xKey="date"
        />
      </ChartLocalizationProvider>
    );

    expect(screen.getByLabelText('Chart legend')).toHaveTextContent('¥12,430');
    expect(screen.getByLabelText('Chart legend')).not.toHaveTextContent('$12,430');
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
