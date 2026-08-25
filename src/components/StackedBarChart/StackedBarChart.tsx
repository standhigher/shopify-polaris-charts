import { useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatChartValue, type ChartValueFormatOptions } from '../../formatters';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { chartTheme } from '../../theme';
import type {
  CartesianAxisOptions,
  ChartAccessibilityOptions,
  ChartContentState,
  ChartDatum,
  ChartFormat,
  ChartGridOptions,
  ChartMargin,
  ChartSeries,
  ChartRevealOptions,
  ChartSkeletonOptions,
  ChartTooltipContentProps,
  ChartTooltipPayloadItem,
  ChartTooltipOptions,
  ChartValue,
  StackedBarChartRechartsProps
} from '../../types';
import { ChartAccessibilityRegion } from '../ChartAccessibility';
import { ChartStateRegion } from '../ChartState';
import { useChartLocalization } from '../ChartLocalization';
import { chartSurfaceProps } from '../chartSurface';
import {
  getBarRechartsProps,
  getCartesianGridRechartsProps,
  getChartRechartsProps,
  getTooltipRechartsProps,
  getXAxisRechartsProps,
  getYAxisRechartsProps
} from '../cartesianRechartsProps';

export interface StackedBarChartProps<TDatum extends object = ChartDatum> {
  accessibility?: ChartAccessibilityOptions;
  title?: ReactNode;
  data: TDatum[];
  xKey: keyof TDatum & string;
  series: Array<ChartSeries<TDatum>>;
  showLegend?: boolean;
  margin?: ChartMargin;
  xAxis?: CartesianAxisOptions;
  yAxis?: CartesianAxisOptions;
  grid?: ChartGridOptions;
  tooltip?: ChartTooltipOptions<TDatum>;
  rechartsProps?: StackedBarChartRechartsProps;
  height?: number;
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
  xFormat?: ChartFormat;
  xFormatOptions?: ChartValueFormatOptions;
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

interface StackedTooltipProps<TDatum extends object> {
  active?: boolean;
  label?: ChartValue;
  payload?: Array<ChartTooltipPayloadItem<TDatum>>;
  series: Array<ChartSeries<TDatum>>;
  format: ChartFormat;
  formatOptions: ChartValueFormatOptions;
  xFormat?: ChartFormat;
  xFormatOptions: ChartValueFormatOptions;
  tooltip?: ChartTooltipOptions<TDatum>;
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
  tooltipLabel: {
    fontWeight: 650,
    marginBottom: 6
  },
  tooltipRow: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    minWidth: 160
  }
};

const isEmptyValue = (value: unknown) => value === null || value === undefined || value === '';

const resolveAxisTick = (axis?: CartesianAxisOptions) => ({
  fill: axis?.tickColor ?? chartTheme.axis.tickColor,
  fontSize: axis?.tickFontSize ?? chartTheme.axis.fontSize
});

const resolveGridProps = (grid?: ChartGridOptions) => ({
  horizontal: grid?.horizontal ?? true,
  stroke: grid?.stroke ?? chartTheme.grid.stroke,
  strokeDasharray: grid?.strokeDasharray ?? chartTheme.grid.strokeDasharray,
  vertical: grid?.vertical ?? true
});

const toChartValue = (value: unknown): ChartValue => {
  if (value instanceof Date || typeof value === 'string' || typeof value === 'number') {
    return value;
  }

  return null;
};

const getDatumValue = <TDatum extends object>(datum: TDatum | undefined, key: string) =>
  datum ? (datum as Record<string, unknown>)[key] : undefined;

const formatCategoryValue = (
  value: string | number | Date | null | undefined,
  format: ChartFormat | undefined,
  formatOptions: ChartValueFormatOptions
) => {
  if (format) {
    return formatChartValue(value, format, formatOptions);
  }

  if (value === null || value === undefined) {
    return '';
  }

  return value instanceof Date ? value.toISOString() : String(value);
};

function StackedTooltip<TDatum extends object>({
  active,
  format,
  formatOptions,
  label,
  payload,
  series,
  tooltip,
  xFormat,
  xFormatOptions
}: StackedTooltipProps<TDatum>) {
  if (!active || !payload?.length) {
    return null;
  }

  const payloadWithSeries: Array<ChartTooltipPayloadItem<TDatum>> = payload.map((item) => {
    const id = String(item.dataKey ?? item.name ?? '');

    return {
      ...item,
      series: item.series ?? series.find((seriesItem) => seriesItem.id === id)
    };
  });
  const formatLabel = (value: ChartValue, items = payloadWithSeries) =>
    tooltip?.labelFormatter?.(value, items) ?? formatCategoryValue(value, xFormat, xFormatOptions);
  const formatValue = (value: ChartValue, seriesItem?: ChartSeries<TDatum>) =>
    tooltip?.valueFormatter?.(value, seriesItem) ?? formatChartValue(value, format, formatOptions);
  const contentProps: ChartTooltipContentProps<TDatum> = {
    active,
    format,
    formatLabel,
    formatOptions,
    formatValue,
    label,
    payload: payloadWithSeries,
    series,
    xFormat,
    xFormatOptions
  };

  if (tooltip?.content) {
    const Content = tooltip.content;

    return <Content {...contentProps} />;
  }

  return (
    <div className={tooltip?.className} style={{ ...styles.tooltip, minWidth: tooltip?.minWidth }}>
      <div style={styles.tooltipLabel}>{formatLabel(label)}</div>
      {payloadWithSeries.map((item) => {
        const id = String(item.dataKey ?? item.name ?? '');

        return (
          <div key={id} style={styles.tooltipRow}>
            <span>{item.series?.label ?? item.name ?? id}</span>
            <strong>{formatValue(item.value, item.series)}</strong>
          </div>
        );
      })}
    </div>
  );
}

