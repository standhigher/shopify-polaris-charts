import type { ChartValueFormatOptions } from '../formatters';
import type { FunnelPercentageInput } from '../components/FunnelChart';
import type { ChartFormat } from '../types';

export interface AnalyticsSeriesPreset {
  readonly color: string;
  readonly label: string;
  readonly opacity?: number;
  readonly strokeDasharray?: string | number;
  readonly strokeWidth?: number;
}

export interface AnalyticsAxisPreset {
  readonly format: ChartFormat;
  readonly formatOptions?: Readonly<ChartValueFormatOptions>;
}

export interface AnalyticsTrendPreset {
  readonly axis: AnalyticsAxisPreset;
  readonly comparisonSeries?: AnalyticsSeriesPreset;
  readonly currentSeries: AnalyticsSeriesPreset;
  readonly format: ChartFormat;
  readonly formatOptions?: Readonly<ChartValueFormatOptions>;
}

export interface AnalyticsFunnelPreset {
  readonly colors: readonly string[];
  readonly format: ChartFormat;
  readonly percentageInput: FunnelPercentageInput;
}
