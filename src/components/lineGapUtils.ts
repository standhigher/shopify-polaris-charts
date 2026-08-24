export type LineDataKey<TDatum extends object> = keyof TDatum & string;

export interface LineGapSegment<TDatum extends object> {
  startIndex: number;
  endIndex: number;
  start: TDatum;
  end: TDatum;
}

export interface LineGapAnalysis<TDatum extends object> {
  isolatedIndexes: ReadonlySet<number>;
  segments: ReadonlyArray<LineGapSegment<TDatum>>;
}

/**
 * The product contract treats '' as empty. Adapters entering Recharts must normalize '' to null;
 * NaN must be rejected or normalized per adapter policy to keep analysis and rendering consistent.
 */
export function isEmptyLineValue(value: unknown): boolean {
  return value === null || value === undefined || value === '';
}

export function analyzeLineGaps<TDatum extends object>(
  data: readonly TDatum[],
  dataKey: LineDataKey<TDatum>
): LineGapAnalysis<TDatum> {
  const isolatedIndexes = new Set<number>();
  const segments: LineGapSegment<TDatum>[] = [];
  let previousValidIndex: number | undefined;

  const isEmptyAt = (index: number): boolean => {
    if (index < 0 || index >= data.length) {
      return true;
    }

    return isEmptyLineValue(data[index][dataKey]);
  };

  for (const [index, datum] of data.entries()) {
    if (isEmptyLineValue(datum[dataKey])) {
      continue;
    }

    if (previousValidIndex !== undefined && index > previousValidIndex + 1) {
      segments.push({
        startIndex: previousValidIndex,
        endIndex: index,
        start: data[previousValidIndex],
        end: datum
      });
    }

    if (isEmptyAt(index - 1) && isEmptyAt(index + 1)) {
      isolatedIndexes.add(index);
    }

    previousValidIndex = index;
  }

  return { isolatedIndexes, segments };
}
