import type { CartesianAxisOptions } from '../types';

/** Interval values accepted by the Recharts axis escape hatch. */
type RechartsAxisTicksConfig = {
  ticks?: ReadonlyArray<number | string>;
  interval?: number | string;
};

/** Fallback chart width used when no layout measurement is available (SSR, jsdom). */
export const DEFAULT_CHART_WIDTH = 640;

/** Estimated average character width of a 12px axis tick label, in pixels. */
const TICK_LABEL_CHAR_WIDTH = 7;

/** Minimum horizontal space between two tick labels, in pixels. */
const TICK_LABEL_HORIZONTAL_GAP = 24;

/**
 * Resolves how many evenly-spaced x-axis ticks fit in the available width.
 * The count is driven by the widest rendered label: longer labels (or a
 * narrower chart) yield fewer ticks so labels never collide.
 */
export function resolveMaxTickCount(
  values: readonly unknown[],
  chartWidth: number,
  formatLabel?: (value: unknown) => string
): number {
  const widestLabelLength = values.reduce<number>((widest, value) => {
    const text = formatLabel ? formatLabel(value) : String(value);

    return Math.max(widest, text.length);
  }, 0);
  const labelWidth = Math.max(widestLabelLength * TICK_LABEL_CHAR_WIDTH, 1);
  const maxCount = Math.floor(chartWidth / (labelWidth + TICK_LABEL_HORIZONTAL_GAP));

  return Math.max(2, Math.min(values.length, maxCount));
}

/**
 * Picks an evenly-spaced subset of values that always includes the first and
 * last entries. With `count <= maxCount` the full list is returned unchanged.
 * Larger lists are sampled by index so the chosen values are spread uniformly
 * across the axis (including the first and last position).
 */
export function pickEvenValues<T>(values: readonly T[], maxCount: number): T[] {
  const count = values.length;

  if (count === 0) {
    return [];
  }

  if (count <= maxCount) {
    return [...values];
  }

  const ticks: T[] = [];

  for (let i = 0; i < maxCount; i += 1) {
    const index = Math.round((i * (count - 1)) / (maxCount - 1));
    const value = values[index];

    if (ticks.length === 0 || ticks[ticks.length - 1] !== value) {
      ticks.push(value);
    }
  }

  return ticks;
}

export interface XAxisTickResolutionOptions {
  /** Rendered width of the chart container in pixels. */
  chartWidth: number;
  /** Formats a value the way the axis label renders it, to estimate label width. */
  formatLabel?: (value: unknown) => string;
}

/**
 * Resolves the x-axis ticks for a categorical axis.
 *
 * - Explicit `xAxis.ticks` (top-level or via the Recharts escape hatch) are
 *   returned untouched.
 * - An explicit `interval` (top-level or via the Recharts escape hatch) hands
 *   tick selection back to Recharts.
 * - Otherwise an evenly-spaced subset is computed whose size adapts to the
 *   widest label and the available width. The first and last points are always
 *   shown and the middle ticks stay uniformly distributed, dropping labels
 *   only when they would otherwise collide.
 */
export function resolveXAxisTicks<TDatum extends object>(
  data: readonly TDatum[],
  xKey: keyof TDatum & string,
  xAxis: CartesianAxisOptions | undefined,
  rechartsAxis?: RechartsAxisTicksConfig,
  options: XAxisTickResolutionOptions = { chartWidth: DEFAULT_CHART_WIDTH }
): ReadonlyArray<number | string> | undefined {
  if (xAxis?.ticks || rechartsAxis?.ticks) {
    return xAxis?.ticks ?? rechartsAxis?.ticks;
  }

  if (xAxis?.interval !== undefined || rechartsAxis?.interval !== undefined) {
    return undefined;
  }

  const values = data.map((datum) => datum[xKey]);
  const maxCount = resolveMaxTickCount(values, options.chartWidth, options.formatLabel);

  return pickEvenValues(values, maxCount) as Array<number | string>;
}
