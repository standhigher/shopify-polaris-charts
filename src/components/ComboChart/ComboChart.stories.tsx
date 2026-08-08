import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from '../ChartCard';
import { ComboChart } from './ComboChart';

const orderConversionData = [
  { date: '2026-07-01', orders: 138, conversionRate: 0.032 },
  { date: '2026-07-02', orders: 156, conversionRate: 0.036 },
  { date: '2026-07-03', orders: 171, conversionRate: 0.041 },
  { date: '2026-07-04', orders: 149, conversionRate: 0.038 },
  { date: '2026-07-05', orders: 188, conversionRate: 0.044 },
  { date: '2026-07-06', orders: 204, conversionRate: 0.047 },
  { date: '2026-07-07', orders: 219, conversionRate: 0.049 }
];

const meta = {
  title: 'Components/ComboChart',
  component: ComboChart
} satisfies Meta<typeof ComboChart>;

export default meta;

type Story = StoryObj;

export const OrdersAndConversion: Story = {
  render: () => (
    <ChartCard title="Orders and conversion" subtitle="Last 7 days" metric="1,225 orders" trendLabel="+11.8%" state="ready">
      <ComboChart
        data={orderConversionData}
        height={300}
        series={[
          { id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar', format: 'number' },
          {
            id: 'conversionRate',
            label: 'Conversion rate',
            data: orderConversionData,
            type: 'line',
            format: 'percent'
          }
        ]}
        xFormat="date"
        xKey="date"
      />
    </ChartCard>
  )
};
