import type {ChartSeries} from '../../types/chart';

export interface AnalyticsSeries<TDatum extends object> {
  dataKey: keyof TDatum & string;
  label: string;
  color?: string;
  opacity?: number;
  strokeDasharray?: string | number;
  strokeWidth?: number;
}

export type PercentageInput = 'percent' | 'ratio';

export function createAnalyticsSeries<TDatum extends object>(
  data: TDatum[],
  definition: AnalyticsSeries<TDatum>
): ChartSeries<TDatum> {
  const {dataKey, ...presentation} = definition;

  return {
    id: dataKey,
    data,
    ...presentation,
  };
}

export function normalizePercentageData<TDatum extends object>(
  data: TDatum[],
  dataKeys: ReadonlyArray<keyof TDatum & string>,
  input: PercentageInput
): TDatum[] {
  if (input === 'ratio') {
    return data;
  }

  return data.map((datum) => {
    const normalized = {...datum};
    const normalizedValues = normalized as Record<string, unknown>;

    for (const dataKey of dataKeys) {
      const value = normalizedValues[dataKey];

      if (typeof value === 'number' && Number.isFinite(value)) {
        normalizedValues[dataKey] = value / 100;
      }
    }

    return normalized;
  });
}
