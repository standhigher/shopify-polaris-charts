import { useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatChartValue, type ChartValueFormatOptions } from '../../formatters';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { chartTheme } from '../../theme';
import type {
  ChartAccessibilityOptions,
  ChartContentState,
  ChartFormat,
  ChartGridOptions,
  ChartMargin,
  ChartRevealOptions,
  ChartSkeletonOptions,
  ChartTooltipOptions,
  ChartValue,
  CartesianAxisOptions
} from '../../types';
import { ChartAccessibilityRegion } from '../ChartAccessibility';
import { ChartStateRegion } from '../ChartState';
import { useChartLocalization } from '../ChartLocalization';
import { onChartMouse } from '../cartesianRechartsProps';

export interface HorizontalBarDatum {
  label: string;
  value: number | null | undefined;
  color?: string;
  id?: string;
}

export interface HorizontalBarChartProps {
  accessibility?: ChartAccessibilityOptions;
  title?: ReactNode;
  data: HorizontalBarDatum[];
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
  percentageInput?: 'percent' | 'ratio';
  xAxis?: CartesianAxisOptions;
  yAxis?: CartesianAxisOptions;
  grid?: ChartGridOptions;
  margin?: ChartMargin;
  tooltip?: ChartTooltipOptions;
  height?: number;
  barSize?: number;
  radius?: number | [number, number, number, number];
  showLegend?: boolean;
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

interface HorizontalBarTooltipProps {
  active?: boolean;
  label?: ChartValue;
  payload?: Array<{ value?: number | null; payload?: HorizontalBarDatum }>;
  format: ChartFormat;
  formatOptions: ChartValueFormatOptions;
  tooltip?: ChartTooltipOptions;
}

const styles: Record<string, CSSProperties> = {
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
    minWidth: 160
  }
};

const toFiniteNumber = (value: unknown) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const numericValue = Number(value);

    return Number.isFinite(numericValue) ? numericValue : null;
  }

  return null;
};

const toChartValue = (value: unknown): ChartValue => {
  if (value instanceof Date || typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return null;
};

const getColor = (item: HorizontalBarDatum, index: number) =>
  item.color ?? chartTheme.palette[index % chartTheme.palette.length];

const resolveGridProps = (grid?: ChartGridOptions) => ({
  horizontal: grid?.horizontal ?? false,
  stroke: grid?.stroke ?? chartTheme.grid.stroke,
  strokeDasharray: grid?.strokeDasharray ?? chartTheme.grid.strokeDasharray,
  vertical: grid?.vertical ?? true
});

const resolveAxisTick = (axis?: CartesianAxisOptions) => ({
  fill: axis?.tickColor ?? chartTheme.axis.tickColor,
  fontSize: axis?.tickFontSize ?? chartTheme.axis.fontSize
});

function HorizontalBarTooltip({ active, format, formatOptions, label, payload, tooltip }: HorizontalBarTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0];
  const datum = item.payload;
  const formattedLabel = tooltip?.labelFormatter?.(label, payload as never) ?? datum?.label ?? (label instanceof Date ? label.toISOString() : label);
  const formattedValue = tooltip?.valueFormatter?.(item.value, undefined) ?? formatChartValue(item.value, format, formatOptions);

  return (
    <div className={tooltip?.className} style={{ ...styles.tooltip, minWidth: tooltip?.minWidth }}>
      <div style={styles.tooltipRow}>
        <span>{formattedLabel}</span>
        <strong>{formattedValue}</strong>
      </div>
    </div>
  );
}

export function HorizontalBarChart({
  accessibility,
  barSize,
  data,
  emptyMessage,
  errorMessage,
  format = 'number',
  formatOptions: suppliedFormatOptions,
  grid,
  height = 280,
  loadingLabel,
  margin,
  onRetry,
  percentageInput = 'ratio',
  radius = [0, 6, 6, 0],
  reveal,
  retryAction,
  retryLabel,
  showLegend = false,
  skeleton,
  state = 'ready',
  title,
  tooltip,
  xAxis,
  yAxis
}: HorizontalBarChartProps) {
  const localization = useChartLocalization();
  const prefersReducedMotion = usePrefersReducedMotion();
  const formatOptions = useMemo(() => ({
    currency: localization.currency,
    locale: localization.locale,
    timeZone: localization.timeZone,
    ...suppliedFormatOptions
  }), [localization.currency, localization.locale, localization.timeZone, suppliedFormatOptions]);
  const normalizedData = useMemo(
    () => data.map((item, index) => {
      const value = toFiniteNumber(item.value);
      const normalizedValue = format === 'percent' && percentageInput === 'percent' && value !== null ? value / 100 : value;

      return {
        ...item,
        __color: getColor(item, index),
        __key: item.id ?? `${item.label}-${index}`,
        __value: normalizedValue
      };
    }),
    [data, format, percentageInput]
  );
  const hasData = normalizedData.some((item) => item.__value !== null);
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
            <div onMouseDown={onChartMouse} style={{ height, width: '100%' }}>
              <ResponsiveContainer height="100%" initialDimension={{ height, width: 640 }} width="100%">
                <BarChart data={normalizedData} layout="vertical" margin={margin} accessibilityLayer>
                  <CartesianGrid {...resolveGridProps(grid)} />
                  <XAxis
                    axisLine={xAxis?.axisLine}
                    domain={xAxis?.domain}
                    interval={xAxis?.interval}
                    minTickGap={xAxis?.minTickGap}
                    stroke={chartTheme.axis.lineColor}
                    tick={resolveAxisTick(xAxis)}
                    tickLine={xAxis?.tickLine}
                    ticks={xAxis?.ticks}
                    tickFormatter={(value) => formatChartValue(toChartValue(value), format, formatOptions)}
                    type="number"
                  />
                  <YAxis
                    axisLine={yAxis?.axisLine}
                    interval={yAxis?.interval ?? 0}
                    stroke={chartTheme.axis.lineColor}
                    tick={resolveAxisTick(yAxis)}
                    tickLine={yAxis?.tickLine}
                    width={yAxis?.width}
                    dataKey="label"
                    type="category"
                  />
                  <Tooltip
                    cursor={tooltip?.cursor}
                    content={<HorizontalBarTooltip format={format} formatOptions={formatOptions} tooltip={tooltip} />}
                  />
                  <Bar
                    barSize={barSize}
                    dataKey="__value"
                    isAnimationActive={!prefersReducedMotion}
                    radius={radius}
                  >
                    {normalizedData.map((item) => <Cell fill={item.__color} key={item.__key} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {showLegend ? (
              <div aria-label={localization.messages.chartLegend} style={styles.legend}>
                {normalizedData.map((item) => (
                  <span key={item.__key} style={styles.legendItem}>
                    <span aria-hidden="true" style={{ ...styles.marker, background: item.__color }} />
                    <span>{item.label}</span>
                    <span>{formatChartValue(toChartValue(item.__value), format, formatOptions)}</span>
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
