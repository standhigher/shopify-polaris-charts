import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from '../components/ChartCard';
import { ComparisonChart } from '../components/ComparisonChart';
import { ConversionChart } from '../components/ConversionChart';
import { MetricCard } from '../components/MetricCard';
import type { ChartContentState } from '../types';
import {
  orderComparisonData,
  revenueComparisonData,
  storeConversionData
} from './sampleData';

const styles: Record<string, CSSProperties> = {
  chartGrid: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))'
  },
  dashboard: {
    background: '#f6f6f7',
    boxSizing: 'border-box',
    color: '#202223',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    minHeight: '100vh',
    padding: 16,
    width: '100%'
  },
  header: {
    marginBottom: 16
  },
  kicker: {
    color: '#6d7175',
    fontSize: 13,
    lineHeight: 1.4,
    margin: 0
  },
  metricGrid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
    marginBottom: 16
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 650,
    lineHeight: 1.3,
    margin: '4px 0'
  }
};

type AnalyticsDashboardState = Extract<ChartContentState, 'error' | 'loading' | 'ready'>;

export interface AnalyticsDashboardProps {
  state?: AnalyticsDashboardState;
}

export function AnalyticsDashboard({ state = 'ready' }: AnalyticsDashboardProps) {
  const metricState = state === 'loading' ? 'loading' : 'ready';

  return (
    <main style={styles.dashboard}>
      <header style={styles.header}>
        <p style={styles.kicker}>Shopify App analytics</p>
        <h1 style={styles.pageTitle}>Store performance</h1>
        <p style={styles.kicker}>Last 7 days, compared with previous period</p>
      </header>

      <section aria-label="Store metrics" style={styles.metricGrid}>
        <MetricCard
          comparison="Compared with previous period"
          state={metricState}
          title="Gross sales"
          trend={{ direction: 'up', value: '+12.4%' }}
          value="$173.3K"
        />
        <MetricCard
          comparison="Compared with previous period"
          state={metricState}
          title="Orders"
          trend={{ direction: 'up', value: '+10.1%' }}
          value="2,539"
        />
        <MetricCard
          comparison="Compared with previous period"
          state={metricState}
          title="Conversion rate"
          trend={{ direction: 'up', value: '+0.5 pts' }}
          value="4.1%"
        />
      </section>

      <section aria-label="Store analytics charts" style={styles.chartGrid}>
        <ChartCard
          metric="$173.3K"
          state="ready"
          subtitle="Gross sales compared with the previous period"
          title="Revenue trend"
          trendLabel="+12.4%"
        >
          <ComparisonChart
            comparisonSeries={{ dataKey: 'previousRevenue', label: 'Previous period' }}
            currentSeries={{ dataKey: 'currentRevenue', label: 'Current period', color: '#202223' }}
            data={revenueComparisonData}
            format="currency"
            height={260}
            mode="area"
            state={state}
            xFormat="date"
            xKey="date"
          />
        </ChartCard>

        <ChartCard
          metric="2,539"
          state="ready"
          subtitle="Order volume against the previous period"
          title="Orders compared with previous period"
          trendLabel="+10.1%"
        >
          <ComparisonChart
            comparisonSeries={{ dataKey: 'previousOrders', label: 'Previous period' }}
            currentSeries={{ dataKey: 'currentOrders', label: 'Current period', color: '#202223' }}
            data={orderComparisonData}
            format="number"
            height={260}
            state={state}
            xFormat="date"
            xKey="date"
          />
        </ChartCard>

        <ChartCard
          metric="4.1%"
          state="ready"
          subtitle="Online store sessions that became orders"
          title="Store conversion"
          trendLabel="+0.5 pts"
        >
          <ConversionChart
            data={storeConversionData}
            height={260}
            series={[{ dataKey: 'conversionRate', label: 'Conversion rate', color: '#202223' }]}
            state={state}
            target={{ label: 'Goal', value: 0.05 }}
            xFormat="date"
            xKey="date"
          />
        </ChartCard>
      </section>
    </main>
  );
}

const meta = {
  title: 'Examples/Analytics Dashboard',
  component: AnalyticsDashboard,
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta<typeof AnalyticsDashboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};

export const Loading: Story = {
  args: { state: 'loading' }
};

export const Error: Story = {
  args: { state: 'error' }
};
