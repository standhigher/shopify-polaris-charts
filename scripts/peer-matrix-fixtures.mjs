export const PEER_MATRICES = Object.freeze([
  Object.freeze({ react: '18.3.1', reactDom: '18.3.1', recharts: '3.10.1' }),
  Object.freeze({ react: '19.2.8', reactDom: '19.2.8', recharts: '3.10.1' })
]);

export const TYPESCRIPT_VERSIONS = Object.freeze(['5.4.5', '5.9.3']);

export const createPeerManifest = (tarball, matrix) => ({
  private: true,
  type: 'module',
  dependencies: {
    '@standhigher/charts': tarball,
    react: matrix.react,
    'react-dom': matrix.reactDom,
    'react-is': matrix.react,
    recharts: matrix.recharts
  }
});

export const createTypeManifest = (tarball, typescript) => ({
  private: true,
  type: 'module',
  scripts: { typecheck: 'tsc --noEmit' },
  dependencies: {
    '@standhigher/charts': tarball,
    react: '19.2.8',
    'react-dom': '19.2.8',
    'react-is': '19.2.8',
    recharts: '3.10.1'
  },
  devDependencies: {
    '@types/react': '19.2.18',
    '@types/react-dom': '19.2.4',
    typescript
  }
});

export const peerConsumerSource = `import React from 'react';
import { renderToString } from 'react-dom/server';
import { TrendChart } from '@standhigher/charts';
import { formatMoney } from '@standhigher/charts/formatters';

const data = [{ date: '2026-08-19', revenue: 1250 }];
const markup = renderToString(React.createElement(TrendChart, {
  data,
  series: [{ data, id: 'revenue', label: 'Revenue' }],
  xKey: 'date'
}));

if (!markup || formatMoney(1250, { currency: 'USD', locale: 'en-US' }) !== '$1,250.00') {
  throw new Error('Peer consumer smoke failed');
}
`;

export const typeConsumerSource = `import {
  ChartCard,
  ComboChart,
  ComparisonChart,
  ConversionChart,
  DonutChart,
  FunnelChart,
  MetricCard,
  StackedBarChart,
  TrendChart,
  conversionTrendPreset,
  funnelPreset,
  revenueTrendPreset,
  type ChartAccessibilityOptions
} from '@standhigher/charts';
import { formatMoney } from '@standhigher/charts/formatters';

const data = [{ date: '2026-08-19', current: 12, previous: 10 }];
const accessibility: ChartAccessibilityOptions = { label: 'Revenue analytics' };

const nodes = [
  <ChartCard state="ready" title="Chart"><TrendChart accessibility={accessibility} data={data} series={[{ data, id: 'current', label: 'Current' }]} xKey="date" /></ChartCard>,
  <MetricCard title="Revenue" value={formatMoney(12)} />,
  <ComparisonChart comparisonSeries={{ dataKey: 'previous', label: 'Previous' }} currentSeries={{ dataKey: 'current', label: 'Current' }} data={data} xKey="date" />,
  <ConversionChart data={data} series={[{ dataKey: 'current', label: 'Conversion' }]} xKey="date" />,
  <ComboChart data={data} series={[{ data, id: 'current', label: 'Current', type: 'bar' }]} xKey="date" />,
  <StackedBarChart data={data} series={[{ data, id: 'current', label: 'Current' }]} xKey="date" />,
  <DonutChart categoryKey="date" data={data} valueKey="current" />,
  <FunnelChart data={[{ id: 'view', label: 'View', value: 12 }]} />
];

void nodes;
void conversionTrendPreset;
void funnelPreset;
void revenueTrendPreset;
`;

export const typeScriptConfig = `${JSON.stringify({
  compilerOptions: {
    jsx: 'react-jsx',
    lib: ['DOM', 'ES2020'],
    module: 'ESNext',
    moduleResolution: 'Bundler',
    noEmit: true,
    skipLibCheck: false,
    strict: true,
    target: 'ES2020'
  },
  include: ['consumer.tsx']
}, null, 2)}\n`;
