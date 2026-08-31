import type { ComponentProps, ReactElement } from 'react';
import { Dot } from 'recharts';
import type { DotItemDotProps } from 'recharts';

import type { ChartActiveDotOptions, ChartDotOptions, ChartGapConnectorOptions } from '../types';

export const GAP_CONNECTOR_DATA_KEY_PREFIX = '__standhigher_gap__';

export function isGapConnectorDataKey(dataKey: unknown): boolean {
  return typeof dataKey === 'string' && dataKey.startsWith(GAP_CONNECTOR_DATA_KEY_PREFIX);
}

export function filterGapConnectorPayload<T>(
  payload: readonly T[],
  getDataKey: (item: T) => unknown
): T[] {
  return payload.filter((item) => !isGapConnectorDataKey(getDataKey(item)));
}

/**
 * Recharts does not reliably treat '' as a line break and cannot draw NaN.
 * The adapter normalizes both to null; this does not change the product contract
 * for normal values, where 0 remains a valid value.
 */
export function normalizeLineData<TDatum extends object, TKey extends keyof TDatum & string>(
  data: readonly TDatum[],
  dataKey: TKey
): TDatum[] {
  return data.map((datum) => {
    const value = datum[dataKey];

    if (value === null || value === undefined || value === '' || Number.isNaN(value)) {
      return { ...datum, [dataKey]: null } as TDatum;
    }

    return { ...datum };
  });
}

export interface LineDotResolutionOptions {
  seriesColor?: string;
  effectiveStrokeWidth?: number;
  isolatedIndexes?: ReadonlySet<number>;
}

export type ResolvedLineDot =
  | boolean
  | ((props: DotItemDotProps) => ReactElement | null);

const DEFAULT_LINE_STROKE_WIDTH = 2;

function resolveEffectiveStrokeWidth(strokeWidth: number | undefined): number {
  return strokeWidth ?? DEFAULT_LINE_STROKE_WIDTH;
}

function renderLineDot(
  dot: ChartDotOptions,
  options: LineDotResolutionOptions,
  onlyIsolated: boolean
) {
  return (props: DotItemDotProps): ReactElement | null => {
    if (onlyIsolated && !options.isolatedIndexes?.has(props.index)) {
      return null;
    }

    const effectiveStrokeWidth = resolveEffectiveStrokeWidth(options.effectiveStrokeWidth);
    const defaultDotProps = props as unknown as ComponentProps<typeof Dot>;
    const clipDot = (props as DotItemDotProps & { clipDot?: boolean }).clipDot;
    // Isolated single observations are emphasized with twice the line width so
    // they stay visible next to the solid line; ordinary dots keep the line-width
    // derived radius.
    const radius = onlyIsolated
      ? dot.r === undefined || dot.r === 'auto'
        ? effectiveStrokeWidth
        : dot.r
      : dot.r === 'auto'
        ? effectiveStrokeWidth / 2
        : dot.r ?? props.r;

    return (
      <Dot
        {...defaultDotProps}
        className={dot.className ?? props.className}
        clipDot={dot.clipDot ?? clipDot}
        cx={dot.cx ?? props.cx}
        cy={dot.cy ?? props.cy}
        fill={onlyIsolated ? options.seriesColor : props.fill}
        r={radius}
        stroke={onlyIsolated ? options.seriesColor : props.stroke}
        strokeWidth={onlyIsolated ? 0 : props.strokeWidth}
      />
    );
  };
}

export function resolveLineDot(
  dot: boolean | ChartDotOptions | undefined,
  options: LineDotResolutionOptions
): ResolvedLineDot {
  if (dot === undefined || dot === false) {
    return false;
  }

  if (dot === true) {
    return true;
  }

  if (dot.show === 'none') {
    return false;
  }

  return renderLineDot(dot, options, dot.show === 'isolated');
}

export function resolveLineActiveDot(
  activeDot: boolean | ChartActiveDotOptions | undefined,
  effectiveStrokeWidth: number
): boolean | ChartActiveDotOptions | undefined {
  if (activeDot === undefined || typeof activeDot === 'boolean') {
    return activeDot;
  }

  return activeDot.r === 'auto'
    ? { ...activeDot, r: effectiveStrokeWidth / 2 }
    : { ...activeDot };
}

export interface ResolvedGapConnectorProps {
  strokeDasharray: string | number;
  stroke?: string;
  strokeWidth: number;
  opacity: number;
}

export interface GapConnectorDataOptions {
  dataKey: string;
  internalDataKey: string;
}

export function resolveGapConnectorProps(
  connectGaps: boolean | ChartGapConnectorOptions | undefined,
  seriesColor: string | undefined,
  effectiveStrokeWidth: number = DEFAULT_LINE_STROKE_WIDTH
): false | ResolvedGapConnectorProps {
  if (connectGaps === undefined || connectGaps === false) {
    return false;
  }

  const options = connectGaps === true ? {} : connectGaps;

  return {
    opacity: options.opacity ?? 1,
    stroke: options.color ?? seriesColor,
    strokeDasharray: options.strokeDasharray ?? '5 5',
    strokeWidth: options.strokeWidth ?? effectiveStrokeWidth
  };
}

export function attachGapConnectorData<TDatum extends object>(
  data: readonly TDatum[],
  connectors: readonly GapConnectorDataOptions[]
): TDatum[] {
  if (!connectors.length) {
    return data.map((datum) => ({ ...datum }));
  }

  return data.map((datum) => {
    const nextDatum = { ...datum } as Record<string, unknown>;

    for (const connector of connectors) {
      nextDatum[connector.internalDataKey] = nextDatum[connector.dataKey];
    }

    return nextDatum as TDatum;
  });
}
