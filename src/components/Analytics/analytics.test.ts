import {describe, expect, it} from 'vitest';

import {createAnalyticsSeries, normalizePercentageData} from './analytics';

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
});
