import type { CSSProperties, ReactNode } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatChartValue, type ChartValueFormatOptions } from '../../formatters';
import { chartTheme } from '../../theme';
import type {
  CartesianAxisOptions,
  ChartDatum,
  ChartFormat,
  ChartGridOptions,
  ChartMargin,
  ChartSeries,
  ChartTooltipContentProps,
  ChartTooltipPayloadItem,
  ChartTooltipOptions,
  ChartValue,
  StackedBarChartRechartsProps
} from '../../types';
import {
  getBarRechartsProps,
  getCartesianGridRechartsProps,
  getChartRechartsProps,
  getTooltipRechartsProps,
  getXAxisRechartsProps,
  getYAxisRechartsProps
} from '../cartesianRechartsProps';

export interface StackedBarChartProps<TDatum extends object = ChartDatum> {
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
    color: chartTheme.text.primary,
    display: 'flex',
    flexDirection: 'column',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    gap: 12,
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
    gap: '8px 16px'
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
  data,
  emptyMessage = 'No data available',
  format = 'number',
  formatOptions = {},
  grid,
  height = 280,
  margin,
  rechartsProps,
  series,
  showLegend = true,
  title,
  tooltip,
  xFormat,
  xFormatOptions = {},
  xAxis,
  yAxis,
  xKey
}: StackedBarChartProps<TDatum>) {
  const seriesWithColor = series.map((item, index) => ({
    ...item,
    color: item.color ?? chartTheme.palette[index % chartTheme.palette.length]
  }));
  const hasData =
    data.length > 0 &&
    seriesWithColor.some((item) => data.some((datum) => !isEmptyValue(getDatumValue(datum, item.id))));

  return (
    <div style={styles.container}>
      {title ? <h3 style={styles.heading}>{title}</h3> : null}
      {hasData ? (
        <>
          <div style={{ height, width: '100%' }}>
            <ResponsiveContainer height="100%" initialDimension={{ height, width: 640 }} width="100%">
              <BarChart margin={margin} {...getChartRechartsProps(rechartsProps?.chart)} data={data}>
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
                    name={item.label}
                    stackId="stack"
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          {showLegend ? (
            <div aria-label="Chart legend" style={styles.legend}>
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
      ) : (
        <div role="status" style={{ ...styles.empty, minHeight: height }}>
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
