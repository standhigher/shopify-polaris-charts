import { useMemo } from 'react';

import { chartTheme } from '../../theme';
import type { ChartDatum, ChartSeries } from '../../types';
import {
  type AnalyticsSeries,
  type PercentageInput,
  createAnalyticsSeries,
  normalizePercentageData
} from '../Analytics';
import { findAvailableDataKey } from '../Analytics/analytics';
import { TrendChart, type TrendChartProps } from '../TrendChart';

export interface ConversionTarget {
  color?: string;
  label: string;
  value: number;
}

export interface ConversionChartProps<TDatum extends object = ChartDatum>
  extends Omit<TrendChartProps<TDatum>, 'data' | 'format' | 'series'> {
  data: TDatum[];
  input?: PercentageInput;
  series: Array<AnalyticsSeries<TDatum>>;
  target?: ConversionTarget;
}

const TARGET_FIELD = '__conversionTarget';

export function ConversionChart<TDatum extends object = ChartDatum>({
  data,
  input = 'ratio',
  series,
  target,
  ...trendChartProps
}: ConversionChartProps<TDatum>) {
  const { chartData, chartSeries } = useMemo(() => {
    const dataKeys = series.map(({ dataKey }) => dataKey);
    const normalizedData = normalizePercentageData(data, dataKeys, input);
    let nextChartData = normalizedData;
    const nextChartSeries: Array<ChartSeries<TDatum>> = series.map((definition) =>
      createAnalyticsSeries(normalizedData, definition)
    );

    if (target) {
      const targetField = findAvailableDataKey(data, new Set(dataKeys), TARGET_FIELD);
      const targetValue = input === 'percent' ? target.value / 100 : target.value;
      nextChartData = normalizedData.map((datum) => ({ ...datum, [targetField]: targetValue }));
      nextChartSeries.push({
        id: targetField as keyof TDatum & string,
        data: nextChartData,
        label: target.label,
        color: target.color ?? chartTheme.status.neutral,
        strokeDasharray: '6 4'
      });
    }

    return { chartData: nextChartData, chartSeries: nextChartSeries };
  }, [data, input, series, target]);

  return <TrendChart {...trendChartProps} data={chartData} format="percent" series={chartSeries} />;
}
