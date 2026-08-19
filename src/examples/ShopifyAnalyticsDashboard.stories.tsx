import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from '../components/ChartCard';
import { ComparisonChart } from '../components/ComparisonChart';
import { ConversionChart } from '../components/ConversionChart';
import { FunnelChart } from '../components/FunnelChart';
import { MetricCard } from '../components/MetricCard';
import { TrendChart } from '../components/TrendChart';
import {
  conversionTrendPreset,
  funnelPreset,
  orderTrendPreset,
  revenueTrendPreset
} from '../presets';
import { shopifyAnalyticsDashboardData } from './sampleData';

const styles: Record<string, CSSProperties> = {
  chartGrid: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))'
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
    alignItems: 'flex-end',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
    marginBottom: 16
  },
  label: {
    color: '#6d7175',
    display: 'flex',
    flexDirection: 'column',
    fontSize: 12,
    fontWeight: 600,
    gap: 4
  },
  metricGrid: {
    display: 'grid',
    gap: 12,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))'
  },
  pageTitle: {
    fontSize: 24,
    lineHeight: 1.25,
    margin: '4px 0'
  },
  section: {
    marginTop: 20
  },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 1.35,
    margin: '0 0 10px'
  },
  select: {
    background: '#ffffff',
    border: '1px solid #8c9196',
    borderRadius: 6,
    color: '#202223',
    font: 'inherit',
    minHeight: 36,
    padding: '6px 30px 6px 10px'
  },
  subtitle: {
    color: '#6d7175',
    fontSize: 13,
    margin: 0
  }
};

type DashboardRange = keyof typeof shopifyAnalyticsDashboardData;
type DashboardState = 'error' | 'loading' | 'partial-empty' | 'ready';

export interface ShopifyAnalyticsDashboardProps {
  initialRange?: DashboardRange;
  onRetry?: () => void;
  progressiveReveal?: boolean;
  state?: DashboardState;
}

const noOp = () => undefined;

