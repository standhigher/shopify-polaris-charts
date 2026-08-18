import type { Meta, StoryObj } from '@storybook/react-vite';

import { ComparisonChart } from './ComparisonChart';

const revenueData = [
  { date: '2026-07-01', currentRevenue: 12430.4, previousRevenue: 10980.2 },
  { date: '2026-07-02', currentRevenue: 14200, previousRevenue: 11840.35 },
  { date: '2026-07-03', currentRevenue: 15890.75, previousRevenue: 13120.5 },
  { date: '2026-07-04', currentRevenue: 13780.2, previousRevenue: 12680.8 },
  { date: '2026-07-05', currentRevenue: 17440.8, previousRevenue: 14220.4 }
];

const partialPreviousData = revenueData.map((datum, index) => ({
  ...datum,
  previousRevenue: index < 2 ? null : datum.previousRevenue
}));

const series = {
  currentSeries: { dataKey: 'currentRevenue' as const, label: 'This year', color: '#008060' },
  comparisonSeries: { dataKey: 'previousRevenue' as const, label: 'Last year', color: '#6d7175' }
};

const meta = {
  title: 'Components/ComparisonChart',
  component: ComparisonChart
} satisfies Meta<typeof ComparisonChart>;

export default meta;

type Story = StoryObj;

export const RevenueYearOverYear: Story = {
  render: () => (
    <ComparisonChart
      {...series}
      data={revenueData}
      format="currency"
      title="Revenue year over year"
      xFormat="date"
      xKey="date"
    />
  )
};

export const PartialPreviousPeriod: Story = {
  render: () => (
    <ComparisonChart
      {...series}
      data={partialPreviousData}
      format="currency"
      title="Revenue with partial previous-period data"
      xFormat="date"
      xKey="date"
    />
  )
};

export const Loading: Story = {
  render: () => <ComparisonChart {...series} data={revenueData} state="loading" xKey="date" />
};

export const Empty: Story = {
  render: () => <ComparisonChart {...series} data={[]} state="empty" xKey="date" />
};

export const Error: Story = {
  render: () => (
    <ComparisonChart
      {...series}
      data={revenueData}
      errorMessage="Revenue comparison is temporarily unavailable."
      retryAction={<a href="#support">Contact support</a>}
      state="error"
      xKey="date"
    />
  )
};
