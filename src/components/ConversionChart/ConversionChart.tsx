import { chartTheme } from '../../theme';
import type { ChartDatum, ChartSeries } from '../../types';
import {
  type AnalyticsSeries,
  type PercentageInput,
  createAnalyticsSeries,
  normalizePercentageData
} from '../Analytics';
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

function findTargetField(data: object[], reservedKeys: ReadonlySet<string>): string {
  let suffix = 0;
  let candidate = TARGET_FIELD;

  while (
    reservedKeys.has(candidate) ||
    data.some((datum) => Object.prototype.hasOwnProperty.call(datum, candidate))
  ) {
    suffix += 1;
    candidate = `${TARGET_FIELD}${suffix}`;
  }

  return candidate;
}

export function ConversionChart<TDatum extends object = ChartDatum>({
  data,
  input = 'ratio',
  series,
  target,
  ...trendChartProps
}: ConversionChartProps<TDatum>) {
  const normalizedData = normalizePercentageData(
    data,
    series.map(({ dataKey }) => dataKey),
    input
  );
  let chartData = normalizedData;
  const chartSeries: Array<ChartSeries<TDatum>> = series.map((definition) =>
    createAnalyticsSeries(normalizedData, definition)
  );

  if (target) {
    const targetField = findTargetField(data, new Set(series.map(({ dataKey }) => dataKey)));
    const targetValue = input === 'percent' ? target.value / 100 : target.value;
    chartData = normalizedData.map((datum) => ({ ...datum, [targetField]: targetValue }));
    chartSeries.push({
      id: targetField as keyof TDatum & string,
      data: chartData,
      label: target.label,
      color: target.color ?? chartTheme.status.neutral,
      strokeDasharray: '6 4'
    });
  }

  return <TrendChart {...trendChartProps} data={chartData} format="percent" series={chartSeries} />;
}
