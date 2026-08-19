// @vitest-environment node

import {
  REACT_VERSION,
  RECHARTS_VERSION,
  VITE_VERSION,
  createViteManifest,
  viteEntrySource
} from './framework-smoke-fixtures.mjs';

describe('Vite consumer fixture', () => {
  it('pins the approved compatibility matrix and public entries', () => {
    expect(createViteManifest('file:/tmp/charts.tgz')).toMatchObject({
      dependencies: {
        '@standhigher/charts': 'file:/tmp/charts.tgz',
        react: REACT_VERSION,
        'react-dom': REACT_VERSION,
        recharts: RECHARTS_VERSION
      },
      devDependencies: { vite: VITE_VERSION }
    });
    expect(viteEntrySource).toContain("from '@standhigher/charts'");
    expect(viteEntrySource).toContain("from '@standhigher/charts/formatters'");
  });
});
