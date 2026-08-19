// @vitest-environment node

import {
  PEER_MATRICES,
  TYPESCRIPT_VERSIONS,
  createPeerManifest,
  createTypeManifest,
  peerConsumerSource,
  typeConsumerSource
} from './peer-matrix-fixtures.mjs';

describe('v1 peer and declaration matrices', () => {
  it('supports React 18 and 19 with Recharts 3 only', () => {
    expect(PEER_MATRICES).toEqual([
      { react: '18.3.1', reactDom: '18.3.1', recharts: '3.10.1' },
      { react: '19.2.8', reactDom: '19.2.8', recharts: '3.10.1' }
    ]);

    for (const matrix of PEER_MATRICES) {
      expect(createPeerManifest('file:/tmp/charts.tgz', matrix).dependencies).toMatchObject({
        '@standhigher/charts': 'file:/tmp/charts.tgz',
        react: matrix.react,
        'react-dom': matrix.reactDom,
        recharts: matrix.recharts
      });
    }
    expect(peerConsumerSource).toContain("from '@standhigher/charts'");
    expect(peerConsumerSource).toContain("from '@standhigher/charts/formatters'");
  });

  it('compiles declarations with the minimum and repository compiler', () => {
    expect(TYPESCRIPT_VERSIONS).toEqual(['5.4.5', '5.9.3']);

    for (const version of TYPESCRIPT_VERSIONS) {
      expect(createTypeManifest('file:/tmp/charts.tgz', version).devDependencies.typescript).toBe(version);
    }
    expect(typeConsumerSource).toContain('ChartAccessibilityOptions');
    expect(typeConsumerSource).toContain('revenueTrendPreset');
    expect(typeConsumerSource).toContain("from '@standhigher/charts/formatters'");
  });
});
