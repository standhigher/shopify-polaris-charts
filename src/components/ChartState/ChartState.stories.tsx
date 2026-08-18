import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartStateRegion } from './ChartState';

const Placeholder = () => <div style={{ background: '#f1f2f4', minHeight: 220, padding: 24 }}>Chart content</div>;

const meta = { title: 'Components/ChartStateRegion', component: ChartStateRegion } satisfies Meta<typeof ChartStateRegion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = { args: { children: <Placeholder />, state: 'loading' } };
export const Empty: Story = { args: { children: <Placeholder />, state: 'empty' } };
export const ErrorWithRetry: Story = {
  args: { children: <Placeholder />, errorMessage: 'Revenue API unavailable', onRetry: () => undefined, state: 'error' }
};
export const ErrorWithCustomRetryAction: Story = {
  args: {
    children: <Placeholder />,
    errorMessage: 'Revenue API unavailable',
    retryAction: <a href="#support">Contact support</a>,
    state: 'error'
  }
};
export const Reveal: Story = { args: { children: <Placeholder />, reveal: { active: true, label: 'Preparing chart' } } };
