import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { performance } from 'node:perf_hooks';

export const CHART_COUNTS = Object.freeze([5, 10, 20]);
export const POINT_COUNTS = Object.freeze([100, 500, 1000]);
export const BENCHMARK_BUDGETS = Object.freeze({
  bundleGzipBytes: 19.5 * 1024,
  bundleRawBytes: 110 * 1024,
  heapDeltaBytes: 256 * 1024 * 1024,
  initialRenderMs: 2500,
  updateMs: 2500
});

export function createTimeSeries(pointCount) {
  return Array.from({ length: pointCount }, (_, index) => {
    const date = new Date(Date.UTC(2026, 0, 1));
    date.setUTCDate(date.getUTCDate() + index);

    return {
      conversionRate: 0.03 + (index % 10) * 0.001,
      currentRevenue: 1000 + (index % 30) * 17 + Math.floor(index / 30) * 3,
      date: date.toISOString().slice(0, 10),
      previousRevenue: 920 + (index % 30) * 15 + Math.floor(index / 30) * 2
    };
  });
}

export function createChartDescriptors(chartCount) {
  return Array.from({ length: chartCount }, (_, index) => ({
    id: `chart-${index}`,
    type: index % 2 === 0 ? 'comparison' : 'conversion'
  }));
}

export async function collectBenchmarkResults(measureCell, bundle) {
  const results = [];

  for (const chartCount of CHART_COUNTS) {
    for (const pointCount of POINT_COUNTS) {
      results.push(await measureCell(chartCount, pointCount));
    }
  }

  return {
    bundle,
    environment: {
      node: globalThis.process?.version ?? 'unknown',
      platform: globalThis.process?.platform ?? 'unknown'
    },
    results
  };
}

export async function measureBundleSizes(
  bundlePaths = [resolve('dist/index.js'), resolve('dist/formatters.js')]
) {
  const paths = Array.isArray(bundlePaths) ? bundlePaths : [bundlePaths];
  const sources = await Promise.all(paths.map((bundlePath) => readFile(bundlePath)));

  return {
    gzipBytes: sources.reduce((total, source) => total + gzipSync(source).byteLength, 0),
    rawBytes: sources.reduce((total, source) => total + source.byteLength, 0)
  };
}

export function assertBenchmarkBudgets(report) {
  const expectedCells = new Set(
    CHART_COUNTS.flatMap((chartCount) =>
      POINT_COUNTS.map((pointCount) => `${chartCount}:${pointCount}`)
    )
  );
  const actualCells = new Set(
    report.results.map(({ chartCount, pointCount }) => `${chartCount}:${pointCount}`)
  );

  if (
    report.results.length !== expectedCells.size ||
    actualCells.size !== expectedCells.size ||
    [...expectedCells].some((cell) => !actualCells.has(cell))
  ) {
    throw new Error('Benchmark matrix is incomplete or contains duplicate cells.');
  }

  for (const result of report.results) {
    for (const field of ['heapDeltaBytes', 'initialRenderMs', 'updateMs']) {
      if (!Number.isFinite(result[field])) {
        throw new Error(`Benchmark ${field} must be finite for ${result.chartCount}:${result.pointCount}.`);
      }
    }

    if (result.initialRenderMs > BENCHMARK_BUDGETS.initialRenderMs) {
      throw new Error(`Initial render exceeded the budget for ${result.chartCount}:${result.pointCount}.`);
    }
    if (result.updateMs > BENCHMARK_BUDGETS.updateMs) {
      throw new Error(`Update exceeded the budget for ${result.chartCount}:${result.pointCount}.`);
    }
    if (result.heapDeltaBytes > BENCHMARK_BUDGETS.heapDeltaBytes) {
      throw new Error(`Heap delta exceeded the budget for ${result.chartCount}:${result.pointCount}.`);
    }
  }

  if (!Number.isFinite(report.bundle.rawBytes) || report.bundle.rawBytes > BENCHMARK_BUDGETS.bundleRawBytes) {
    throw new Error('Bundle raw bytes exceeded the budget or were not finite.');
  }
  if (!Number.isFinite(report.bundle.gzipBytes) || report.bundle.gzipBytes > BENCHMARK_BUDGETS.bundleGzipBytes) {
    throw new Error('Bundle gzip bytes exceeded the budget or were not finite.');
  }
}