export function ShopifyAnalyticsDashboard({
  initialRange = '7d',
  onRetry,
  progressiveReveal = false,
  state = 'ready'
}: ShopifyAnalyticsDashboardProps) {
  const [range, setRange] = useState<DashboardRange>(initialRange);
  const [revealActive, setRevealActive] = useState(progressiveReveal);
  const scenario = shopifyAnalyticsDashboardData[range];
  const baseChartState = state === 'loading' ? 'loading' : 'ready';
  const orderState = state === 'error' ? 'error' : state === 'partial-empty' ? 'empty' : baseChartState;
  const funnelState = state === 'partial-empty' ? 'empty' : baseChartState;
  const metricState = state === 'loading' ? 'loading' : 'ready';
  const reveal = progressiveReveal && state === 'ready' ? { active: revealActive } : false;

  useEffect(() => {
    if (!revealActive) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => setRevealActive(false));

    return () => cancelAnimationFrame(frame);
  }, [revealActive]);

  return (
    <main style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <p style={styles.subtitle}>Shopify App analytics</p>
          <h1 style={styles.pageTitle}>Store performance</h1>
          <p style={styles.subtitle}>App-owned commerce and conversion data</p>
        </div>
        <label style={styles.label}>
          Date range
          <select
            aria-label="Date range"
            onChange={(event) => {
              setRange(event.target.value as DashboardRange);
              if (progressiveReveal) {
                setRevealActive(true);
              }
            }}
            style={styles.select}
            value={range}
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </label>
      </header>

      <section aria-labelledby="dashboard-metrics-heading" style={styles.section}>
        <h2 id="dashboard-metrics-heading" style={styles.sectionTitle}>Metric Cards</h2>
        <div style={styles.metricGrid}>
          <MetricCard comparison="Compared with previous period" state={metricState} title="Revenue" trend={{ direction: 'up', value: '+12.4%' }} value={scenario.metrics.revenue} />
          <MetricCard comparison="Compared with previous period" state={metricState} title="Orders" trend={{ direction: 'up', value: '+10.1%' }} value={scenario.metrics.orders} />
          <MetricCard comparison="Compared with previous period" state={metricState} title="Conversion Rate" trend={{ direction: 'up', value: '+0.5 pts' }} value={scenario.metrics.conversion} />
          <MetricCard comparison="Compared with previous period" state={metricState} title="AOV" trend={{ direction: 'up', value: '+1.8%' }} value={scenario.metrics.aov} />
          <MetricCard comparison={state === 'partial-empty' ? 'No customer data' : 'Compared with previous period'} state={metricState} title="Customers" trend={state === 'partial-empty' ? undefined : { direction: 'up', value: '+8.6%' }} value={state === 'partial-empty' ? '—' : scenario.metrics.customers} />
          <MetricCard comparison="Accepted offers divided by shown offers" state={metricState} title="Upsell Conversion" trend={{ direction: 'neutral', value: '0.0 pts' }} value={scenario.metrics.upsellConversion} />
        </div>
      </section>

      <section aria-labelledby="dashboard-trend-heading" style={styles.section}>
        <h2 id="dashboard-trend-heading" style={styles.sectionTitle}>Trend</h2>
        <div style={styles.chartGrid}>
          <ChartCard metric={scenario.metrics.revenue} state="ready" subtitle="Gross sales over the selected range" title="Revenue trend" trendLabel="+12.4%">
            <TrendChart
              data={[...scenario.revenue]}
              format={revenueTrendPreset.format}
              height={260}
              reveal={reveal}
              series={[{ data: [...scenario.revenue], id: 'currentRevenue', ...revenueTrendPreset.currentSeries }]}
              state={baseChartState}
              xFormat="date"
              xKey="date"
            />
          </ChartCard>
        </div>
      </section>

      <section aria-labelledby="dashboard-comparison-heading" style={styles.section}>
        <h2 id="dashboard-comparison-heading" style={styles.sectionTitle}>Comparison</h2>
        <div style={styles.chartGrid}>
          <ChartCard metric={scenario.metrics.orders} state="ready" subtitle="Orders against the previous period" title="Order comparison" trendLabel="+10.1%">
            <ComparisonChart
              comparisonSeries={{ dataKey: 'previousOrders', ...orderTrendPreset.comparisonSeries! }}
              currentSeries={{ dataKey: 'currentOrders', ...orderTrendPreset.currentSeries }}
              data={[...scenario.orders]}
              emptyMessage="No order comparison for this period"
              errorMessage="Orders comparison could not be loaded"
              format={orderTrendPreset.format}
              height={260}
              onRetry={onRetry ?? noOp}
              retryLabel="Retry orders comparison"
              reveal={reveal}
              state={orderState}
              xFormat="date"
              xKey="date"
            />
          </ChartCard>
        </div>
      </section>

      <section aria-labelledby="dashboard-conversion-heading" style={styles.section}>
        <h2 id="dashboard-conversion-heading" style={styles.sectionTitle}>Conversion</h2>
        <div style={styles.chartGrid}>
          <ChartCard metric={scenario.metrics.conversion} state="ready" subtitle="Sessions that became orders" title="Store conversion" trendLabel="+0.5 pts">
            <ConversionChart
              data={[...scenario.conversion]}
              height={260}
              reveal={reveal}
              series={[{ dataKey: 'conversionRate', ...conversionTrendPreset.currentSeries }]}
              state={baseChartState}
              target={{ label: 'Goal', value: 0.05 }}
              xFormat="date"
              xKey="date"
            />
          </ChartCard>
        </div>
      </section>

      <section aria-labelledby="dashboard-funnel-heading" style={styles.section}>
        <h2 id="dashboard-funnel-heading" style={styles.sectionTitle}>Funnel</h2>
        <div style={styles.chartGrid}>
          <ChartCard metric="1,132 purchases" state="ready" subtitle="Prepared funnel metrics from app-owned data" title="Online store funnel">
            <FunnelChart
              colors={funnelPreset.colors}
              data={[...scenario.funnel]}
              emptyMessage="No funnel activity for this period"
              format={funnelPreset.format}
              percentageInput={funnelPreset.percentageInput}
              reveal={reveal}
              state={funnelState}
            />
          </ChartCard>
        </div>
      </section>
    </main>
  );
}

const meta = {
  component: ShopifyAnalyticsDashboard,
  parameters: { layout: 'fullscreen' },
  title: 'Examples/Shopify Analytics Dashboard'
} satisfies Meta<typeof ShopifyAnalyticsDashboard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Ready: Story = {};
export const DateRangeInteraction: Story = { args: { initialRange: '30d' } };
export const Loading: Story = { args: { state: 'loading' } };
export const PartialEmpty: Story = { args: { state: 'partial-empty' } };
export const LocalizedErrorWithRetry: Story = { args: { state: 'error' } };
export const ProgressiveReveal: Story = { args: { progressiveReveal: true } };
