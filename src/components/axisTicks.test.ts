import { describe, expect, it } from 'vitest';

import type { CartesianAxisOptions } from '../types';
import {
  DEFAULT_MAX_X_TICKS,
  pickEvenValues,
  resolveXAxisTicks
} from './axisTicks';

interface TestDatum {
  date: string;
  value: number;
}

const data: TestDatum[] = Array.from({ length: 20 }, (_, index) => ({
  date: `2026-07-${String(index + 1).padStart(2, '0')}`,
  value: index
}));

describe('pickEvenValues', () => {
  it('returns an empty list for empty input', () => {
    expect(pickEvenValues([], 10)).toEqual([]);
  });

  it('returns the full list when it fits within the budget', () => {
    expect(pickEvenValues(['a', 'b', 'c'], 10)).toEqual(['a', 'b', 'c']);
  });

  it('always includes the first and last values for larger lists', () => {
    const values = Array.from({ length: 20 }, (_, index) => index);
    const ticks = pickEvenValues(values, DEFAULT_MAX_X_TICKS);

    expect(ticks).toHaveLength(DEFAULT_MAX_X_TICKS);
    expect(ticks[0]).toBe(0);
    expect(ticks[ticks.length - 1]).toBe(19);
  });

  it('spreads the middle ticks evenly across the axis', () => {
    const values = Array.from({ length: 20 }, (_, index) => index);
    const ticks = pickEvenValues(values, 6);

    expect(ticks).toEqual([0, 4, 8, 11, 15, 19]);
  });

  it('does not mutate the input list', () => {
    const values = ['a', 'b', 'c'];

    expect(pickEvenValues(values, 10)).toEqual(['a', 'b', 'c']);
    expect(values).toEqual(['a', 'b', 'c']);
  });
});

describe('resolveXAxisTicks', () => {
  it('returns explicit ticks untouched', () => {
    const xAxis: CartesianAxisOptions = { ticks: ['first', 'last'] };

    expect(resolveXAxisTicks(data, 'date', xAxis)).toEqual(['first', 'last']);
  });

  it('hands tick selection back to Recharts when an interval is configured', () => {
    expect(resolveXAxisTicks(data, 'date', { interval: 'preserveStartEnd' })).toBeUndefined();
    expect(resolveXAxisTicks(data, 'date', { interval: 3 })).toBeUndefined();
  });

  it('respects interval and ticks from the Recharts escape hatch', () => {
    expect(resolveXAxisTicks(data, 'date', undefined, { interval: 'preserveEnd' })).toBeUndefined();
    expect(resolveXAxisTicks(data, 'date', undefined, { ticks: ['first', 'last'] })).toEqual(['first', 'last']);
    expect(resolveXAxisTicks(data, 'date', { ticks: ['explicit'] }, { interval: 'preserveEnd' })).toEqual(['explicit']);
  });

  it('computes an even subset with both endpoints by default', () => {
    const ticks = resolveXAxisTicks(data, 'date', undefined);

    expect(ticks).toBeDefined();
    expect(ticks?.[0]).toBe('2026-07-01');
    expect(ticks?.[ticks.length - 1]).toBe('2026-07-20');
    expect(ticks?.length).toBeLessThanOrEqual(DEFAULT_MAX_X_TICKS);
  });

  it('computes an even subset that mirrors small data sets completely', () => {
    const small = [{ date: '2026-07-01', value: 1 }, { date: '2026-07-02', value: 2 }];

    expect(resolveXAxisTicks(small, 'date', undefined)).toEqual(['2026-07-01', '2026-07-02']);
  });

  it('returns no ticks for empty data', () => {
    expect(resolveXAxisTicks([], 'date', undefined)).toEqual([]);
  });
});
