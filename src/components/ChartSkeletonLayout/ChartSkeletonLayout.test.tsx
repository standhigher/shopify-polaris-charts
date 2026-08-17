import { render, screen } from '@testing-library/react';

import { ChartRevealRegion, ChartSkeletonLayout } from './ChartSkeletonLayout';

describe('ChartSkeletonLayout', () => {
  it('lets dashboard regions reveal independently', () => {
    render(
      <ChartSkeletonLayout ariaLabel="Revenue dashboard loading">
        <ChartRevealRegion label="Revenue chart" ready={false}>
          <div>Revenue chart ready</div>
        </ChartRevealRegion>
        <ChartRevealRegion label="Orders chart" ready>
          <div>Orders chart ready</div>
        </ChartRevealRegion>
      </ChartSkeletonLayout>
    );

    expect(screen.getByRole('status', { name: 'Revenue dashboard loading' })).toBeVisible();
    expect(screen.getByRole('status', { name: 'Revenue chart' })).toBeVisible();
    expect(screen.queryByText('Revenue chart ready')).not.toBeInTheDocument();
    expect(screen.getByText('Orders chart ready')).toBeVisible();
  });

  it('supports dashboard grid density options', () => {
    render(
      <ChartSkeletonLayout ariaLabel="Revenue dashboard loading" columns={2} gap={20}>
        <ChartRevealRegion label="Revenue chart" ready>
          <div>Revenue chart ready</div>
        </ChartRevealRegion>
      </ChartSkeletonLayout>
    );

    expect(screen.getByRole('status', { name: 'Revenue dashboard loading' })).toHaveStyle({
      gap: '20px',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))'
    });
  });

  it('can keep region children mounted behind an overlay skeleton', () => {
    render(
      <ChartRevealRegion label="Revenue chart" mode="overlay" ready={false}>
        <div>Revenue chart mounted</div>
      </ChartRevealRegion>
    );

    expect(screen.getByText('Revenue chart mounted')).toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Revenue chart' })).toBeVisible();
    expect(screen.getByLabelText('Revenue chart region')).toHaveAttribute('aria-busy', 'true');
  });

  it('accepts custom region skeleton content and height', () => {
    render(
      <ChartRevealRegion label="Revenue chart" minHeight={320} ready={false} skeleton={<span>Custom KPI skeleton</span>}>
        <div>Revenue chart ready</div>
      </ChartRevealRegion>
    );

    expect(screen.getByText('Custom KPI skeleton')).toBeVisible();
    expect(screen.getByRole('status', { name: 'Revenue chart' })).toHaveStyle({ minHeight: '320px' });
  });
});
