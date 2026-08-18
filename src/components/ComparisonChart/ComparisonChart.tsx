import type { ChartDatum } from '../../types';
import { type AnalyticsSeries, createAnalyticsSeries } from '../Analytics';
import { TrendChart, type TrendChartProps } from '../TrendChart';

export interface ComparisonChartProps<TDatum extends object = ChartDatum>
  extends Omit<TrendChartProps<TDatum>, 'series'> {
  currentSeries: AnalyticsSeries<TDatum>;
  comparisonSeries: AnalyticsSeries<TDatum>;
}

export function ComparisonChart<TDatum extends object = ChartDatum>({
  comparisonSeries,
  currentSeries,
  data,
  ...trendChartProps
}: ComparisonChartProps<TDatum>) {
  return (
    <TrendChart
      {...trendChartProps}
      data={data}
      series={[
        createAnalyticsSeries(data, currentSeries),
        createAnalyticsSeries(data, {
          ...comparisonSeries,
          opacity: comparisonSeries.opacity ?? 0.64,
          strokeDasharray: comparisonSeries.strokeDasharray ?? '6 4'
        })
      ]}
    />
  );
}
