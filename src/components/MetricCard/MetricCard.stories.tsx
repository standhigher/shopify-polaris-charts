import type { Meta, StoryObj } from '@storybook/react-vite';

import { MetricCard } from './MetricCard';

const meta = { title: 'Components/MetricCard', component: MetricCard } satisfies Meta<typeof MetricCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Revenue: Story = {
  args: {
    comparison: 'Compared with previous 30 days',
    title: 'Revenue',
    trend: { direction: 'up', value: '+12.4%' },
    value: '$117.3K'
  }
};

export const NegativeTrend: Story = {
  args: {
    comparison: 'Compared with previous 30 days',
    title: 'Conversion rate',
    trend: { direction: 'down', value: '-1.2%' },
    value: '3.8%'
  }
};

export const Loading: Story = {
  args: { state: 'loading', title: 'Orders', value: '1,433' }
};
