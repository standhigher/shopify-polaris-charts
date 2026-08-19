// @vitest-environment node

import { createLegacySmokeManifest, validateLegacyExports } from './recharts-legacy-smoke.mjs';

describe('Recharts 2 legacy smoke runner', () => {
  it('pins the latest Recharts 2 release with React 18', () => {
    expect(createLegacySmokeManifest('file:/tmp/charts.tgz')).toEqual({
      dependencies: {
        '@standhigher/charts': 'file:/tmp/charts.tgz',
        react: '18.3.1',
        'react-dom': '18.3.1',
        'react-is': '18.3.1',
        recharts: '2.15.4'
      },
      private: true,
      type: 'module'
    });
  });

  it('requires representative Cartesian and v0.10 exports', () => {
    expect(() =>
      validateLegacyExports({
        ComparisonChart: () => undefined,
        ConversionChart: () => undefined,
        FunnelChart: () => undefined,
        TrendChart: () => undefined,
        revenueTrendPreset: {}
      })
    ).not.toThrow();
    expect(() => validateLegacyExports({ TrendChart: () => undefined })).toThrow(
      'Missing legacy smoke export: ComparisonChart'
    );
  });
});