function installDom(dom) {
  const benchmarkWindow = dom.window;
  const defineGlobal = (name, value) => {
    Object.defineProperty(globalThis, name, { configurable: true, value, writable: true });
  };

  defineGlobal('window', benchmarkWindow);
  defineGlobal('document', benchmarkWindow.document);
  defineGlobal('navigator', benchmarkWindow.navigator);
  defineGlobal('HTMLElement', benchmarkWindow.HTMLElement);
  defineGlobal('SVGElement', benchmarkWindow.SVGElement);
  defineGlobal('Element', benchmarkWindow.Element);
  defineGlobal('self', benchmarkWindow);
  defineGlobal('requestAnimationFrame', (callback) => globalThis.setTimeout(() => callback(performance.now()), 0));
  defineGlobal('cancelAnimationFrame', (handle) => globalThis.clearTimeout(handle));
  defineGlobal('ResizeObserver', class ResizeObserver {
    constructor(callback) {
      this.callback = callback;
    }

    disconnect() {}

    observe(target) {
      this.callback([
        {
          contentRect: { bottom: 240, height: 240, left: 0, right: 640, top: 0, width: 640 },
          target
        }
      ], this);
    }

    unobserve() {}
  });
  benchmarkWindow.matchMedia = () => ({
    addEventListener() {},
    matches: false,
    media: '',
    removeEventListener() {}
  });
  benchmarkWindow.HTMLElement.prototype.getBoundingClientRect = () => ({
    bottom: 240,
    height: 240,
    left: 0,
    right: 640,
    toJSON() {},
    top: 0,
    width: 640,
    x: 0,
    y: 0
  });
}

const settleRender = () => new Promise((resolveFrame) => globalThis.setTimeout(resolveFrame, 0));

function createWorkload(React, charts, descriptors, data) {
  const { ComparisonChart, ConversionChart } = charts;

  return React.createElement(
    'div',
    { style: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' } },
    descriptors.map((descriptor) =>
      descriptor.type === 'comparison'
        ? React.createElement(ComparisonChart, {
            comparisonSeries: { dataKey: 'previousRevenue', label: 'Previous period' },
            currentSeries: { dataKey: 'currentRevenue', label: 'Current period' },
            data,
            height: 180,
            key: descriptor.id,
            showLegend: false,
            xKey: 'date'
          })
        : React.createElement(ConversionChart, {
            data,
            height: 180,
            key: descriptor.id,
            series: [{ dataKey: 'conversionRate', label: 'Conversion rate' }],
            showLegend: false,
            xKey: 'date'
          })
    )
  );
}

async function createDomBenchmark() {
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { pretendToBeVisual: true });
  installDom(dom);
  const [React, { createRoot }, { flushSync }, charts] = await Promise.all([
    import('react'),
    import('react-dom/client'),
    import('react-dom'),
    import('../dist/index.js')
  ]);

  return async (chartCount, pointCount) => {
    const container = globalThis.document.createElement('div');
    globalThis.document.body.append(container);
    const root = createRoot(container);
    const descriptors = createChartDescriptors(chartCount);
    const data = createTimeSeries(pointCount);
    globalThis.gc?.();
    const heapBefore = globalThis.process.memoryUsage().heapUsed;
    const initialStart = performance.now();

    flushSync(() => root.render(createWorkload(React, charts, descriptors, data)));
    await settleRender();
    const initialRenderMs = performance.now() - initialStart;
    const heapAfterInitialRender = globalThis.process.memoryUsage().heapUsed;
    const updatedData = data.map((datum) => ({
      ...datum,
      conversionRate: datum.conversionRate + 0.0001,
      currentRevenue: datum.currentRevenue + 1
    }));
    const updateStart = performance.now();

    flushSync(() => root.render(createWorkload(React, charts, descriptors, updatedData)));
    await settleRender();
    const updateMs = performance.now() - updateStart;
    const heapAfterUpdate = globalThis.process.memoryUsage().heapUsed;
    const heapDeltaBytes = Math.max(heapBefore, heapAfterInitialRender, heapAfterUpdate) - heapBefore;

    flushSync(() => root.unmount());
    container.remove();

    return { chartCount, heapDeltaBytes, initialRenderMs, pointCount, updateMs };
  };
}

export function formatBenchmarkMarkdown(report) {
  const lines = [
    '| Charts | Points | Initial render (ms) | Update (ms) | Heap delta (bytes) |',
    '|---:|---:|---:|---:|---:|'
  ];

  for (const result of report.results) {
    lines.push(
      `| ${result.chartCount} | ${result.pointCount} | ${result.initialRenderMs.toFixed(2)} | ` +
      `${result.updateMs.toFixed(2)} | ${result.heapDeltaBytes} |`
    );
  }

  lines.push('', `Bundle: ${report.bundle.rawBytes} raw bytes / ${report.bundle.gzipBytes} gzip bytes.`);
  return lines.join('\n');
}

export async function runAnalyticsBenchmark() {
  const measureCell = await createDomBenchmark();
  return collectBenchmarkResults(measureCell, await measureBundleSizes());
}

async function main() {
  const report = await runAnalyticsBenchmark();
  assertBenchmarkBudgets(report);
  globalThis.console.log('ANALYTICS_BENCHMARK_JSON');
  globalThis.console.log(JSON.stringify(report, null, 2));
  globalThis.console.log('ANALYTICS_BENCHMARK_MARKDOWN');
  globalThis.console.log(formatBenchmarkMarkdown(report));
}

const invokedPath = globalThis.process.argv[1] ? resolve(globalThis.process.argv[1]) : '';

if (invokedPath === fileURLToPath(import.meta.url)) {
  await main();
}
