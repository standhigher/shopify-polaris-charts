import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from '../components/ChartCard';
import { ComboChart } from '../components/ComboChart';
import { DonutChart } from '../components/DonutChart';
import { StackedBarChart } from '../components/StackedBarChart';
import { TrendChart } from '../components/TrendChart';
import {
  fulfillmentByChannelData,
  ordersAndConversionData,
  overviewMetrics,
  revenueTrendData,
  topProductsData,
  trafficSourceData
} from './sampleData';

const styles: Record<string, CSSProperties> = {
  actionButton: {
    background: '#ffffff',
    border: '1px solid #babfc3',
    borderRadius: 6,
    color: '#202223',
    font: 'inherit',
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1,
    padding: '8px 12px'
  },
  badge: {
    background: '#f1f2f4',
    border: '1px solid #dcdfe4',
    borderRadius: 6,
    color: '#3b3f44',
    display: 'inline-flex',
    fontSize: 12,
    fontWeight: 650,
    lineHeight: 1,
    padding: '6px 8px'
  },
  chartGrid: {
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))'
  },
  dashboard: {
    background: '#f6f6f7',
    color: '#202223',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    minHeight: '100vh',
    padding: 24
  },
  filterPill: {
    background: '#f6f6f7',
    border: '1px solid #dcdfe4',
    borderRadius: 6,
    color: '#3b3f44',
    fontSize: 12,
    fontWeight: 600,
    lineHeight: 1,
    padding: '7px 10px'
  },
  header: {
    alignItems: 'flex-start',
    display: 'flex',
    gap: 16,
    justifyContent: 'space-between',
    margin: '0 0 16px'
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 180px), 1fr))',
    marginBottom: 16
  },
  metricLabel: {
    color: '#6d7175',
    fontSize: 12,
    lineHeight: 1.35,
    margin: 0
  },
  metricTile: {
    background: '#ffffff',
    border: '1px solid #dcdfe4',
    borderRadius: 8,
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.05)',
    padding: 16
  },
  metricTrend: {
    color: '#008060',
    fontSize: 12,
    fontWeight: 650,
    lineHeight: 1.35
  },
  metricValue: {
    color: '#202223',
    fontSize: 22,
    fontWeight: 650,
    lineHeight: 1.2,
    margin: '6px 0 0'
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: 650,
    letterSpacing: 0,
    lineHeight: 1.3,
    margin: '4px 0'
  },
  shell: {
    margin: '0 auto',
    maxWidth: 1180
  },
  wide: {
    gridColumn: '1 / -1'
  }
};

const meta = {
  title: 'Examples/Phase One Overview',
  parameters: {
    layout: 'fullscreen'
  }
} satisfies Meta;

export default meta;

type Story = StoryObj;

export function PhaseOneOverview() {
  return (
    <main style={styles.dashboard}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div>
            <p style={styles.kicker}>Shopify App dashboard sample</p>
            <h1 style={styles.pageTitle}>Phase one chart overview</h1>
            <p style={styles.kicker}>Last 8 days, compared with previous period</p>
          </div>
          <button style={styles.actionButton} type="button">
            Export
          </button>
        </header>

        <section aria-label="Dashboard metrics" style={styles.metricGrid}>
          {overviewMetrics.map((metric) => (
            <div key={metric.label} style={styles.metricTile}>
              <p style={styles.metricLabel}>{metric.label}</p>
              <p style={styles.metricValue}>{metric.value}</p>
              <span style={styles.metricTrend}>{metric.delta}</span>
            </div>
          ))}
        </section>

        <section aria-label="Phase one chart components" style={styles.chartGrid}>
          <div style={styles.wide}>
            <ChartCard
              actions={<span style={styles.badge}>TrendChart</span>}
              filters={<span style={styles.filterPill}>Daily</span>}
              metric="$176.5K"
              state="ready"
              subtitle="Gross sales and net sales"
              title="Revenue trend"
              trendLabel="+13.8%"
            >
              <TrendChart
                data={revenueTrendData}
                format="currency"
                height={300}
                mode="area"
                series={[
                  { id: 'grossSales', label: 'Gross sales', data: revenueTrendData, color: '#2c6ecb' },
                  { id: 'netSales', label: 'Net sales', data: revenueTrendData, color: '#008060' }
                ]}
                xFormat="date"
                xKey="date"
              />
            </ChartCard>
          </div>

          <ChartCard
            actions={<span style={styles.badge}>DonutChart</span>}
            metric="49.5K sessions"
            state="ready"
            subtitle="Sessions by acquisition source"
            title="Traffic source mix"
          >
            <DonutChart
              centerLabel="49.5K"
              categoryKey="source"
              data={trafficSourceData}
              format="compact"
              height={280}
              valueKey="sessions"
            />
          </ChartCard>

          <ChartCard
            actions={<span style={styles.badge}>StackedBarChart</span>}
            filters={<span style={styles.filterPill}>By channel</span>}
            metric="1,863 orders"
            state="ready"
            subtitle="Fulfilled, pending, and returned orders"
            title="Fulfillment status"
            trendLabel="+7.4%"
          >
            <StackedBarChart
              data={fulfillmentByChannelData}
              format="number"
              height={280}
              series={[
                { id: 'fulfilled', label: 'Fulfilled', data: fulfillmentByChannelData, color: '#008060' },
                { id: 'pending', label: 'Pending', data: fulfillmentByChannelData, color: '#b98900' },
                { id: 'returned', label: 'Returned', data: fulfillmentByChannelData, color: '#d72c0d' }
              ]}
              xKey="channel"
            />
          </ChartCard>

          <div style={styles.wide}>
            <ChartCard
              actions={<span style={styles.badge}>ComboChart</span>}
              metric="2,758 orders"
              state="ready"
              subtitle="Order volume with conversion rate"
              title="Orders and conversion"
              trendLabel="+9.6%"
            >
              <ComboChart
                data={ordersAndConversionData}
                height={300}
                series={[
                  {
                    id: 'orders',
                    label: 'Orders',
                    data: ordersAndConversionData,
                    type: 'bar',
                    format: 'number',
                    color: '#2c6ecb'
                  },
                  {
                    id: 'conversionRate',
                    label: 'Conversion rate',
                    data: ordersAndConversionData,
                    type: 'line',
                    format: 'percent',
                    color: '#008060'
                  }
                ]}
                xFormat="date"
                xKey="date"
              />
            </ChartCard>
          </div>

          <ChartCard
            actions={<span style={styles.badge}>ChartCard</span>}
            metric="$55.7K"
            state="ready"
            subtitle="Card shell with header, metric, controls, and content"
            title="Top products"
            trendLabel="+5.2%"
          >
            <StackedBarChart
              data={topProductsData}
              format="currency"
              height={260}
              series={[{ id: 'revenue', label: 'Revenue', data: topProductsData, color: '#5c6ac4' }]}
              xKey="product"
            />
          </ChartCard>
        </section>
      </div>
    </main>
  );
}

export const Overview: Story = {
  render: () => <PhaseOneOverview />
};
