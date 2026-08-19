import type { ReactNode } from 'react';

import type { ChartValueFormatOptions } from '../formatters';

export type ChartValue = string | number | Date | null | undefined;

export interface ChartDatum {
  label?: string;
  value?: ChartValue;
  date?: string | number | Date;
}

export interface ChartAccessibilityOptions {
  label: string;
  description?: ReactNode;
  dataTable?: ReactNode;
}

export interface ChartSeries<TDatum extends object = ChartDatum> {
  id: string;
  label: string;
  data: TDatum[];
  color?: string;
  opacity?: number;
  strokeDasharray?: string | number;
  strokeWidth?: number;
}

export type ChartFormat = 'number' | 'currency' | 'percent' | 'compact' | 'date';

export type ChartCardState =
  | 'loading'
  | 'empty'
  | 'error'
  | 'no-permission'
  | 'stale'
  | 'ready';

/** @deprecated Use ChartCardState. */
export type ChartState = ChartCardState;

export type ChartContentState = 'loading' | 'empty' | 'error' | 'ready';

/** @deprecated Use ChartContentState. */
export type ChartInlineState = ChartContentState;

export interface ChartSkeletonOptions {
  label?: ReactNode;
  lineCount?: number;
}

/** @deprecated Use ChartSkeletonOptions. */
export type TrendChartSkeletonOptions = ChartSkeletonOptions;

export interface ChartRevealOptions {
  active?: boolean;
  delayMs?: number;
  durationMs?: number;
  label?: ReactNode;
}

/** @deprecated Use ChartRevealOptions. */
export type TrendChartRevealOptions = ChartRevealOptions;

export interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface CartesianAxisOptions {
  domain?: [number | 'auto', number | 'auto'];
  ticks?: Array<number | string>;
  tickColor?: string;
  tickFontSize?: number;
  axisLine?: boolean;
  tickLine?: boolean;
  minTickGap?: number;
  interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
  width?: number;
}

export interface ChartGridOptions {
  horizontal?: boolean;
  vertical?: boolean;
  stroke?: string;
  strokeDasharray?: string;
}

export interface ChartTooltipPayloadItem<
  TDatum extends object = ChartDatum,
  TSeries extends ChartSeries<TDatum> = ChartSeries<TDatum>
> {
  color?: string;
  data?: TDatum;
  dataKey?: string;
  name?: string;
  series?: TSeries;
  value?: ChartValue;
}

export interface ChartTooltipContentProps<
  TDatum extends object = ChartDatum,
  TSeries extends ChartSeries<TDatum> = ChartSeries<TDatum>
> {
  active?: boolean;
  label?: ChartValue;
  payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>;
  series: Array<TSeries>;
  format: ChartFormat;
  formatOptions: ChartValueFormatOptions;
  xFormat?: ChartFormat;
  xFormatOptions: ChartValueFormatOptions;
  formatLabel: (
    label: ChartValue,
    payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>
  ) => ReactNode;
  formatValue: (value: ChartValue, series?: TSeries) => ReactNode;
}

export type ChartTooltipContentRenderer<
  TDatum extends object = ChartDatum,
  TSeries extends ChartSeries<TDatum> = ChartSeries<TDatum>
> = (props: ChartTooltipContentProps<TDatum, TSeries>) => ReactNode;

export interface ChartTooltipOptions<
  TDatum extends object = ChartDatum,
  TSeries extends ChartSeries<TDatum> = ChartSeries<TDatum>
> {
  cursor?: false | ChartTooltipCursorOptions;
  content?: ChartTooltipContentRenderer<TDatum, TSeries>;
  labelFormatter?: (
    label: ChartValue,
    payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>
  ) => ReactNode;
  valueFormatter?: (value: ChartValue, series?: TSeries) => ReactNode;
  minWidth?: number;
  className?: string;
}

export interface ChartTooltipCursorOptions {
  stroke?: string;
  strokeDasharray?: string;
  strokeWidth?: number;
  fill?: string;
}

export interface ChartDotOptions {
  className?: string;
  cx?: number;
  cy?: number;
  r?: number | string;
  clipDot?: boolean;
}

export interface ChartActiveDotOptions extends ChartDotOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface ChartLineOptions {
  dot?: boolean | ChartDotOptions;
  activeDot?: boolean | ChartActiveDotOptions;
}
