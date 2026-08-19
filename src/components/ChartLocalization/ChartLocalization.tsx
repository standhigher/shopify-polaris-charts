import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';

export interface ChartMessages {
  chartEmpty: ReactNode;
  chartError: ReactNode;
  chartLoading: ReactNode;
  chartLegend: string;
  chartNoPermission: ReactNode;
  chartPreparing: ReactNode;
  chartStale: ReactNode;
  funnelConversion: ReactNode;
  funnelDropOff: ReactNode;
  funnelStage: ReactNode;
  funnelStages: ReactNode;
  funnelValue: ReactNode;
  metricLoading: ReactNode;
  retry: ReactNode;
}

export interface ChartLocalizationValue {
  currency: string;
  locale: string;
  messages: ChartMessages;
  timeZone?: string;
}

export interface ChartLocalizationProviderProps {
  children: ReactNode;
  currency?: string;
  locale?: string;
  messages?: Partial<ChartMessages>;
  timeZone?: string;
}

export const defaultChartMessages: ChartMessages = {
  chartEmpty: 'No data available',
  chartError: 'Unable to load chart',
  chartLoading: 'Loading chart',
  chartLegend: 'Chart legend',
  chartNoPermission: 'No permission to view this chart',
  chartPreparing: 'Preparing chart',
  chartStale: 'Data may be out of date',
  funnelConversion: 'Conversion',
  funnelDropOff: 'Drop-off',
  funnelStage: 'Stage',
  funnelStages: 'Funnel stages',
  funnelValue: 'Value',
  metricLoading: 'Loading metric',
  retry: 'Retry'
};

const defaultChartLocalization: ChartLocalizationValue = {
  currency: 'USD',
  locale: 'en-US',
  messages: defaultChartMessages
};

const ChartLocalizationContext = createContext<ChartLocalizationValue>(defaultChartLocalization);

export function ChartLocalizationProvider({
  children,
  currency,
  locale,
  messages,
  timeZone
}: ChartLocalizationProviderProps) {
  const parent = useContext(ChartLocalizationContext);
  const mergedMessages = useMemo(
    () => ({ ...parent.messages, ...messages }),
    [messages, parent.messages]
  );
  const value = useMemo(
    () => ({
      currency: currency ?? parent.currency,
      locale: locale ?? parent.locale,
      messages: mergedMessages,
      timeZone: timeZone ?? parent.timeZone
    }),
    [currency, locale, mergedMessages, parent.currency, parent.locale, parent.timeZone, timeZone]
  );

  return (
    <ChartLocalizationContext.Provider value={value}>
      {children}
    </ChartLocalizationContext.Provider>
  );
}

export function useChartLocalization() {
  return useContext(ChartLocalizationContext);
}
