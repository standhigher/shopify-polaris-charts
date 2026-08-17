import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from '../ChartCard';
import { TrendChart } from '../TrendChart';
import { ChartRevealRegion, ChartSkeletonLayout } from './ChartSkeletonLayout';

const revenueData = [
  { date: '2026-07-01', revenue: 12430.4 },
  { date: '2026-07-02', revenue: 14200 },
  { date: '2026-07-03', revenue: 15890.75 },
  { date: '2026-07-04', revenue: 13780.2 },
  { date: '2026-07-05', revenue: 17440.8 }
];

const meta = {
  title: 'Components/ChartSkeletonLayout',
  component: ChartSkeletonLayout
} satisfies Meta<typeof ChartSkeletonLayout>;

export default meta;

type Story = StoryObj;

export const TwoColumnDashboard: Story = {
  render: () => (
    <ChartSkeletonLayout ariaLabel="Revenue dashboard loading" columns={2} gap={20}>
      <ChartRevealRegion label="Revenue chart" minHeight={300} ready={false} skeleton="Loading revenue API">
        <ChartCard title="Revenue trend" subtitle="Loading region" metric="$117.3K" state="ready">
          <TrendChart
            data={revenueData}
            format="currency"
            series={[{ id: 'revenue', label: 'Revenue', data: revenueData, color: '#008060' }]}
            xKey="date"
          />
        </ChartCard>
      </ChartRevealRegion>
      <ChartRevealRegion label="Orders chart" ready>
        <ChartCard title="Orders trend" subtitle="Ready region" metric="1,433" state="ready">
          <TrendChart
            data={revenueData.map((item, index) => ({ ...item, orders: 120 + index * 18 }))}
            format="number"
            series={[{ id: 'orders', label: 'Orders', data: [], color: '#5c6ac4' }]}
            xKey="date"
          />
        </ChartCard>
      </ChartRevealRegion>
    </ChartSkeletonLayout>
  )
};

export const OverlayRevealKeepsChartMounted: Story = {
  render: () => (
    <ChartSkeletonLayout ariaLabel="Revenue dashboard loading">
      <ChartRevealRegion label="Revenue chart" minHeight={320} mode="overlay" ready={false}>
        <ChartCard title="Revenue trend" subtitle="Chart remains mounted behind skeleton" metric="$117.3K" state="ready">
          <TrendChart
            data={revenueData}
            format="currency"
            series={[{ id: 'revenue', label: 'Revenue', data: revenueData, color: '#008060' }]}
            xKey="date"
          />
        </ChartCard>
      </ChartRevealRegion>
    </ChartSkeletonLayout>
  )
};
