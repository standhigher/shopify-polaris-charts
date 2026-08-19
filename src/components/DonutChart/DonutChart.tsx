import type { CSSProperties, ReactNode } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { formatChartValue, type ChartValueFormatOptions } from '../../formatters';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { chartTheme } from '../../theme';
import type {
  ChartAccessibilityOptions,
  ChartContentState,
  ChartDatum,
  ChartFormat,
  ChartRevealOptions,
  ChartSkeletonOptions,
  ChartValue
} from '../../types';
import { ChartAccessibilityRegion } from '../ChartAccessibility';
import { ChartStateRegion } from '../ChartState';
import { useChartLocalization } from '../ChartLocalization';

export interface DonutChartProps<TDatum extends object = ChartDatum> {
  accessibility?: ChartAccessibilityOptions;
  title?: ReactNode;
  data: TDatum[];
  categoryKey: keyof TDatum & string;
  valueKey: keyof TDatum & string;
  centerLabel?: ReactNode;
  showLegend?: boolean;
  height?: number;
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  loadingLabel?: ReactNode;
  onRetry?: () => void;
  retryAction?: ReactNode;
  retryLabel?: ReactNode;
  reveal?: boolean | ChartRevealOptions;
  skeleton?: boolean | ChartSkeletonOptions;
  state?: ChartContentState;
}

interface DonutTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: number | null;
  }>;
  format: ChartFormat;
  formatOptions: ChartValueFormatOptions;
}

const styles: Record<string, CSSProperties> = {
  chartWrap: {
    position: 'relative',
    width: '100%'
  },
  centerLabel: {
    color: chartTheme.text.primary,
    fontSize: 16,
    fontWeight: 650,
    left: '50%',
    lineHeight: 1.25,
    pointerEvents: 'none',
    position: 'absolute',
    textAlign: 'center',
    top: '50%',
    transform: 'translate(-50%, -50%)'
  },
  container: {
    boxSizing: 'border-box',
    color: chartTheme.text.primary,
    display: 'flex',
    flexDirection: 'column',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    gap: 12,
    minWidth: 0,
    width: '100%'
  },
  empty: {
    alignItems: 'center',
    background: chartTheme.surface.subtleBackground,
    border: `1px dashed ${chartTheme.surface.border}`,
    borderRadius: 6,
    color: chartTheme.text.secondary,
    display: 'flex',
    justifyContent: 'center',
    minHeight: 180,
    padding: 24,
    textAlign: 'center'
  },
  heading: {
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.35,
    margin: 0
  },
  legend: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px 16px',
    minWidth: 0,
    width: '100%'
  },
  legendItem: {
    alignItems: 'center',
    color: chartTheme.legend.textColor,
    display: 'inline-flex',
    fontSize: chartTheme.legend.fontSize,
    gap: 6,
    lineHeight: 1.3
  },
  legendValue: {
    color: chartTheme.text.primary,
    fontWeight: 600
  },
  marker: {
    borderRadius: 999,
    flex: '0 0 auto',
    height: chartTheme.legend.markerSize,
    width: chartTheme.legend.markerSize
  },
  tooltip: {
    background: chartTheme.tooltip.background,
    border: `1px solid ${chartTheme.tooltip.border}`,
    borderRadius: chartTheme.tooltip.borderRadius,
    boxShadow: chartTheme.tooltip.boxShadow,
    color: chartTheme.tooltip.textColor,
    fontSize: 12,
    padding: 10
  },
  tooltipRow: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    minWidth: 150
  }
};

const toPositiveNumber = (value: unknown) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) && value > 0 ? value : null;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) && numericValue > 0 ? numericValue : null;
  }

  return null;
};

const toChartValue = (value: unknown): ChartValue => {
  if (value instanceof Date || typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return null;
};

const getDatumValue = <TDatum extends object>(datum: TDatum, key: string) =>
  (datum as Record<string, unknown>)[key];

function DonutTooltip({ active, format, formatOptions, payload }: DonutTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];

  return (
    <div style={styles.tooltip}>
      <div style={styles.tooltipRow}>
        <span>{item.name}</span>
        <strong>{formatChartValue(item.value, format, formatOptions)}</strong>
      </div>
    </div>
  );
}

export function DonutChart<TDatum extends object = ChartDatum>({
  accessibility,
  categoryKey,
  centerLabel,
  data,
  emptyMessage,
  errorMessage,
  format = 'number',
  formatOptions: suppliedFormatOptions = {},
  height = 280,
  loadingLabel,
  onRetry,
  reveal,
  retryAction,
  retryLabel,
  showLegend = true,
  skeleton,
  state = 'ready',
  title,
  valueKey
}: DonutChartProps<TDatum>) {
  const localization = useChartLocalization();
  const prefersReducedMotion = usePrefersReducedMotion();
  const formatOptions = {
    currency: localization.currency,
    locale: localization.locale,
    timeZone: localization.timeZone,
    ...suppliedFormatOptions
  };
  const slices = data
    .map((datum, index) => ({
      ...datum,
      __color: chartTheme.palette[index % chartTheme.palette.length],
      __key: `${String(getDatumValue(datum, categoryKey) ?? '')}-${index}`,
      __name: String(getDatumValue(datum, categoryKey) ?? ''),
      __value: toPositiveNumber(getDatumValue(datum, valueKey))
  }))
    .filter((datum): datum is typeof datum & { __value: number } => datum.__value !== null);
  const hasData = slices.length > 0;
  const resolvedState = state === 'ready' && !hasData ? 'empty' : state;

  return (
    <ChartAccessibilityRegion accessibility={accessibility}>
    <div style={styles.container}>
      {title ? <h3 style={styles.heading}>{title}</h3> : null}
      <ChartStateRegion
        emptyMessage={emptyMessage}
        errorMessage={errorMessage}
        loadingLabel={loadingLabel}
        minHeight={height}
        onRetry={onRetry}
        reveal={reveal}
        retryAction={retryAction}
        retryLabel={retryLabel}
        skeleton={skeleton}
        state={resolvedState}
      >
        <>
          <div style={{ ...styles.chartWrap, height }}>
            <ResponsiveContainer height="100%" initialDimension={{ height, width: 640 }} width="100%">
              <PieChart accessibilityLayer>
                <Pie
                  data={slices}
                  dataKey="__value"
                  innerRadius="62%"
                  isAnimationActive={!prefersReducedMotion}
                  nameKey="__name"
                  outerRadius="86%"
                  paddingAngle={2}
                  stroke={chartTheme.surface.background}
                  strokeWidth={2}
                >
                  {slices.map((slice) => (
                    <Cell fill={slice.__color} key={slice.__key} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip format={format} formatOptions={formatOptions} />} />
              </PieChart>
            </ResponsiveContainer>
            {centerLabel ? <div style={styles.centerLabel}>{centerLabel}</div> : null}
          </div>
          {showLegend ? (
            <div aria-label={localization.messages.chartLegend} style={styles.legend}>
              {slices.map((item) => (
                <span key={item.__key} style={styles.legendItem}>
                  <span aria-hidden="true" style={{ ...styles.marker, background: item.__color }} />
                  <span>{item.__name}</span>
                  <span style={styles.legendValue}>{formatChartValue(toChartValue(item.__value), format, formatOptions)}</span>
                </span>
              ))}
            </div>
          ) : null}
        </>
      </ChartStateRegion>
    </div>
    </ChartAccessibilityRegion>
  );
}
