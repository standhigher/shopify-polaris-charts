import type { ReactNode } from 'react';

import { normalizePercentageData, type PercentageInput } from '../Analytics';

export interface FunnelDatum {
  id: string;
  label: ReactNode;
  value: number;
  conversion?: number;
  dropOff?: number;
}

export type FunnelPercentageInput = PercentageInput;

export function normalizeFunnelData<TDatum extends FunnelDatum>(
  data: TDatum[],
  percentageInput: FunnelPercentageInput
): TDatum[] {
  return normalizePercentageData(
    data,
    ['conversion', 'dropOff'] as Array<keyof TDatum & string>,
    percentageInput
  );
}
