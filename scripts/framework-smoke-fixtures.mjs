export const NEXT_VERSION = '16.3.1';
export const REACT_VERSION = '19.2.8';
export const RECHARTS_VERSION = '3.10.1';
export const VITE_VERSION = '8.2.1';

const sharedDependencies = (tarball) => ({
  '@standhigher/charts': tarball,
  react: REACT_VERSION,
  'react-dom': REACT_VERSION,
  'react-is': REACT_VERSION,
  recharts: RECHARTS_VERSION
});

export const createNextManifest = (tarball) => ({
  private: true,
  scripts: { build: 'next build' },
  dependencies: {
    ...sharedDependencies(tarball),
    next: NEXT_VERSION
  }
});

export const createViteManifest = (tarball) => ({
  private: true,
  type: 'module',
  scripts: { build: 'vite build' },
  dependencies: sharedDependencies(tarball),
  devDependencies: { vite: VITE_VERSION }
});

export const nextChartSource = `'use client';

import { TrendChart } from '@standhigher/charts';

const data = [{ date: '2026-08-19', revenue: 1250 }];

export function RevenueChart() {
  return (
    <TrendChart
      data={data}
      series={[{ id: 'revenue', label: 'Revenue', data }]}
      xKey="date"
    />
  );
}
`;

export const nextPageSource = `import { formatMoney } from '@standhigher/charts/formatters';
import { RevenueChart } from './chart';

export default function Page() {
  return (
    <main>
      <h1>{formatMoney(1250, { currency: 'USD', locale: 'en-US' })}</h1>
      <RevenueChart />
    </main>
  );
}
`;

export const nextLayoutSource = `export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`;

export const viteEntrySource = `import React from 'react';
import { createRoot } from 'react-dom/client';
import { TrendChart } from '@standhigher/charts';
import { formatMoney } from '@standhigher/charts/formatters';

const data = [{ date: '2026-08-19', revenue: 1250 }];

function App() {
  return (
    <main>
      <h1>{formatMoney(1250, { currency: 'USD', locale: 'en-US' })}</h1>
      <TrendChart
        data={data}
        series={[{ id: 'revenue', label: 'Revenue', data }]}
        xKey="date"
      />
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
`;

export const viteIndexSource = `<!doctype html>
<html lang="en">
  <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
  <body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body>
</html>
`;
