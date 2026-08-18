import {describe, expect, it} from 'vitest';

import {
  createAnalyticsSeries,
  findAvailableDataKey,
  normalizePercentageData,
} from './analytics';

interface RevenueDatum {
  month: string;
  currentRevenue: number;
  previousRevenue: number | null;
  note?: string;
}

describe('createAnalyticsSeries', () => {
  it('creates current and previous revenue series without copying the data', () => {
    const data: RevenueDatum[] = [
      {month: 'Jan', currentRevenue: 420, previousRevenue: 390},
    ];

    const current = createAnalyticsSeries(data, {
      dataKey: 'currentRevenue',
      label: 'Current revenue',
      color: '#008060',
      opacity: 0.9,
      strokeWidth: 3,
    });
    const previous = createAnalyticsSeries(data, {
      dataKey: 'previousRevenue',
      label: 'Previous revenue',
      strokeDasharray: '4 2',
    });

    expect(current).toEqual({
      id: 'currentRevenue',
      label: 'Current revenue',
      data,
      color: '#008060',
      opacity: 0.9,
      strokeWidth: 3,
    });
    expect(previous).toEqual({
      id: 'previousRevenue',
      label: 'Previous revenue',
      data,
      strokeDasharray: '4 2',
    });
    expect(current.data).toBe(data);
    expect(previous.data).toBe(data);
  });

  it('preserves explicit zero presentation values', () => {
    const data: RevenueDatum[] = [
      {month: 'Jan', currentRevenue: 420, previousRevenue: 390},
    ];

    expect(
      createAnalyticsSeries(data, {
        dataKey: 'currentRevenue',
        label: 'Current revenue',
        opacity: 0,
        strokeDasharray: 0,
      })
    ).toMatchObject({opacity: 0, strokeDasharray: 0});
  });
});

describe('normalizePercentageData', () => {
  it('returns ratio input unchanged', () => {
    const data: RevenueDatum[] = [
      {month: 'Jan', currentRevenue: 0.042, previousRevenue: null},
    ];

    expect(
      normalizePercentageData(data, ['currentRevenue', 'previousRevenue'], 'ratio')
    ).toBe(data);
  });

  it('immutably converts selected finite percentage fields and preserves other values', () => {
    const data = [
      {
        month: 'Jan',
        currentRevenue: 4.2,
        previousRevenue: null as number | null,
        note: 'launch',
        nonNumeric: '4.2',
        unavailable: Number.POSITIVE_INFINITY,
      },
    ];

    const normalized = normalizePercentageData(
      data,
      ['currentRevenue', 'previousRevenue', 'nonNumeric', 'unavailable'],
      'percent'
    );

    expect(normalized).not.toBe(data);
    expect(normalized[0]).not.toBe(data[0]);
    expect(normalized[0]).toEqual({
      month: 'Jan',
      currentRevenue: 0.042,
      previousRevenue: null,
      note: 'launch',
      nonNumeric: '4.2',
      unavailable: Number.POSITIVE_INFINITY,
    });
    expect(data[0].currentRevenue).toBe(4.2);
  });

  it('retains Date and string x values while normalizing selected value semantics', () => {
    const date = new Date('2026-08-18T00:00:00.000Z');
    const data = [
      {
        date,
        label: 'Aug 18',
        negative: -4.2,
        zero: 0,
        unavailable: null as number | null,
        untouched: 42,
      },
    ];

    const normalized = normalizePercentageData(
      data,
      ['negative', 'zero', 'unavailable'],
      'percent'
    );

    expect(normalized[0].date).toBe(date);
    expect(normalized[0].label).toBe('Aug 18');
    expect(normalized[0]).toMatchObject({
      negative: -0.042,
      zero: 0,
      unavailable: null,
      untouched: 42,
    });
  });
});

describe('findAvailableDataKey', () => {
  it('uses the base key when rows and declared keys do not reserve it', () => {
    expect(findAvailableDataKey([{value: 1}], new Set(['value']), '__target')).toBe('__target');
  });

  it('uses deterministic numeric suffixes for row and declared-key collisions', () => {
    const data = [{__target: 1}, {__target1: 2}];

    expect(findAvailableDataKey(data, new Set(['__target2']), '__target')).toBe('__target3');
  });

  it('reserves declared keys that are absent from every row', () => {
    expect(findAvailableDataKey([{value: 1}], new Set(['__target']), '__target')).toBe(
      '__target1'
    );
  });
});
