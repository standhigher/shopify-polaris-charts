import type { CartesianAxisOptions } from '../types';

/** Interval values accepted by the Recharts axis escape hatch. */
type RechartsAxisTicksConfig = {
  ticks?: ReadonlyArray<number | string>;
  interval?: number | string;
};

/**
 * Default maximum number of x-axis category ticks. When the data contains more
 * points than this, the axis shows an evenly-spaced subset that always includes
 * the first and last point, so the endpoints are never dropped and the middle
 * ticks stay uniformly distributed across the chart.
 */
export const DEFAULT_MAX_X_TICKS = 10;

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

/**
 * Resolves the x-axis ticks for a categorical axis.
 *
 * - Explicit `xAxis.ticks` (top-level or via the Recharts escape hatch) are
 *   returned untouched.
 * - An explicit `interval` (top-level or via the Recharts escape hatch) hands
 *   tick selection back to Recharts.
 * - Otherwise an evenly-spaced subset (first, last, and uniformly spread
 *   middle points) is computed so the axis always shows both endpoints.
 */
export function resolveXAxisTicks<TDatum extends object>(
  data: readonly TDatum[],
  xKey: keyof TDatum & string,
  xAxis: CartesianAxisOptions | undefined,
  rechartsAxis?: RechartsAxisTicksConfig
): ReadonlyArray<number | string> | undefined {
  if (xAxis?.ticks || rechartsAxis?.ticks) {
    return xAxis?.ticks ?? rechartsAxis?.ticks;
  }

  if (xAxis?.interval !== undefined || rechartsAxis?.interval !== undefined) {
    return undefined;
  }

  const values = data.map((datum) => datum[xKey]);

  return pickEvenValues(values, DEFAULT_MAX_X_TICKS) as Array<number | string>;
}
