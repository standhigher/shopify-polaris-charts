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
});
