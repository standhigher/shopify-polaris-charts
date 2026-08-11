import { render, screen } from '@testing-library/react';

import { StackedBarChart } from './StackedBarChart';

const channelCompositionData = [
  { channel: 'Online store', fulfilled: 184, returned: 12, pending: 22 },
  { channel: 'Point of sale', fulfilled: 92, returned: 5, pending: 8 },
  { channel: 'Shop app', fulfilled: 64, returned: 3, pending: 9 }
];

describe('StackedBarChart', () => {
  it('renders stacked series labels and formatted values', () => {
    render(
      <StackedBarChart
        title="Order status by channel"
        data={channelCompositionData}
        xKey="channel"
        series={[
          { id: 'fulfilled', label: 'Fulfilled', data: channelCompositionData },
          { id: 'returned', label: 'Returned', data: channelCompositionData },
          { id: 'pending', label: 'Pending', data: channelCompositionData }
        ]}
        format="number"
        height={320}
      />
    );

    expect(screen.getByRole('heading', { name: 'Order status by channel' })).toBeVisible();
    expect(screen.getByText('Fulfilled')).toBeVisible();
    expect(screen.getByText('Returned')).toBeVisible();
    expect(screen.getByText('Pending')).toBeVisible();
    expect(screen.getByText('184')).toBeVisible();
  });

  it('renders categorical x labels without requiring date formatting', () => {
    render(
      <StackedBarChart
        data={channelCompositionData}
        xKey="channel"
        series={[{ id: 'fulfilled', label: 'Fulfilled', data: channelCompositionData }]}
      />
    );

    expect(screen.getByText('Online store')).toBeVisible();
    expect(screen.getByText('Point of sale')).toBeVisible();
  });

  it('hides the built-in legend when showLegend is false', () => {
    render(
      <StackedBarChart
        data={channelCompositionData}
        xKey="channel"
        series={[{ id: 'fulfilled', label: 'Fulfilled', data: channelCompositionData }]}
        showLegend={false}
      />
    );

    expect(screen.queryByLabelText('Chart legend')).not.toBeInTheDocument();
  });

  it('renders an empty state when all stacked values are empty', () => {
    render(
      <StackedBarChart
        title="Order status by channel"
        data={[{ channel: 'Online store', fulfilled: null, returned: undefined }]}
        xKey="channel"
        series={[
          { id: 'fulfilled', label: 'Fulfilled', data: [] },
          { id: 'returned', label: 'Returned', data: [] }
        ]}
        emptyMessage="No channel data"
      />
    );

    expect(screen.getByRole('heading', { name: 'Order status by channel' })).toBeVisible();
    expect(screen.getByText('No channel data')).toBeVisible();
  });
});
