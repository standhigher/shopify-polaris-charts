// @vitest-environment node

import {
  CHART_COUNTS,
  POINT_COUNTS,
  assertBenchmarkBudgets,
  collectBenchmarkResults,
  createChartDescriptors,
  createTimeSeries
} from './benchmark-analytics.mjs';

describe('Analytics benchmark workload', () => {
  it.each(POINT_COUNTS)('creates %i deterministic time points', (pointCount) => {
    const first = createTimeSeries(pointCount);
    const second = createTimeSeries(pointCount);

    expect(first).toHaveLength(pointCount);
    expect(second).toEqual(first);
    expect(first[0]).toMatchObject({
      conversionRate: 0.03,
      currentRevenue: 1000,
      previousRevenue: 920
    });
  });

  it.each(CHART_COUNTS)('creates %i stable chart descriptors', (chartCount) => {
    const descriptors = createChartDescriptors(chartCount);

    expect(descriptors).toHaveLength(chartCount);
    expect(descriptors.map(({ id }) => id)).toEqual(
      Array.from({ length: chartCount }, (_, index) => `chart-${index}`)
    );
    expect(new Set(descriptors.map(({ type }) => type))).toEqual(
      chartCount > 1 ? new Set(['comparison', 'conversion']) : new Set(['comparison'])
    );
  });

  it('reports every matrix cell with timing, memory, and bundle measurements', async () => {
    const report = await collectBenchmarkResults(
      async (chartCount, pointCount) => ({
        chartCount,
        heapDeltaBytes: chartCount * pointCount,
        initialRenderMs: chartCount,
        pointCount,
        updateMs: pointCount
      }),
      { gzipBytes: 456, rawBytes: 1234 }
    );

    expect(report.results).toHaveLength(CHART_COUNTS.length * POINT_COUNTS.length);
    expect(report.bundle).toEqual({ gzipBytes: 456, rawBytes: 1234 });
    for (const result of report.results) {
      expect(Number.isFinite(result.initialRenderMs)).toBe(true);
      expect(Number.isFinite(result.updateMs)).toBe(true);
      expect(Number.isFinite(result.heapDeltaBytes)).toBe(true);
    }
  });

  it('accepts a complete report within the v1 release budgets', async () => {
    const report = await collectBenchmarkResults(
      async (chartCount, pointCount) => ({
        chartCount,
        heapDeltaBytes: 1024,
        initialRenderMs: 10,
        pointCount,
        updateMs: 5
      }),
      { gzipBytes: 10_000, rawBytes: 50_000 }
    );

    expect(() => assertBenchmarkBudgets(report)).not.toThrow();
  });

  it('rejects missing, non-finite, slow, memory-heavy, and oversized reports', async () => {
    const validReport = await collectBenchmarkResults(
      async (chartCount, pointCount) => ({
        chartCount,
        heapDeltaBytes: 1024,
        initialRenderMs: 10,
        pointCount,
        updateMs: 5
      }),
      { gzipBytes: 10_000, rawBytes: 50_000 }
    );

    expect(() => assertBenchmarkBudgets({ ...validReport, results: validReport.results.slice(1) })).toThrow(/matrix/i);
    expect(() => assertBenchmarkBudgets({
      ...validReport,
      results: validReport.results.map((cell, index) => index === 0 ? { ...cell, updateMs: Number.NaN } : cell)
    })).toThrow(/finite/i);
    expect(() => assertBenchmarkBudgets({
      ...validReport,
      results: validReport.results.map((cell, index) => index === 0 ? { ...cell, initialRenderMs: 2501 } : cell)
    })).toThrow(/initial/i);
    expect(() => assertBenchmarkBudgets({
      ...validReport,
      results: validReport.results.map((cell, index) => index === 0 ? { ...cell, heapDeltaBytes: 257 * 1024 * 1024 } : cell)
    })).toThrow(/heap/i);
    expect(() => assertBenchmarkBudgets({ ...validReport, bundle: { gzipBytes: 10_000, rawBytes: 111 * 1024 } })).toThrow(/raw/i);
    expect(() => assertBenchmarkBudgets({ ...validReport, bundle: { gzipBytes: 20 * 1024, rawBytes: 50_000 } })).toThrow(/gzip/i);
  });
});
