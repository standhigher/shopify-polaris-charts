import type { ReactNode } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

interface ChartMockProps {
  data?: Array<Record<string, unknown>>;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  onRetry?: () => void;
  retryLabel?: ReactNode;
  reveal?: { active?: boolean };
  state?: string;
}

const ChartMock = ({
  data = [],
  emptyMessage,
  errorMessage,
  onRetry,
  retryLabel,
  reveal,
  state = 'ready',
  testId
}: ChartMockProps & { testId: string }) => (
  <div
    data-first-date={String(data[0]?.date ?? '')}
    data-reveal={reveal?.active ? 'true' : 'false'}
    data-state={state}
    data-testid={testId}
  >
    {state === 'empty' ? <div role="status">{emptyMessage}</div> : null}
    {state === 'error' ? (
      <div role="alert">
        {errorMessage}
        {onRetry ? <button onClick={onRetry}>{retryLabel}</button> : null}
      </div>
    ) : null}
  </div>
);

vi.mock('../components/TrendChart', () => ({
  TrendChart: (props: ChartMockProps) => <ChartMock {...props} testId="trend-chart" />
}));

vi.mock('../components/ComparisonChart', () => ({
  ComparisonChart: (props: ChartMockProps) => <ChartMock {...props} testId="comparison-chart" />
}));

vi.mock('../components/ConversionChart', () => ({
  ConversionChart: (props: ChartMockProps) => <ChartMock {...props} testId="conversion-chart" />
}));

vi.mock('../components/FunnelChart', () => ({
  FunnelChart: (props: ChartMockProps) => <ChartMock {...props} testId="funnel-chart" />
}));

vi.mock('../components/MetricCard', () => ({
  MetricCard: ({ state = 'ready', title, value }: { state?: string; title: ReactNode; value: ReactNode }) => (
    <div data-state={state} data-testid="metric-card">{title}: {value}</div>
  )
}));

import { ShopifyAnalyticsDashboard } from './ShopifyAnalyticsDashboard.stories';

describe('ShopifyAnalyticsDashboard', () => {
  it('composes the complete analytics sequence with accessible sections', () => {
    render(<ShopifyAnalyticsDashboard />);

    for (const title of ['Revenue', 'Orders', 'Conversion Rate', 'AOV', 'Customers', 'Upsell Conversion']) {
      expect(screen.getByText(new RegExp(`^${title}:`))).toBeVisible();
    }
    expect(screen.getAllByTestId('metric-card')).toHaveLength(6);
    expect(screen.getByTestId('trend-chart')).toBeVisible();
    expect(screen.getByTestId('comparison-chart')).toBeVisible();
    expect(screen.getByTestId('conversion-chart')).toBeVisible();
    expect(screen.getByTestId('funnel-chart')).toBeVisible();
    expect(screen.getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
      'Metric Cards',
      'Trend',
      'Comparison',
      'Conversion',
      'Funnel'
    ]);
    for (const heading of screen.getAllByRole('heading', { level: 2 })) {
      expect(screen.getByRole('region', { name: heading.textContent ?? '' })).toHaveAttribute(
        'aria-labelledby',
        heading.id
      );
    }
    expect(screen.getByRole('combobox', { name: 'Date range' })).toBeVisible();
  });

  it('switches between caller-prepared static date ranges', () => {
    render(<ShopifyAnalyticsDashboard />);

    expect(screen.getByText('Revenue: $173.3K')).toBeVisible();
    expect(screen.getByTestId('trend-chart')).toHaveAttribute('data-first-date', '2026-08-11');

    fireEvent.change(screen.getByRole('combobox', { name: 'Date range' }), { target: { value: '30d' } });

    expect(screen.getByText('Revenue: $712.8K')).toBeVisible();
    expect(screen.getByTestId('trend-chart')).toHaveAttribute('data-first-date', '2026-07-19');
  });

  it('renders multi-column metric and chart loading states', () => {
    render(<ShopifyAnalyticsDashboard state="loading" />);

    screen.getAllByTestId('metric-card').forEach((card) => expect(card).toHaveAttribute('data-state', 'loading'));
    for (const testId of ['trend-chart', 'comparison-chart', 'conversion-chart', 'funnel-chart']) {
      expect(screen.getByTestId(testId)).toHaveAttribute('data-state', 'loading');
    }
  });

  it('keeps unaffected analytics ready in the partial empty state', () => {
    render(<ShopifyAnalyticsDashboard state="partial-empty" />);

    expect(screen.getByTestId('trend-chart')).toHaveAttribute('data-state', 'ready');
    expect(screen.getByTestId('conversion-chart')).toHaveAttribute('data-state', 'ready');
    expect(screen.getByTestId('comparison-chart')).toHaveAttribute('data-state', 'empty');
    expect(screen.getByTestId('funnel-chart')).toHaveAttribute('data-state', 'empty');
    expect(screen.getByText('No order comparison for this period')).toBeVisible();
    expect(screen.getByText('No funnel activity for this period')).toBeVisible();
  });

  it('localizes one error with retry while other regions remain ready', () => {
    const onRetry = vi.fn();
    render(<ShopifyAnalyticsDashboard onRetry={onRetry} state="error" />);

    expect(screen.getByTestId('comparison-chart')).toHaveAttribute('data-state', 'error');
    expect(screen.getByTestId('trend-chart')).toHaveAttribute('data-state', 'ready');
    expect(screen.getByTestId('conversion-chart')).toHaveAttribute('data-state', 'ready');
    expect(screen.getByTestId('funnel-chart')).toHaveAttribute('data-state', 'ready');
    expect(screen.getByRole('alert')).toHaveTextContent('Orders comparison could not be loaded');
    fireEvent.click(screen.getByRole('button', { name: 'Retry orders comparison' }));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('forwards progressive reveal to every ready chart region', () => {
    render(<ShopifyAnalyticsDashboard progressiveReveal />);

    for (const testId of ['trend-chart', 'comparison-chart', 'conversion-chart', 'funnel-chart']) {
      expect(screen.getByTestId(testId)).toHaveAttribute('data-reveal', 'true');
    }
  });
});
