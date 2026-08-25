import { useMemo } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

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
  ChartLineOptions,
  ChartMargin,
  ChartSeries,
  ChartTooltipContentProps,
  ChartTooltipPayloadItem,
  ChartTooltipOptions,
  ChartValue,
  TrendChartRevealOptions,
  TrendChartRechartsProps,
  TrendChartSkeletonOptions
} from '../../types';
import { ChartAccessibilityRegion } from '../ChartAccessibility';
import { ChartStateRegion } from '../ChartState';
import { useChartLocalization } from '../ChartLocalization';
import {
  getAreaRechartsProps,
  getCartesianGridRechartsProps,
  getChartRechartsProps,
  getLineRechartsProps,
  getTooltipRechartsProps,
  getXAxisRechartsProps,
  getYAxisRechartsProps,
  onChartMouse
} from '../cartesianRechartsProps';
import type { LineDataKey, LineGapSegment } from '../lineGapUtils';
import { analyzeLineGaps } from '../lineGapUtils';
import {
  GAP_CONNECTOR_DATA_KEY_PREFIX,
  createGapConnectorData,
  filterGapConnectorPayload,
  normalizeLineData,
  resolveGapConnectorProps,
  resolveLineActiveDot,
  resolveLineDot
} from '../lineGapVisualization';

type TrendMode = 'line' | 'area';

export interface TrendChartProps<TDatum extends object = ChartDatum> {
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
  line?: ChartLineOptions;
  rechartsProps?: TrendChartRechartsProps;
  mode?: TrendMode;
  height?: number;
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
  xFormat?: ChartFormat;
  xFormatOptions?: ChartValueFormatOptions;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  loadingLabel?: ReactNode;
  onRetry?: () => void;
  retryLabel?: ReactNode;
  reveal?: boolean | TrendChartRevealOptions;
  retryAction?: ReactNode;
  skeleton?: boolean | TrendChartSkeletonOptions;
  state?: ChartContentState;
}

