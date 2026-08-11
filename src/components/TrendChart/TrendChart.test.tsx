import { render, screen } from '@testing-library/react';

import { TrendChart } from './TrendChart';

const revenueData = [
  { date: '2026-07-01', grossSales: 12430.4, orders: 138 },
  { date: '2026-07-02', grossSales: 14200, orders: 156 },
  { date: '2026-07-03', grossSales: 15890.75, orders: 171 }
];

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
});
