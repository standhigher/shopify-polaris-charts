import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import type { DotItemDotProps } from 'recharts';

import type {
  ChartActiveDotOptions,
  ChartDotOptions,
  ChartGapConnectorOptions,
  ChartLineOptions,
  ChartSeries
} from '../types';
import {
  GAP_CONNECTOR_DATA_KEY_PREFIX,
  createGapConnectorData,
  filterGapConnectorPayload,
  isGapConnectorDataKey,
  normalizeLineData,
  resolveGapConnectorProps,
  resolveLineDot
} from './lineGapVisualization';
import type { LineGapSegment } from './lineGapUtils';

interface TestDatum {
  date: string;
  value: number | string | null | undefined;
  label: string;
}

const makeDotProps = (index: number): DotItemDotProps => ({
  cx: 10,
  cy: 20,
  dataKey: 'value',
  index,
  payload: { date: '2026-08-24' },
  points: [],
  value: 42
});

const getElementProps = (element: ReactElement) => element.props as Record<string, unknown>;

describe('public line gap types', () => {
  it('compiles all supported public fields and preserves existing line options', () => {
    const connector: ChartGapConnectorOptions = {
      color: '#008060',
      opacity: 0.8,
      strokeDasharray: '5 5',
      strokeWidth: 3
    };
    const dot: ChartDotOptions = {
      className: 'dot',
      clipDot: true,
      cx: 10,
      cy: 20,
      r: 'auto',
      show: 'isolated'
    };
    const activeDot: ChartActiveDotOptions = {
      fill: '#ffffff',
      r: 4,
      stroke: '#008060',
      strokeWidth: 2
    };
    const line: ChartLineOptions = { activeDot, dot };
    const series: ChartSeries<TestDatum> = {
      color: '#008060',
      connectGaps: connector,
      data: [{ date: '2026-08-24', label: 'Today', value: 0 }],
      id: 'value',
      label: 'Value'
    };

    expect({ connector, dot, line, series }).toBeDefined();
  });
});

describe('normalizeLineData', () => {
  it('normalizes product empty values and NaN without changing input or other fields', () => {
    const data: readonly TestDatum[] = [
      { date: 'null', label: 'null', value: null },
      { date: 'undefined', label: 'undefined', value: undefined },
      { date: 'empty', label: 'empty', value: '' },
      { date: 'nan', label: 'nan', value: Number.NaN },
      { date: 'zero', label: 'zero', value: 0 }
    ];
    const originalData = data.map((datum) => ({ ...datum }));

    const normalized = normalizeLineData(data, 'value');

    expect(normalized.map((datum) => datum.value)).toEqual([null, null, null, null, 0]);
    expect(normalized.map((datum) => datum.date)).toEqual(data.map((datum) => datum.date));
    expect(normalized.map((datum) => datum.label)).toEqual(data.map((datum) => datum.label));
    expect(data).toEqual(originalData);
    expect(normalized).not.toBe(data);
    expect(normalized.every((datum, index) => datum !== data[index])).toBe(true);
  });

  it('returns an empty array for empty input', () => {
    expect(normalizeLineData([], 'value' as never)).toEqual([]);
  });
});

describe('gap connector payload helpers', () => {
  it('identifies only internal connector keys', () => {
    expect(GAP_CONNECTOR_DATA_KEY_PREFIX).toBe('__standhigher_gap__');
    expect(isGapConnectorDataKey(`${GAP_CONNECTOR_DATA_KEY_PREFIX}value`)).toBe(true);
    expect(isGapConnectorDataKey('value')).toBe(false);
    expect(isGapConnectorDataKey(undefined)).toBe(false);
    expect(isGapConnectorDataKey(42)).toBe(false);
  });

  it('filters internal connector payload while retaining ordinary series payload', () => {
    const ordinary = { dataKey: 'value' };
    const connector = { dataKey: `${GAP_CONNECTOR_DATA_KEY_PREFIX}value` };
    const payload = [ordinary, connector, { dataKey: 'other' }] as const;

    expect(filterGapConnectorPayload(payload, (item) => item.dataKey)).toEqual([ordinary, { dataKey: 'other' }]);
    expect(filterGapConnectorPayload([], () => undefined)).toEqual([]);
  });

  it('creates copied endpoint data with the x key and original valid values under the internal key', () => {
    const start: TestDatum = { date: '2026-08-01', label: 'Start', value: 2 };
    const end: TestDatum = { date: '2026-08-03', label: 'End', value: 6 };
    const segment: LineGapSegment<TestDatum> = { end, endIndex: 3, start, startIndex: 1 };
    const internalDataKey = `${GAP_CONNECTOR_DATA_KEY_PREFIX}value`;

    const [connectorStart, connectorEnd] = createGapConnectorData(segment, 'value', 'date', internalDataKey);

    expect(connectorStart).toEqual({ ...start, [internalDataKey]: 2 });
    expect(connectorEnd).toEqual({ ...end, [internalDataKey]: 6 });
    expect(connectorStart.date).toBe(start.date);
    expect(connectorEnd.date).toBe(end.date);
    expect(start).toEqual({ date: '2026-08-01', label: 'Start', value: 2 });
    expect(end).toEqual({ date: '2026-08-03', label: 'End', value: 6 });
    expect(connectorStart).not.toBe(start);
    expect(connectorEnd).not.toBe(end);
  });
});

