export type ChartValue = string | number | Date | null | undefined;

export interface ChartDatum {
  label?: string;
  value?: ChartValue;
  date?: string | number | Date;
}

export interface ChartSeries<TDatum extends object = ChartDatum> {
  id: string;
  label: string;
  data: TDatum[];
  color?: string;
}

export type ChartFormat = 'number' | 'currency' | 'percent' | 'compact' | 'date';

export type ChartState =
  | 'loading'
  | 'empty'
  | 'error'
  | 'no-permission'
  | 'stale'
  | 'ready';

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

export interface ChartTooltipOptions {
  cursor?: false | Record<string, unknown>;
}

export interface ChartLineOptions {
  dot?: boolean | Record<string, unknown>;
  activeDot?: boolean | Record<string, unknown>;
}
