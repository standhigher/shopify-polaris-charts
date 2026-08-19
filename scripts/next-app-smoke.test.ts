// @vitest-environment node

import {
  NEXT_VERSION,
  REACT_VERSION,
  RECHARTS_VERSION,
  createNextManifest,
  nextChartSource,
  nextPageSource
} from './framework-smoke-fixtures.mjs';

describe('Next.js App Router consumer fixture', () => {
  it('pins the approved compatibility matrix and client boundary', () => {
    expect(createNextManifest('file:/tmp/charts.tgz')).toMatchObject({
      dependencies: {
        '@standhigher/charts': 'file:/tmp/charts.tgz',
        next: NEXT_VERSION,
        react: REACT_VERSION,
        'react-dom': REACT_VERSION,
        recharts: RECHARTS_VERSION
      }
    });
    expect(nextChartSource).toContain("'use client'");
    expect(nextChartSource).toContain("from '@standhigher/charts'");
    expect(nextPageSource).toContain("from '@standhigher/charts/formatters'");
  });
});
