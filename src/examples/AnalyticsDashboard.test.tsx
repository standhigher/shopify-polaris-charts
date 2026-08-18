import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

vi.mock('../components/ComparisonChart', () => ({
  ComparisonChart: () => <div data-testid="comparison-chart" />
}));

vi.mock('../components/ConversionChart', () => ({
  ConversionChart: () => <div data-testid="conversion-chart" />
}));

vi.mock('../components/MetricCard', () => ({
  MetricCard: ({ title }: { title: React.ReactNode }) => <div data-testid="metric-card">{title}</div>
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
});