export function StackedBarChart<TDatum extends object = ChartDatum>({
  accessibility,
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
  rechartsProps,
  reveal,
  retryAction,
  retryLabel,
  series,
  showLegend = true,
  skeleton,
  state = 'ready',
  title,
  tooltip,
  xFormat,
  xFormatOptions: suppliedXFormatOptions,
  xAxis,
  yAxis,
  xKey
}: StackedBarChartProps<TDatum>) {
  const localization = useChartLocalization();
  const prefersReducedMotion = usePrefersReducedMotion();
  const formatOptions = useMemo(() => ({
    currency: localization.currency,
    locale: localization.locale,
    timeZone: localization.timeZone,
    ...suppliedFormatOptions
  }), [localization.currency, localization.locale, localization.timeZone, suppliedFormatOptions]);
  const xFormatOptions = useMemo(() => ({
    locale: localization.locale,
    timeZone: localization.timeZone,
    ...suppliedXFormatOptions
  }), [localization.locale, localization.timeZone, suppliedXFormatOptions]);
  const seriesWithColor = useMemo(
    () => series.map((item, index) => ({
      ...item,
      color: item.color ?? chartTheme.palette[index % chartTheme.palette.length]
    })),
    [series]
  );
  const hasData =
    data.length > 0 &&
    seriesWithColor.some((item) => data.some((datum) => !isEmptyValue(getDatumValue(datum, item.id))));
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
          <div style={{ height, width: '100%' }} {...chartSurfaceProps}>
            <ResponsiveContainer height="100%" initialDimension={{ height, width: 640 }} width="100%">
              <BarChart margin={margin} {...getChartRechartsProps(rechartsProps?.chart)} accessibilityLayer data={data}>
                <CartesianGrid {...resolveGridProps(grid)} {...getCartesianGridRechartsProps(rechartsProps?.cartesianGrid)} />
                <XAxis
                  axisLine={xAxis?.axisLine}
                  interval={xAxis?.interval}
                  minTickGap={xAxis?.minTickGap}
                  stroke={chartTheme.axis.lineColor}
                  tick={resolveAxisTick(xAxis)}
                  tickLine={xAxis?.tickLine}
                  ticks={xAxis?.ticks}
                  {...getXAxisRechartsProps(rechartsProps?.xAxis)}
                  dataKey={xKey as never}
                  tickFormatter={(value) => formatCategoryValue(toChartValue(value), xFormat, xFormatOptions)}
                />
                <YAxis
                  axisLine={yAxis?.axisLine}
                  domain={yAxis?.domain}
                  stroke={chartTheme.axis.lineColor}
                  tick={resolveAxisTick(yAxis)}
                  tickLine={yAxis?.tickLine}
                  ticks={yAxis?.ticks}
                  width={yAxis?.width}
                  {...getYAxisRechartsProps(rechartsProps?.yAxis)}
                  tickFormatter={(value) => formatChartValue(toChartValue(value), format, formatOptions)}
                />
                <Tooltip
                  cursor={tooltip?.cursor}
                  {...getTooltipRechartsProps(rechartsProps?.tooltip)}
                  content={
                    <StackedTooltip
                      format={format}
                      formatOptions={formatOptions}
                      series={seriesWithColor}
                      tooltip={tooltip}
                      xFormat={xFormat}
                      xFormatOptions={xFormatOptions}
                    />
                  }
                />
                {seriesWithColor.map((item) => (
                  <Bar
                    key={item.id}
                    {...getBarRechartsProps(rechartsProps?.bar)}
                    dataKey={item.id}
                    fill={item.color}
                    isAnimationActive={prefersReducedMotion ? false : rechartsProps?.bar?.isAnimationActive}
                    name={item.label}
                    stackId="stack"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          {showLegend ? (
            <div aria-label={localization.messages.chartLegend} style={styles.legend}>
              {seriesWithColor.map((item) => {
                const firstDatum = data.find((datum) => !isEmptyValue(getDatumValue(datum, item.id)));

                return (
                  <span key={item.id} style={styles.legendItem}>
                    <span aria-hidden="true" style={{ ...styles.marker, background: item.color }} />
                    <span>{item.label}</span>
                    <span style={styles.legendValue}>
                      {formatChartValue(toChartValue(getDatumValue(firstDatum, item.id)), format, formatOptions)}
                    </span>
                  </span>
                );
              })}
            </div>
          ) : null}
        </>
      </ChartStateRegion>
    </div>
    </ChartAccessibilityRegion>
  );
}
