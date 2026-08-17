import { render, screen } from '@testing-library/react';

import { ChartLocalizationProvider } from '../ChartLocalization';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('renders static value, accessible negative trend, and comparison', () => {
    render(
      <MetricCard
        comparison="Compared with previous 30 days"
        title="Conversion rate"
        trend={{ direction: 'down', value: '1.2%' }}
        value="3.8%"
      />
    );

    expect(screen.getByRole('region', { name: 'Conversion rate' })).toBeVisible();
    expect(screen.getByText('3.8%')).toBeVisible();
    expect(screen.getByText('1.2%')).toBeVisible();
    expect(screen.getByText('Decreased')).toBeInTheDocument();
    expect(screen.getByText('Compared with previous 30 days')).toBeVisible();
  });

  it('renders a localized loading skeleton', () => {
    render(
      <ChartLocalizationProvider messages={{ metricLoading: '正在加载指标' }}>
        <MetricCard state="loading" title="Revenue" value="$12,400" />
      </ChartLocalizationProvider>
    );

    expect(screen.getByRole('status', { name: '正在加载指标' })).toBeVisible();
    expect(screen.getByTestId('metric-card-skeleton-value')).toBeInTheDocument();
  });
});