interface TrendTooltipProps<TDatum extends object> {
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
  errorAction: {
    background: chartTheme.palette[0],
    border: 0,
    borderRadius: 6,
    color: '#ffffff',
    cursor: 'pointer',
    fontSize: 13,
    fontWeight: 650,
    padding: '8px 12px'
  },
  errorMessage: {
    color: chartTheme.text.secondary,
    fontSize: 13,
    lineHeight: 1.45,
    margin: 0
  },
  errorPanel: {
    alignItems: 'center',
    background: chartTheme.surface.subtleBackground,
    border: `1px solid ${chartTheme.surface.border}`,
    borderRadius: 6,
    color: chartTheme.text.primary,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    minHeight: 180,
    padding: 24,
    textAlign: 'center'
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 650,
    margin: 0
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
  revealOverlay: {
    alignItems: 'center',
    background: 'rgba(255, 255, 255, 0.82)',
    borderRadius: 6,
    color: chartTheme.text.secondary,
    display: 'flex',
    fontSize: 13,
    inset: 0,
    justifyContent: 'center',
    position: 'absolute'
  },
  skeleton: {
    background: chartTheme.surface.subtleBackground,
    border: `1px solid ${chartTheme.surface.border}`,
    borderRadius: 6,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    justifyContent: 'center',
    minHeight: 180,
    overflow: 'hidden',
    padding: 24
  },
  skeletonLabel: {
    color: chartTheme.text.secondary,
    fontSize: 13
  },
  skeletonLine: {
    background: `linear-gradient(90deg, ${chartTheme.surface.border}, rgba(255, 255, 255, 0.9), ${chartTheme.surface.border})`,
    borderRadius: 999,
    height: 8,
    width: '100%'
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

const isEmptyValue = (value: unknown) =>
  value === null || value === undefined || value === '' || Number.isNaN(value);

const defaultActiveDot = { r: 4 };
const defaultStrokeWidth = 2;

const getSeriesPresentationProps = <TDatum extends object>(item: ChartSeries<TDatum>) => {
  const props: { opacity?: number; strokeDasharray?: string | number; strokeWidth?: number } = {};

  if (item.opacity !== undefined) {
    props.opacity = item.opacity;
  }

  if (item.strokeDasharray !== undefined) {
    props.strokeDasharray = item.strokeDasharray;
  }

  if (item.strokeWidth !== undefined) {
    props.strokeWidth = item.strokeWidth;
  }

  return props;
};

const getEffectiveStrokeWidth = <TDatum extends object>(
  item: ChartSeries<TDatum>,
  configuredStrokeWidth: number | string | undefined
) => {
  const strokeWidth = item.strokeWidth ?? configuredStrokeWidth;

  if (strokeWidth === undefined) {
    return defaultStrokeWidth;
  }

  const numericStrokeWidth = typeof strokeWidth === 'number' ? strokeWidth : Number(strokeWidth);

  return Number.isFinite(numericStrokeWidth) ? numericStrokeWidth : defaultStrokeWidth;
};

const resolveAreaDot = (
  dot: ChartLineOptions['dot'],
  effectiveStrokeWidth: number
): ChartLineOptions['dot'] => {
  if (dot === undefined || typeof dot === 'boolean') {
    return dot;
  }

  const safeDot = { ...dot };
  delete safeDot.show;

  if (safeDot.r === 'auto') {
    safeDot.r = effectiveStrokeWidth / 2;
  }

  return safeDot;
};

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

const createFullLengthGapConnectorData = <TDatum extends object>(
  data: readonly TDatum[],
  segment: LineGapSegment<TDatum>,
  dataKey: LineDataKey<TDatum>,
  xKey: LineDataKey<TDatum>,
  internalDataKey: string
): Array<TDatum & Record<string, unknown>> => {
  const endpointData = createGapConnectorData(segment, dataKey, xKey, internalDataKey);

  return data.map((datum, index) => ({
    ...datum,
    [internalDataKey]:
      index === segment.startIndex
        ? endpointData[0][internalDataKey]
        : index === segment.endIndex
          ? endpointData[1][internalDataKey]
          : null
  }));
};

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

function TrendTooltip<TDatum extends object>({
  active,
  format,
  formatOptions,
  label,
  payload,
  series,
  tooltip,
  xFormat,
  xFormatOptions
}: TrendTooltipProps<TDatum>) {
  const visiblePayload = filterGapConnectorPayload(payload ?? [], (item) => item.dataKey);

  if (!active || !visiblePayload.length) {
    return null;
  }

  const payloadWithSeries: Array<ChartTooltipPayloadItem<TDatum>> = visiblePayload.map((item) => {
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

export function TrendChart<TDatum extends object = ChartDatum>({
  accessibility,
  data,
  emptyMessage,
  errorMessage,
  format = 'number',
  formatOptions: suppliedFormatOptions,
  grid,
  height = 280,
  line,
  loadingLabel,
  margin,
  mode = 'line',
  onRetry,
  rechartsProps,
  retryLabel,
  retryAction,
  reveal,
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
}: TrendChartProps<TDatum>) {
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
  const lineData = useMemo(() => {
    if (mode === 'area') {
      return data;
    }

    return seriesWithColor.reduce<TDatum[]>(
      (normalizedData, item) =>
        normalizeLineData(normalizedData, item.id as LineDataKey<TDatum>),
      data
    );
  }, [data, mode, seriesWithColor]);
  const lineSeries = useMemo(() => {
    if (mode === 'area') {
      return [];
    }

    return seriesWithColor.map((item) => {
      const dataKey = item.id as LineDataKey<TDatum>;
      const effectiveStrokeWidth = getEffectiveStrokeWidth(item, rechartsProps?.line?.strokeWidth);

      return {
        analysis: analyzeLineGaps(lineData, dataKey),
        dataKey,
        effectiveStrokeWidth,
        item
      };
    });
  }, [lineData, mode, rechartsProps?.line?.strokeWidth, seriesWithColor]);
  const hasData =
    data.length > 0 &&
    seriesWithColor.some((item) => data.some((datum) => !isEmptyValue(getDatumValue(datum, item.id))));
  const resolvedState = state === 'ready' && !hasData ? 'empty' : state;
  const renderChart = () => (
    <div onMouseDown={onChartMouse} style={{ height, position: 'relative', width: '100%' }}>
      <ResponsiveContainer height="100%" initialDimension={{ height, width: 640 }} width="100%">
        {mode === 'area' ? (
          <AreaChart margin={margin} {...getChartRechartsProps(rechartsProps?.chart)} accessibilityLayer data={data}>
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
                <TrendTooltip
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
              <Area
                fillOpacity={0.12}
                key={item.id}
                {...getAreaRechartsProps(rechartsProps?.area)}
                {...getSeriesPresentationProps(item)}
                activeDot={
                  rechartsProps?.area?.activeDot ??
                  resolveLineActiveDot(
                    line?.activeDot ?? defaultActiveDot,
                    getEffectiveStrokeWidth(item, rechartsProps?.area?.strokeWidth)
                  )
                }
                dataKey={item.id}
                dot={
                  rechartsProps?.area?.dot ??
                  resolveAreaDot(
                    line?.dot ?? false,
                    getEffectiveStrokeWidth(item, rechartsProps?.area?.strokeWidth)
                  )
                }
                fill={item.color}
                isAnimationActive={prefersReducedMotion ? false : rechartsProps?.area?.isAnimationActive}
                name={item.label}
                stroke={item.color}
                strokeWidth={getEffectiveStrokeWidth(item, rechartsProps?.area?.strokeWidth)}
                type="monotone"
              />
            ))}
          </AreaChart>
        ) : (
          <LineChart margin={margin} {...getChartRechartsProps(rechartsProps?.chart)} accessibilityLayer data={lineData}>
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
                <TrendTooltip
                  format={format}
                  formatOptions={formatOptions}
                  series={seriesWithColor}
                  tooltip={tooltip}
                  xFormat={xFormat}
                  xFormatOptions={xFormatOptions}
                />
              }
            />
            {lineSeries.flatMap(({ analysis, effectiveStrokeWidth, item }) => {
              const connectorProps = resolveGapConnectorProps(
                item.connectGaps,
                item.color,
                effectiveStrokeWidth
              );

              if (!connectorProps) {
                return [];
              }

              return analysis.segments.map((segment, segmentIndex) => {
                const internalDataKey = `${GAP_CONNECTOR_DATA_KEY_PREFIX}${item.id}-${segmentIndex}`;

                return (
                  <Line
                    {...getLineRechartsProps(rechartsProps?.line)}
                    activeDot={false}
                    connectNulls
                    data={createFullLengthGapConnectorData(
                      lineData,
                      segment,
                      item.id as LineDataKey<TDatum>,
                      xKey,
                      internalDataKey
                    )}
                    dataKey={internalDataKey}
                    dot={false}
                    isAnimationActive={prefersReducedMotion ? false : rechartsProps?.line?.isAnimationActive}
                    key={internalDataKey}
                    opacity={connectorProps.opacity}
                    stroke={connectorProps.stroke}
                    strokeDasharray={connectorProps.strokeDasharray}
                    strokeWidth={connectorProps.strokeWidth}
                    type="linear"
                  />
                );
              });
            })}
            {lineSeries.map(({ analysis, dataKey, effectiveStrokeWidth, item }) => (
              <Line
                {...getLineRechartsProps(rechartsProps?.line)}
                {...getSeriesPresentationProps(item)}
                activeDot={
                  rechartsProps?.line?.activeDot ??
                  resolveLineActiveDot(line?.activeDot ?? defaultActiveDot, effectiveStrokeWidth)
                }
                connectNulls={false}
                dataKey={dataKey}
                dot={
                  rechartsProps?.line?.dot ??
                  resolveLineDot(line?.dot ?? false, {
                    effectiveStrokeWidth,
                    isolatedIndexes: analysis.isolatedIndexes,
                    seriesColor: item.color
                  })
                }
                isAnimationActive={prefersReducedMotion ? false : rechartsProps?.line?.isAnimationActive}
                key={item.id}
                name={item.label}
                stroke={item.color}
                strokeWidth={effectiveStrokeWidth}
                type="monotone"
              />
            ))}
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );

  const chartContent = (
    <>
        {renderChart()}
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
  );

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
          {chartContent}
        </ChartStateRegion>
      </div>
    </ChartAccessibilityRegion>
  );
}
