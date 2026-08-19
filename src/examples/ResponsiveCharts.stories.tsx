import type { Meta, StoryObj } from '@storybook/react-vite';

import { ComboChart } from '../components/ComboChart';
import { DonutChart } from '../components/DonutChart';
import { FunnelChart } from '../components/FunnelChart';
import { StackedBarChart } from '../components/StackedBarChart';
import { TrendChart } from '../components/TrendChart';

const longLabel = 'Returning customers from the international storefront with a deliberately long translated label';
const data = [{ label: longLabel, current: 123456789.25, previous: -1200 }];

function NarrowResponsiveCharts() {
  return (
    <div style={{ display: 'grid', gap: 24, maxWidth: 320, width: '100%' }}>
      <TrendChart accessibility={{ label: 'Responsive revenue trend' }} data={data} format="currency" series={[{ data, id: 'current', label: longLabel }]} title="Revenue trend" xKey="label" />
      <ComboChart data={data} format="currency" series={[{ data, id: 'current', label: longLabel, type: 'bar' }]} title="Revenue and orders" xKey="label" />
      <StackedBarChart data={data} format="currency" series={[{ data, id: 'previous', label: longLabel }]} title="Revenue mix" xKey="label" />
      <DonutChart categoryKey="label" data={data} format="currency" title="Customer mix" valueKey="current" />
      <FunnelChart data={[{ id: 'long', label: longLabel, value: 123456789.25 }]} format="currency" title="Conversion funnel" />
    </div>
  );
}

const meta = {
  component: NarrowResponsiveCharts,
  parameters: { layout: 'padded' },
  title: 'Examples/Responsive Contracts'
} satisfies Meta<typeof NarrowResponsiveCharts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NarrowLongContent: Story = {};