describe('line dot resolution', () => {
  it('keeps boolean dot settings as direct Recharts values', () => {
    expect(resolveLineDot(false, { seriesColor: '#008060', effectiveStrokeWidth: 2 })).toBe(false);
    expect(resolveLineDot(true, { seriesColor: '#008060', effectiveStrokeWidth: 2 })).toBe(true);
  });

  it('renders every point for an object with omitted or all show', () => {
    for (const dot of [{}, { show: 'all' as const }]) {
      const resolved = resolveLineDot(dot, {
        effectiveStrokeWidth: 4,
        seriesColor: '#008060'
      });

      expect(typeof resolved).toBe('function');
      const element = (resolved as (props: DotItemDotProps) => ReactElement)(makeDotProps(2));

      expect(element).not.toBeNull();
      expect(getElementProps(element).r).toBeUndefined();
      expect(getElementProps(element).show).toBeUndefined();
    }
  });

  it('disables all dots for show none', () => {
    expect(resolveLineDot({ r: 4, show: 'none' }, { seriesColor: '#008060' })).toBe(false);
  });

  it('renders only isolated indexes and styles them as filled series-colored circles', () => {
    const resolved = resolveLineDot(
      { className: 'isolated-dot', clipDot: false, r: 'auto', show: 'isolated' },
      { effectiveStrokeWidth: 4, isolatedIndexes: new Set([1]), seriesColor: '#008060' }
    );
    const renderDot = resolved as (props: DotItemDotProps) => ReactElement | null;

    expect(renderDot(makeDotProps(0))).toBeNull();
    expect(renderDot(makeDotProps(1))).toMatchObject({
      props: expect.objectContaining({
        className: 'isolated-dot',
        clipDot: false,
        fill: '#008060',
        r: 2,
        stroke: '#008060',
        strokeWidth: 0
      })
    });
  });

  it('resolves auto radius from the final effective line width', () => {
    const resolved = resolveLineDot(
      { r: 'auto' },
      { effectiveStrokeWidth: 6, seriesColor: '#008060' }
    );
    const element = (resolved as (props: DotItemDotProps) => ReactElement)(makeDotProps(0));

    expect(getElementProps(element).r).toBe(3);
  });
});

describe('gap connector resolution', () => {
  it('uses connector defaults for enabled connectors', () => {
    expect(resolveGapConnectorProps(true, '#008060', 4)).toEqual({
      opacity: 1,
      stroke: '#008060',
      strokeDasharray: '5 5',
      strokeWidth: 4
    });
  });

  it('allows connector options to override every default', () => {
    expect(
      resolveGapConnectorProps(
        { color: '#ffffff', opacity: 0.4, strokeDasharray: '2 3', strokeWidth: 1 },
        '#008060',
        4
      )
    ).toEqual({
      opacity: 0.4,
      stroke: '#ffffff',
      strokeDasharray: '2 3',
      strokeWidth: 1
    });
  });

  it('keeps disabled connectors off and supports empty/default boundaries', () => {
    expect(resolveGapConnectorProps(false, '#008060', 2)).toBe(false);
    expect(resolveGapConnectorProps(undefined, '#008060', 2)).toBe(false);
  });
});
