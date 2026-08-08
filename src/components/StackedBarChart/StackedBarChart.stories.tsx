import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from '../ChartCard';
import { StackedBarChart } from './StackedBarChart';

const orderStatusData = [
  { channel: 'Online store', fulfilled: 184, returned: 12, pending: 22 },
  { channel: 'Point of sale', fulfilled: 92, returned: 5, pending: 8 },
  { channel: 'Shop app', fulfilled: 64, returned: 3, pending: 9 },
  { channel: 'Social commerce', fulfilled: 48, returned: 7, pending: 11 }
];

const meta = {
  title: 'Components/StackedBarChart',
  component: StackedBarChart
} satisfies Meta<typeof StackedBarChart>;

export default meta;

type Story = StoryObj;

export const OrderStatusByChannel: Story = {
  render: () => (
    <ChartCard title="Order status by channel" subtitle="Last 7 days" metric="465 orders" trendLabel="+9.3%" state="ready">
      <StackedBarChart
        data={orderStatusData}
        format="number"
        height={300}
        series={[
          { id: 'fulfilled', label: 'Fulfilled', data: orderStatusData },
          { id: 'returned', label: 'Returned', data: orderStatusData },
          { id: 'pending', label: 'Pending', data: orderStatusData }
        ]}
        xKey="channel"
      />
    </ChartCard>
  )
};
