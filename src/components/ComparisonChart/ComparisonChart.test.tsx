import { render, screen } from '@testing-library/react';

import { ComparisonChart } from './ComparisonChart';

const revenueData = [
  { date: '2026-07-01', currentRevenue: 12430.4, previousRevenue: 10980.2 },
  { date: '2026-07-02', currentRevenue: 14200, previousRevenue: 11840.35 }
];

const currentSeries = {
  dataKey: 'currentRevenue' as const,
  label: 'Current year',
  color: '#008060'
};

const comparisonSeries = {
  dataKey: 'previousRevenue' as const,
  label: 'Previous year',
  color: '#6d7175'
};

describe('ComparisonChart', () => {
  it('renders current and comparison labels and currency values in deterministic order', () => {
    render(
      <ComparisonChart
        currentSeries={currentSeries}
        comparisonSeries={comparisonSeries}
        data={revenueData}
        format="currency"
        xKey="date"
      />
    );

    const legend = screen.getByLabelText('Chart legend');
    expect(legend).toHaveTextContent('Current year$12,430.40Previous year$10,980.20');
  });

  it('keeps current data visible when comparison data is partially null', () => {
    const partialData = [
      { date: '2026-07-01', currentRevenue: 12430.4, previousRevenue: null },
      { date: '2026-07-02', currentRevenue: 14200, previousRevenue: 11840.35 }
    ];

    render(
      <ComparisonChart
        currentSeries={currentSeries}
        comparisonSeries={comparisonSeries}
        data={partialData}
        format="currency"
        xKey="date"
      />
    );

    expect(screen.getByText('$12,430.40')).toBeVisible();
    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
  });

  it('resolves to empty when both series contain only null values', () => {
    render(
      <ComparisonChart
        currentSeries={currentSeries}
        comparisonSeries={comparisonSeries}
        data={[{ date: '2026-07-01', currentRevenue: null, previousRevenue: null }]}
        xKey="date"
      />
    );

    expect(screen.getByText('No data available')).toBeVisible();
  });

  it('applies comparison defaults while preserving explicit zero presentation values', () => {
    const { container, rerender } = render(
      <ComparisonChart
        currentSeries={currentSeries}
        comparisonSeries={comparisonSeries}
        data={revenueData}
        rechartsProps={{ line: { isAnimationActive: false } }}
        xKey="date"
      />
    );

    let lines = container.querySelectorAll('.recharts-line-curve');
    expect(lines[1]).toHaveAttribute('stroke-dasharray', '6 4');
    expect(lines[1]).toHaveAttribute('opacity', '0.64');

    rerender(
      <ComparisonChart
        currentSeries={currentSeries}
        comparisonSeries={{ ...comparisonSeries, opacity: 0, strokeDasharray: 0 }}
        data={revenueData}
        rechartsProps={{ line: { isAnimationActive: false } }}
        xKey="date"
      />
    );

    lines = container.querySelectorAll('.recharts-line-curve');
    expect(lines[1]).toHaveAttribute('stroke-dasharray', '0');
    expect(lines[1]).toHaveAttribute('opacity', '0');
  });

  it('forwards error state and a custom retry action', () => {
    render(
      <ComparisonChart
        currentSeries={currentSeries}
        comparisonSeries={comparisonSeries}
        data={revenueData}
        retryAction={<a href="#support">Contact support</a>}
        state="error"
        xKey="date"
      />
    );

    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Contact support' })).toHaveAttribute('href', '#support');
  });

  it('accepts area mode', () => {
    const { container } = render(
      <ComparisonChart
        currentSeries={currentSeries}
        comparisonSeries={comparisonSeries}
        data={revenueData}
        mode="area"
        xKey="date"
      />
    );

    expect(container.querySelector('.recharts-area')).toBeInTheDocument();
  });
});
