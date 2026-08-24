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

const gapComboData = [
  { date: '2026-07-01', orders: 138, revenue: 12430.4, conversionRate: 0.032 },
  { date: '2026-07-02', orders: 156, revenue: null, conversionRate: 0.036 },
  { date: '2026-07-03', orders: 171, revenue: 15890.75, conversionRate: null },
  { date: '2026-07-04', orders: 149, revenue: null, conversionRate: 0.038 },
  { date: '2026-07-05', orders: 188, revenue: 17440.8, conversionRate: 0.044 },
  { date: '2026-07-06', orders: 204, revenue: 19120.15, conversionRate: null },
  { date: '2026-07-07', orders: 219, revenue: 20480.6, conversionRate: 0.049 }
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

export const GapsAndDualAxis: Story = {
  render: () => (
    <ChartCard title="Orders, revenue, and conversion gaps" subtitle="Bridges across both axes" metric="$117.3K" state="ready">
      <ComboChart
        data={gapComboData}
        format="number"
        height={300}
        line={{ activeDot: { r: 'auto' }, dot: { r: 'auto', show: 'isolated' } }}
        series={[
          {
            connectGaps: true,
            data: gapComboData,
            format: 'number',
            id: 'orders',
            label: 'Orders',
            type: 'bar'
          },
          {
            color: '#008060',
            connectGaps: { color: '#6d7175', opacity: 0.8, strokeDasharray: '5 4', strokeWidth: 2 },
            data: gapComboData,
            format: 'number',
            id: 'revenue',
            label: 'Revenue',
            type: 'line'
          },
          {
            color: '#2c6ecb',
            connectGaps: { color: '#8da9d8', opacity: 0.85, strokeDasharray: '3 3', strokeWidth: 2 },
            data: gapComboData,
            format: 'percent',
            id: 'conversionRate',
            label: 'Conversion rate',
            type: 'line'
          }
        ]}
        showLegend={false}
        xFormat="date"
        xKey="date"
      />
    </ChartCard>
  )
};

export const AnalyticsStyle: Story = {
  render: () => (
    <ChartCard title="Orders and conversion" subtitle="Last 7 days" metric="1,225 orders" trendLabel="+11.8%" state="ready">
      <ComboChart
        data={orderConversionData}
        grid={{ horizontal: true, vertical: false, stroke: '#e5e7eb', strokeDasharray: '3 3' }}
        height={260}
        line={{ dot: false, activeDot: { r: 3, strokeWidth: 0 } }}
        margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
        series={[
          { id: 'orders', label: 'Orders', data: orderConversionData, type: 'bar', format: 'number', color: '#008060' },
          {
            id: 'conversionRate',
            label: 'Conversion rate',
            data: orderConversionData,
            type: 'line',
            format: 'percent',
            color: '#2C6ECB'
          }
        ]}
        showLegend={false}
        tooltip={{ cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }}
        xAxis={{ axisLine: false, minTickGap: 0, tickLine: false }}
        xFormat="date"
        xKey="date"
        yAxis={{ axisLine: false, tickLine: false, width: 48 }}
      />
    </ChartCard>
  )
};
