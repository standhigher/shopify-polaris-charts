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

export function isEmptyLineValue(value: unknown): boolean {
  // NaN is intentionally outside this product contract; chart adapters must normalize or reject it.
  return value === null || value === undefined || value === '';
}

export function analyzeLineGaps<
  TDatum extends object,
  TKey extends keyof TDatum & string
>(
  data: readonly TDatum[],
  dataKey: TKey
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
