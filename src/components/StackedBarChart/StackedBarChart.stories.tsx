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

export const AnalyticsStyle: Story = {
  render: () => (
    <ChartCard title="Order status by channel" subtitle="Last 7 days" metric="465 orders" trendLabel="+9.3%" state="ready">
      <StackedBarChart
        data={orderStatusData}
        format="number"
        grid={{ horizontal: true, vertical: false, stroke: '#e5e7eb', strokeDasharray: '3 3' }}
        height={260}
        margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
        series={[
          { id: 'fulfilled', label: 'Fulfilled', data: orderStatusData, color: '#008060' },
          { id: 'pending', label: 'Pending', data: orderStatusData, color: '#2C6ECB' },
          { id: 'returned', label: 'Returned', data: orderStatusData, color: '#D72C0D' }
        ]}
        showLegend={false}
        tooltip={{ cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }}
        xAxis={{ axisLine: false, minTickGap: 0, tickLine: false }}
        xKey="channel"
        yAxis={{ domain: [0, 240], ticks: [0, 60, 120, 180, 240], width: 48 }}
      />
    </ChartCard>
  )
};
