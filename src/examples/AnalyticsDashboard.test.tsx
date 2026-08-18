import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../components/ComparisonChart', () => ({
  ComparisonChart: ({
    currentSeries,
    emptyMessage,
    errorMessage,
    onRetry,
    retryLabel,
    state = 'ready'
  }: {
    currentSeries: { dataKey: string };
    emptyMessage?: ReactNode;
    errorMessage?: ReactNode;
    onRetry?: () => void;
    retryLabel?: ReactNode;
    state?: string;
  }) => (
    <div
      aria-label={`${currentSeries.dataKey} chart`}
      data-chart-state={state}
      data-testid="comparison-chart"
    >
      {state === 'empty' ? <div role="status">{emptyMessage}</div> : null}
      {state === 'error' ? (
        <div role="alert">
          {errorMessage}
          {onRetry ? <button onClick={onRetry}>{retryLabel}</button> : null}
        </div>
      ) : null}
    </div>
  )
}));

vi.mock('../components/ConversionChart', () => ({
  ConversionChart: ({ emptyMessage, state = 'ready' }: { emptyMessage?: ReactNode; state?: string }) => (
    <div aria-label="conversionRate chart" data-chart-state={state} data-testid="conversion-chart">
      {state === 'empty' ? <div role="status">{emptyMessage}</div> : null}
    </div>
  )
}));

vi.mock('../components/MetricCard', () => ({
  MetricCard: ({ state = 'ready', title }: { state?: string; title: ReactNode }) => (
    <div data-metric-state={state} data-testid="metric-card">{title}</div>
  )
}));

import { AnalyticsDashboard } from './AnalyticsDashboard.stories';

describe('AnalyticsDashboard', () => {
  it('composes analytics components into a Shopify App dashboard', () => {
    render(<AnalyticsDashboard />);

    expect(screen.getByText('Gross sales')).toBeVisible();
    expect(screen.getByText('Orders')).toBeVisible();
    expect(screen.getByText('Conversion rate')).toBeVisible();
    expect(screen.getByText('Revenue trend')).toBeVisible();
    expect(screen.getByText('Orders compared with previous period')).toBeVisible();
    expect(screen.getByText('Store conversion')).toBeVisible();
    expect(screen.getAllByTestId('metric-card')).toHaveLength(3);
    expect(screen.getAllByTestId('comparison-chart')).toHaveLength(2);
    expect(screen.getByTestId('conversion-chart')).toBeVisible();

    const metricsHeading = screen.getByRole('heading', { level: 2, name: 'Store metrics' });
    const chartsHeading = screen.getByRole('heading', { level: 2, name: 'Store analytics charts' });
    expect(screen.getByRole('region', { name: 'Store metrics' })).toHaveAttribute(
      'aria-labelledby',
      metricsHeading.id
    );
    expect(screen.getByRole('region', { name: 'Store analytics charts' })).toHaveAttribute(
      'aria-labelledby',
      chartsHeading.id
    );
  });

  it('renders an accessible empty dashboard state', () => {
    render(<AnalyticsDashboard state="empty" />);

    expect(screen.getAllByRole('status')).toHaveLength(3);
    expect(screen.getByLabelText('currentRevenue chart')).toHaveAttribute('data-chart-state', 'empty');
    expect(screen.getByLabelText('currentOrders chart')).toHaveAttribute('data-chart-state', 'empty');
    expect(screen.getByLabelText('conversionRate chart')).toHaveAttribute('data-chart-state', 'empty');
    expect(screen.getByText('No revenue data for this period')).toBeVisible();
    expect(screen.getByText('No order data for this period')).toBeVisible();
    expect(screen.getByText('No conversion data for this period')).toBeVisible();
  });

  it('keeps unaffected content ready when the orders chart fails and retries it', () => {
    const onRetry = vi.fn();
    render(<AnalyticsDashboard onRetry={onRetry} state="error" />);

    expect(screen.getByLabelText('currentRevenue chart')).toHaveAttribute('data-chart-state', 'ready');
    expect(screen.getByLabelText('conversionRate chart')).toHaveAttribute('data-chart-state', 'ready');
    expect(screen.getByLabelText('currentOrders chart')).toHaveAttribute('data-chart-state', 'error');
    screen.getAllByTestId('metric-card').forEach((card) =>
      expect(card).toHaveAttribute('data-metric-state', 'ready')
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Orders comparison could not be loaded');

    fireEvent.click(screen.getByRole('button', { name: 'Retry orders comparison' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });
});
