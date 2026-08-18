import type { Meta, StoryObj } from '@storybook/react-vite';

import { ConversionChart } from './ConversionChart';

const data = [
  { date: 'Aug 14', store: 0.036, email: 0.051, social: 0.028 },
  { date: 'Aug 15', store: 0.041, email: 0.055, social: 0.032 },
  { date: 'Aug 16', store: 0.042, email: 0.059, social: 0.034 },
  { date: 'Aug 17', store: 0.047, email: 0.062, social: 0.038 }
];

const storeSeries = [{ dataKey: 'store' as const, label: 'Store conversion', color: '#008060' }];

const meta = {
  title: 'Components/ConversionChart',
  component: ConversionChart
} satisfies Meta<typeof ConversionChart>;

export default meta;
type Story = StoryObj;

export const StoreConversion: Story = {
  render: () => <ConversionChart data={data} series={storeSeries} title="Store conversion" xKey="date" />
};

export const MultiChannel: Story = {
  render: () => (
    <ConversionChart
      data={data}
      series={[
        ...storeSeries,
        { dataKey: 'email', label: 'Email', color: '#2c6ecb' },
        { dataKey: 'social', label: 'Social', color: '#9c6ade' }
      ]}
      title="Conversion by channel"
      xKey="date"
    />
  )
};

export const PercentInput: Story = {
  render: () => (
    <ConversionChart
      data={data.map((datum) => ({ ...datum, store: datum.store * 100 }))}
      input="percent"
      series={storeSeries}
      title="Percentage-valued source data"
      xKey="date"
    />
  )
};

export const WithTarget: Story = {
  render: () => (
    <ConversionChart
      data={data}
      series={storeSeries}
      target={{ label: 'Goal', value: 0.05 }}
      title="Store conversion goal"
      xKey="date"
    />
  )
};

export const Loading: Story = {
  render: () => <ConversionChart data={data} series={storeSeries} state="loading" xKey="date" />
};

export const Error: Story = {
  render: () => (
    <ConversionChart
      data={data}
      errorMessage="Conversion data is temporarily unavailable."
      retryAction={<button type="button">Try again</button>}
      series={storeSeries}
      state="error"
      xKey="date"
    />
  )
};
