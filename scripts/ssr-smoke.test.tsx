// @vitest-environment node

import { createElement } from 'react';
import { renderToString } from 'react-dom/server';

import {
  ChartCard,
  ComboChart,
  ComparisonChart,
  ConversionChart,
  DonutChart,
  FunnelChart,
  MetricCard,
  StackedBarChart,
  TrendChart
} from '../src';

const trendData = [{ conversion: 0.04, current: 12, date: '2026-08-19', previous: 10 }];

describe('v1 server rendering contract', () => {
  it('imports without browser globals', () => {
    expect('window' in globalThis).toBe(false);
    expect('document' in globalThis).toBe(false);
  });

  it.each([
    ['ChartCard', createElement(ChartCard, { title: 'Revenue' }, 'Ready')],
    ['MetricCard', createElement(MetricCard, { title: 'Revenue', value: '$12' })],
    [
      'TrendChart',
      createElement(TrendChart, {
        data: trendData,
        series: [{ data: trendData, id: 'current', label: 'Current' }],
        xKey: 'date'
      })
    ],
    [
      'ComparisonChart',
      createElement(ComparisonChart, {
        comparisonSeries: { dataKey: 'previous', label: 'Previous' },
        currentSeries: { dataKey: 'current', label: 'Current' },
        data: trendData,
        xKey: 'date'
      })
    ],
    [
      'ConversionChart',
      createElement(ConversionChart, {
        data: trendData,
        series: [{ dataKey: 'conversion', label: 'Conversion' }],
        xKey: 'date'
      })
    ],
    [
      'ComboChart',
      createElement(ComboChart, {
        data: trendData,
        series: [{ data: trendData, id: 'current', label: 'Current', type: 'bar' }],
        xKey: 'date'
      })
    ],
    [
      'StackedBarChart',
      createElement(StackedBarChart, {
        data: trendData,
        series: [{ data: trendData, id: 'current', label: 'Current' }],
        xKey: 'date'
      })
    ],
    [
      'DonutChart',
      createElement(DonutChart, {
        categoryKey: 'date',
        data: trendData,
        valueKey: 'current'
      })
    ],
    [
      'FunnelChart',
      createElement(FunnelChart, {
        data: [{ id: 'view', label: 'Product view', value: 12 }]
      })
    ]
  ] as const)('renders %s to deterministic non-empty markup', (_name, element) => {
    const first = renderToString(element);
    const second = renderToString(element);

    expect(first.length).toBeGreaterThan(20);
    expect(second).toBe(first);
  });
});
