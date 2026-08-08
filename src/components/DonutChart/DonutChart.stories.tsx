import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from '../ChartCard';
import { DonutChart } from './DonutChart';

const orderStatusData = [
  { status: 'Paid', value: 642 },
  { status: 'Pending', value: 87 },
  { status: 'Refunded', value: 24 },
  { status: 'Partially fulfilled', value: 58 }
];

const planShareData = [
  { plan: 'Shopify Plus', revenue: 18640 },
  { plan: 'Advanced', revenue: 9200 },
  { plan: 'Grow', revenue: 6840 },
  { plan: 'Basic', revenue: 3120 }
];

const meta = {
  title: 'Components/DonutChart',
  component: DonutChart
} satisfies Meta<typeof DonutChart>;

export default meta;

type Story = StoryObj;

export const OrderStatus: Story = {
  render: () => (
    <ChartCard title="Order status share" subtitle="Current month" metric="811 orders" state="ready">
      <DonutChart
        centerLabel="811 orders"
        categoryKey="status"
        data={orderStatusData}
        format="number"
        height={300}
        valueKey="value"
      />
    </ChartCard>
  )
};

export const PlanRevenue: Story = {
  render: () => (
    <ChartCard title="Plan revenue share" subtitle="Current month" metric="$37.8K" state="ready">
      <DonutChart
        centerLabel="$37.8K"
        categoryKey="plan"
        data={planShareData}
        format="currency"
        height={300}
        valueKey="revenue"
      />
    </ChartCard>
  )
};
