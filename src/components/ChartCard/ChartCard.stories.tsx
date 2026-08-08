import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from './ChartCard';

const DemoChart = () => (
  <div
    style={{
      alignItems: 'end',
      display: 'grid',
      gap: 8,
      gridTemplateColumns: 'repeat(12, minmax(0, 1fr))',
      minHeight: 208,
      width: '100%'
    }}
  >
    {[48, 72, 58, 90, 82, 116, 96, 128, 112, 142, 124, 156].map((height, index) => (
      <div
        aria-hidden="true"
        key={index}
        style={{
          background: index % 3 === 0 ? '#2c6ecb' : '#008060',
          borderRadius: '4px 4px 0 0',
          height
        }}
      />
    ))}
  </div>
);

const meta = {
  title: 'Components/ChartCard',
  component: ChartCard,
  args: {
    title: 'Sales over time',
    subtitle: 'Last 30 days',
    metric: '$12,400',
    trendLabel: '+8.2%',
    actions: <button type="button">Export</button>,
    filters: <button type="button">Last 30 days</button>
  }
} satisfies Meta<typeof ChartCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {
  args: {
    state: 'ready',
    children: <DemoChart />
  }
};

export const Loading: Story = {
  args: {
    state: 'loading',
    children: <DemoChart />
  }
};

export const Empty: Story = {
  args: {
    state: 'empty',
    children: <DemoChart />
  }
};

export const Error: Story = {
  args: {
    state: 'error',
    errorMessage: 'Revenue API unavailable',
    children: <DemoChart />
  }
};

export const NoPermission: Story = {
  args: {
    state: 'no-permission',
    children: <DemoChart />
  }
};

export const Stale: Story = {
  args: {
    state: 'stale',
    children: <DemoChart />
  }
};
