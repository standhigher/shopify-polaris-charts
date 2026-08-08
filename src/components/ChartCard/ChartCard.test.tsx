import { render, screen } from '@testing-library/react';

import { ChartCard } from './ChartCard';
import type { ChartState } from '../../types';

const states: Array<{ state: ChartState; text: string }> = [
  { state: 'loading', text: 'Loading chart' },
  { state: 'empty', text: 'No data available' },
  { state: 'error', text: 'Unable to load chart' },
  { state: 'no-permission', text: 'No permission to view this chart' },
  { state: 'stale', text: 'Data may be out of date' },
  { state: 'ready', text: 'Chart content' }
];

describe('ChartCard', () => {
  it.each(states)('renders accessible title and %s state content', ({ state, text }) => {
    render(
      <ChartCard title="Sales over time" state={state} errorMessage="Revenue API unavailable">
        <div>Chart content</div>
      </ChartCard>
    );

    expect(screen.getByRole('heading', { name: 'Sales over time' })).toBeVisible();
    expect(screen.getByText(text)).toBeVisible();
  });

  it('renders the provided error message in the error state', () => {
    render(
      <ChartCard
        title="Sales over time"
        state="error"
        errorMessage="Revenue API unavailable"
      >
        <div>Chart content</div>
      </ChartCard>
    );

    expect(screen.getByText('Revenue API unavailable')).toBeVisible();
  });

  it('renders metadata, controls, and ready children together', () => {
    render(
      <ChartCard
        title="Sales over time"
        subtitle="Last 30 days"
        metric="$12,400"
        trendLabel="+8.2%"
        actions={<button type="button">Export</button>}
        filters={<label htmlFor="range">Range</label>}
        state="ready"
      >
        <div>Chart content</div>
      </ChartCard>
    );

    expect(screen.getByText('Last 30 days')).toBeVisible();
    expect(screen.getByText('$12,400')).toBeVisible();
    expect(screen.getByText('+8.2%')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Export' })).toBeVisible();
    expect(screen.getByText('Range')).toBeVisible();
    expect(screen.getByText('Chart content')).toBeVisible();
  });
});
