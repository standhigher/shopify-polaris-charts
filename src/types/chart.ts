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
