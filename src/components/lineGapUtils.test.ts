import { describe, expect, it } from 'vitest';

import { analyzeLineGaps, isEmptyLineValue } from './lineGapUtils';

interface TestDatum {
  value: unknown;
}

interface GapCase {
  name: string;
  data: readonly TestDatum[];
  isolatedIndexes: readonly number[];
  segments: readonly (readonly [number, number])[];
}

const gapCases: readonly GapCase[] = [
  {
    name: '[1, 2, null, 4, 5] has one gap between adjacent valid points',
    data: [{ value: 1 }, { value: 2 }, { value: null }, { value: 4 }, { value: 5 }],
    isolatedIndexes: [],
    segments: [[1, 3]]
  },
  {
    name: '[null, 3, null] treats the middle point as isolated',
    data: [{ value: null }, { value: 3 }, { value: null }],
    isolatedIndexes: [1],
    segments: []
  },
  {
    name: '[null, null, 5, null] treats the valid endpoint as isolated',
    data: [{ value: null }, { value: null }, { value: 5 }, { value: null }],
    isolatedIndexes: [2],
    segments: []
  },
  {
    name: '[5, null, null] treats the valid endpoint as isolated',
    data: [{ value: 5 }, { value: null }, { value: null }],
    isolatedIndexes: [0],
    segments: []
  },
  {
    name: '[null, 5, 6, null] has no isolated points or gaps',
    data: [{ value: null }, { value: 5 }, { value: 6 }, { value: null }],
    isolatedIndexes: [],
    segments: []
  },
  {
    name: '[5] treats the only valid point as isolated',
    data: [{ value: 5 }],
    isolatedIndexes: [0],
    segments: []
  },
  {
    name: '[null, null, null] has no isolated points or gaps',
    data: [{ value: null }, { value: null }, { value: null }],
    isolatedIndexes: [],
    segments: []
  },
  {
    name: '[1, null, null, 2] has endpoint isolated points and one gap',
    data: [{ value: 1 }, { value: null }, { value: null }, { value: 2 }],
    isolatedIndexes: [0, 3],
    segments: [[0, 3]]
  },
  {
    name: '[1, "", undefined, 2] treats all supported empty values as one gap',
    data: [{ value: 1 }, { value: '' }, { value: undefined }, { value: 2 }],
    isolatedIndexes: [0, 3],
    segments: [[0, 3]]
  },
  {
    name: '[0, null, 1] treats zero as valid',
    data: [{ value: 0 }, { value: null }, { value: 1 }],
    isolatedIndexes: [0, 2],
    segments: [[0, 2]]
  },
  {
    name: '[1, null, 3, null, null, 8] returns multiple gap segments',
    data: [
      { value: 1 },
      { value: null },
      { value: 3 },
      { value: null },
      { value: null },
      { value: 8 }
    ],
    isolatedIndexes: [0, 2, 5],
    segments: [[0, 2], [2, 5]]
  }
];

describe('isEmptyLineValue', () => {
  it.each([
    ['null', null, true],
    ['undefined', undefined, true],
    ['empty string', '', true],
    ['zero', 0, false],
    ['false', false, false],
    ['non-empty string', '0', false],
    ['object', {}, false]
  ])('recognizes %s according to the line empty-value contract', (_name, value, expected) => {
    expect(isEmptyLineValue(value)).toBe(expected);
  });
});

describe('analyzeLineGaps', () => {
  it.each(gapCases)('$name', ({ data, isolatedIndexes, segments }) => {
    const result = analyzeLineGaps(data, 'value');

    expect([...result.isolatedIndexes]).toEqual(isolatedIndexes);
    expect(result.segments.map(({ startIndex, endIndex }) => [startIndex, endIndex])).toEqual(segments);
    expect(result.segments.map(({ start, end }) => [start, end])).toEqual(
      segments.map(([startIndex, endIndex]) => [data[startIndex], data[endIndex]])
    );
  });
});
