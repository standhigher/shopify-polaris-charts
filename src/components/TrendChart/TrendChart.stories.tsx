import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from '../ChartCard';
import { TrendChart } from './TrendChart';

const salesTrendData = [
  { date: '2026-07-01', grossSales: 12430.4, netSales: 11280.1 },
  { date: '2026-07-02', grossSales: 14200, netSales: 12940.35 },
  { date: '2026-07-03', grossSales: 15890.75, netSales: 14620.5 },
  { date: '2026-07-04', grossSales: 13780.2, netSales: 12590 },
  { date: '2026-07-05', grossSales: 17440.8, netSales: 16030.4 },
  { date: '2026-07-06', grossSales: 19120.15, netSales: 17680.9 },
  { date: '2026-07-07', grossSales: 20480.6, netSales: 18920.7 }
];

const orderTrendData = [
  { date: '2026-07-01', onlineStore: 138, pointOfSale: 42 },
  { date: '2026-07-02', onlineStore: 156, pointOfSale: 48 },
  { date: '2026-07-03', onlineStore: 171, pointOfSale: 53 },
  { date: '2026-07-04', onlineStore: 149, pointOfSale: 46 },
  { date: '2026-07-05', onlineStore: 188, pointOfSale: 62 },
  { date: '2026-07-06', onlineStore: 204, pointOfSale: 66 },
  { date: '2026-07-07', onlineStore: 219, pointOfSale: 71 }
];

const meta = {
  title: 'Components/TrendChart',
  component: TrendChart
} satisfies Meta<typeof TrendChart>;

export default meta;

type Story = StoryObj;

export const Line: Story = {
  render: () => (
    <ChartCard title="Revenue trend" subtitle="Last 7 days" metric="$117.3K" trendLabel="+12.4%" state="ready">
      <TrendChart
        data={salesTrendData}
        format="currency"
        height={300}
        series={[
          { id: 'grossSales', label: 'Gross sales', data: salesTrendData },
          { id: 'netSales', label: 'Net sales', data: salesTrendData }
        ]}
        xKey="date"
      />
    </ChartCard>
  )
};

export const Area: Story = {
  render: () => (
    <ChartCard title="Orders by channel" subtitle="Last 7 days" metric="1,433" trendLabel="+8.1%" state="ready">
      <TrendChart
        data={orderTrendData}
        format="number"
        height={300}
        mode="area"
        series={[
          { id: 'onlineStore', label: 'Online store', data: orderTrendData },
          { id: 'pointOfSale', label: 'Point of sale', data: orderTrendData }
        ]}
        xKey="date"
      />
    </ChartCard>
  )
};

export const AnalyticsStyle: Story = {
  render: () => (
    <ChartCard title="Revenue trend" subtitle="Last 7 days" metric="$117.3K" trendLabel="+12.4%" state="ready">
      <TrendChart
        data={salesTrendData}
        format="currency"
        grid={{ horizontal: true, vertical: false, stroke: '#e5e7eb', strokeDasharray: '3 3' }}
        height={260}
        line={{ dot: false, activeDot: { r: 3, strokeWidth: 0 } }}
        margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
        series={[{ id: 'grossSales', label: 'Gross sales', data: salesTrendData, color: '#008060' }]}
        showLegend={false}
        tooltip={{ cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }}
        xAxis={{ axisLine: false, minTickGap: 0, tickLine: false }}
        xFormat="date"
        xKey="date"
        yAxis={{ domain: [0, 22000], ticks: [0, 5500, 11000, 16500, 22000], width: 64 }}
      />
    </ChartCard>
  )
};

export const ControlledRechartsProps: Story = {
  render: () => (
    <ChartCard title="Revenue trend" subtitle="Controlled Recharts props" metric="$117.3K" state="ready">
      <TrendChart
        data={salesTrendData}
        format="currency"
        height={260}
        rechartsProps={{
          area: { fillOpacity: 0.18 },
          cartesianGrid: { vertical: false },
          chart: { margin: { left: -8, right: 8 } },
          line: { activeDot: { r: 3 }, strokeDasharray: '4 2' },
          tooltip: { cursor: { strokeDasharray: '3 3' } },
          xAxis: { minTickGap: 0 },
          yAxis: { width: 56 }
        }}
        series={[{ id: 'grossSales', label: 'Gross sales', data: salesTrendData, color: '#008060' }]}
        xFormat="date"
        xKey="date"
      />
    </ChartCard>
  )
};
