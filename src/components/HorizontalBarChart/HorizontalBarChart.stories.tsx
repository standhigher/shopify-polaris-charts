import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from '../ChartCard';
import { HorizontalBarChart } from './HorizontalBarChart';

const deliveryDurationData = [
  { label: '0–3 days', value: 0, color: '#3b82f6' },
  { label: '4–7 days', value: 0.78, color: '#3b82f6' },
  { label: '8–15 days', value: 0.22, color: '#f59e0b' },
  { label: '16–30 days', value: 0, color: '#3b82f6' },
  { label: '31+ days', value: 0, color: '#3b82f6' }
];

const meta = {
  title: 'Components/HorizontalBarChart',
  component: HorizontalBarChart
} satisfies Meta<typeof HorizontalBarChart>;

export default meta;

type Story = StoryObj;

export const DeliveryDurationDistribution: Story = {
  render: () => (
    <ChartCard title="Order-to-delivery duration distribution" subtitle="Share of orders by natural days" state="ready">
      <HorizontalBarChart
        data={deliveryDurationData}
        format="percent"
        height={360}
        margin={{ left: 8, right: 8, top: 8, bottom: 8 }}
        xAxis={{ domain: [0, 1], ticks: [0, 0.2, 0.4, 0.6, 0.8] }}
      />
    </ChartCard>
  )
};

export const PercentInput: Story = {
  render: () => (
    <HorizontalBarChart
      data={deliveryDurationData.map((item) => ({ ...item, value: item.value * 100 }))}
      format="percent"
      height={360}
      percentageInput="percent"
      xAxis={{ domain: [0, 1], ticks: [0, 0.2, 0.4, 0.6, 0.8] }}
    />
  )
};
