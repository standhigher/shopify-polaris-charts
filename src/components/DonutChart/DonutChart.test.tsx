import { render, screen } from '@testing-library/react';

import { DonutChart } from './DonutChart';

const orderStatusData = [
  { status: 'Paid', value: 642 },
  { status: 'Pending', value: 87 },
  { status: 'Refunded', value: 24 }
];

describe('DonutChart', () => {
  it('renders chart title, center label, legend labels, and formatted values', () => {
    render(
      <DonutChart
        title="Order status share"
        data={orderStatusData}
        categoryKey="status"
        valueKey="value"
        centerLabel="753 orders"
        format="number"
        height={320}
      />
    );

    expect(screen.getByRole('heading', { name: 'Order status share' })).toBeVisible();
    expect(screen.getByText('753 orders')).toBeVisible();
    expect(screen.getByText('Paid')).toBeVisible();
    expect(screen.getByText('Pending')).toBeVisible();
    expect(screen.getByText('642')).toBeVisible();
  });

  it('renders currency-formatted package share values', () => {
    render(
      <DonutChart
        title="Plan revenue share"
        data={[
          { plan: 'Shopify Plus', revenue: 18640 },
          { plan: 'Advanced', revenue: 9200 }
        ]}
        categoryKey="plan"
        valueKey="revenue"
        centerLabel="$27.8K"
        format="currency"
      />
    );

    expect(screen.getByRole('heading', { name: 'Plan revenue share' })).toBeVisible();
    expect(screen.getByText('Shopify Plus')).toBeVisible();
    expect(screen.getByText('$18,640.00')).toBeVisible();
  });

  it('renders an empty state when data is empty', () => {
    render(
      <DonutChart
        title="Order status share"
        data={[]}
        categoryKey="status"
        valueKey="value"
        centerLabel="0 orders"
      />
    );

    expect(screen.getByRole('heading', { name: 'Order status share' })).toBeVisible();
    expect(screen.getByText('No data available')).toBeVisible();
  });
});
