import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { TrendChart } from './TrendChart';

const revenueData = [
  { date: '2026-07-01', grossSales: 12430.4, orders: 138 },
  { date: '2026-07-02', grossSales: 14200, orders: 156 },
  { date: '2026-07-03', grossSales: 15890.75, orders: 171 }
];

const activateTooltip = (container: HTMLElement) => {
  const chart = container.querySelector('.recharts-wrapper');

  if (!chart) {
    throw new Error('Expected the Recharts chart wrapper to render');
  }

  fireEvent.mouseMove(chart, { clientX: 320, clientY: 120 });
};

describe('TrendChart', () => {
  it('renders line chart title, legend labels, and formatted values', () => {
    render(
      <TrendChart
        title="Shopify revenue trend"
        data={revenueData}
        xKey="date"
        series={[
          { id: 'grossSales', label: 'Gross sales', data: revenueData },
          { id: 'orders', label: 'Orders', data: revenueData }
        ]}
        format="currency"
        xFormat="date"
        height={320}
      />
    );

    expect(screen.getByRole('heading', { name: 'Shopify revenue trend' })).toBeVisible();
    expect(screen.getByText('Gross sales')).toBeVisible();
    expect(screen.getByText('Orders')).toBeVisible();
    expect(screen.getByText('$12,430.40')).toBeVisible();
  });

  it('renders area chart with compact formatted legend values', () => {
    render(
      <TrendChart
        title="Orders over time"
        data={revenueData}
        mode="area"
        xKey="date"
        series={[{ id: 'orders', label: 'Orders', data: revenueData }]}
        format="compact"
        height={280}
      />
    );

    expect(screen.getByRole('heading', { name: 'Orders over time' })).toBeVisible();
    expect(screen.getByText('Orders')).toBeVisible();
    expect(screen.getByText('138')).toBeVisible();
  });

  it('renders categorical x values by default', () => {
    render(
      <TrendChart
        title="Orders by cohort"
        data={[
          { cohort: 'New customers', orders: 138 },
          { cohort: 'Returning customers', orders: 246 }
        ]}
        xKey="cohort"
        series={[{ id: 'orders', label: 'Orders', data: [] }]}
        format="number"
        height={280}
      />
    );

    expect(screen.getByText('New customers')).toBeVisible();
    expect(screen.getByText('Returning customers')).toBeVisible();
  });

  it('hides the built-in legend when showLegend is false', () => {
    render(
      <TrendChart
        data={revenueData}
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
        showLegend={false}
      />
    );

    expect(screen.queryByLabelText('Chart legend')).not.toBeInTheDocument();
  });

  it('accepts cartesian presentation options without changing render output', () => {
    render(
      <TrendChart
        data={revenueData}
        format="currency"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
        margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
        yAxis={{ domain: [0, 800], ticks: [0, 200, 400, 600, 800], width: 56 }}
        xAxis={{ axisLine: false, tickLine: false, minTickGap: 0 }}
        grid={{ horizontal: true, vertical: false, stroke: '#e5e7eb', strokeDasharray: '3 3' }}
        tooltip={{ cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }}
        line={{ dot: false, activeDot: { r: 3, strokeWidth: 0 } }}
      />
    );

    expect(screen.getByText('Gross sales')).toBeVisible();
    expect(screen.getByText('$12,430.40')).toBeVisible();
  });

  it('renders the default tooltip when it becomes active', async () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        format="currency"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      />
    );

    activateTooltip(container);

    expect(await screen.findByText('$14,200.00')).toBeVisible();
  });

  it('applies label and value formatters to the default tooltip', async () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
        tooltip={{
          labelFormatter: (label) => `Tooltip date: ${label}`,
          valueFormatter: (value, series) => `Formatted ${series?.id}: ${value}`
        }}
      />
    );

    activateTooltip(container);

    expect(await screen.findByText('Tooltip date: 2026-07-02')).toBeVisible();
    expect(screen.getByText('Formatted grossSales: 14200')).toBeVisible();
  });

  it('applies className and minWidth to the default tooltip container', async () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
        tooltip={{
          className: 'analytics-tooltip',
          labelFormatter: (label) => `Tooltip date: ${label}`,
          minWidth: 180
        }}
      />
    );

    activateTooltip(container);

    const label = await screen.findByText('Tooltip date: 2026-07-02');

    expect(label.parentElement).toHaveClass('analytics-tooltip');
    expect(label.parentElement).toHaveStyle({ minWidth: '180px' });
  });

  it('passes chart context to custom tooltip content', async () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        format="currency"
        formatOptions={{ currency: 'CAD' }}
        xFormat="date"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
        tooltip={{
          content: ({ active, format, formatLabel, formatOptions, label, payload, series, xFormat, xFormatOptions }) => (
            <div data-testid="custom-tooltip">
              {`active=${active}; label=${label}; payload=${payload?.[0]?.series?.label}; series=${series[0]?.label}; format=${format}; currency=${formatOptions.currency}; xFormat=${xFormat}; xLocale=${xFormatOptions.locale}; formattedLabel=${formatLabel(label)}`}
            </div>
          )
        }}
      />
    );

    activateTooltip(container);

    expect(await screen.findByTestId('custom-tooltip')).toHaveTextContent(
      'active=true; label=2026-07-02; payload=Gross sales; series=Gross sales; format=currency; currency=CAD; xFormat=date; xLocale=en-US; formattedLabel=Jul 2, 2026'
    );
  });

  it('renders an empty state when data is empty', () => {
    render(
      <TrendChart
        title="Shopify revenue trend"
        data={[]}
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: [] }]}
        format="currency"
      />
    );

    expect(screen.getByRole('heading', { name: 'Shopify revenue trend' })).toBeVisible();
    expect(screen.getByText('No data available')).toBeVisible();
  });

  it('renders an inline chart error state with a retry action', () => {
    const onRetry = vi.fn();

    render(
      <TrendChart
        data={revenueData}
        errorMessage="Revenue API unavailable"
        onRetry={onRetry}
        retryLabel="Try again"
        state="error"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load chart');
    expect(screen.getByText('Revenue API unavailable')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('renders a line-chart skeleton for the chart loading state', () => {
    render(
      <TrendChart
        data={revenueData}
        loadingLabel="Loading revenue trend"
        state="loading"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading revenue trend');
    expect(screen.getAllByTestId('chart-state-skeleton-line')).toHaveLength(3);
  });

  it('keeps the chart mounted behind the reveal overlay', () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        reveal={{ active: true, label: 'Preparing chart' }}
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      />
    );

    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Preparing chart');
  });
});
