import type { CSSProperties, ReactNode } from 'react';
import { Bar, CartesianGrid, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { formatChartValue, type ChartValueFormatOptions } from '../../formatters';
import { chartTheme } from '../../theme';
import type { ChartDatum, ChartFormat, ChartSeries, ChartValue } from '../../types';

export type ComboChartSeriesType = 'bar' | 'line';

export interface ComboChartSeries<TDatum extends object = ChartDatum> extends ChartSeries<TDatum> {
  type: ComboChartSeriesType;
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
}

export interface ComboChartProps<TDatum extends object = ChartDatum> {
  title?: ReactNode;
  data: TDatum[];
  xKey: keyof TDatum & string;
  series: Array<ComboChartSeries<TDatum>>;
  height?: number;
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
  xFormat?: ChartFormat;
  xFormatOptions?: ChartValueFormatOptions;
  emptyMessage?: ReactNode;
}

interface TooltipPayloadItem {
  color?: string;
  dataKey?: string;
  name?: string;
  value?: string | number | Date | null;
}

interface ComboTooltipProps {
  active?: boolean;
  label?: string | number | Date;
  payload?: TooltipPayloadItem[];
  seriesById: Map<string, ComboChartSeries<Record<string, unknown>>>;
  format: ChartFormat;
  formatOptions: ChartValueFormatOptions;
  xFormat?: ChartFormat;
  xFormatOptions: ChartValueFormatOptions;
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
  lineMarker: {
    borderRadius: 999,
    flex: '0 0 auto',
    height: 3,
    width: 14
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

const getSeriesFormat = (series: ComboChartSeries<Record<string, unknown>> | undefined, fallback: ChartFormat) =>
  series?.format ?? fallback;

const getSeriesFormatOptions = (
  series: ComboChartSeries<Record<string, unknown>> | undefined,
  fallback: ChartValueFormatOptions
) => series?.formatOptions ?? fallback;

const getFormatKey = (seriesFormat: ChartFormat | undefined, fallback: ChartFormat) => seriesFormat ?? fallback;

const getFormatOptionsKey = (options: ChartValueFormatOptions | undefined) =>
  JSON.stringify(
    Object.entries(options ?? {})
      .filter(([, value]) => value !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
  );

const getAxisFormatKey = (
  seriesFormat: ChartFormat | undefined,
  seriesOptions: ChartValueFormatOptions | undefined,
  fallbackFormat: ChartFormat,
  fallbackOptions: ChartValueFormatOptions
) => `${getFormatKey(seriesFormat, fallbackFormat)}:${getFormatOptionsKey(seriesOptions ?? fallbackOptions)}`;

function ComboTooltip({
  active,
  format,
  formatOptions,
  label,
  payload,
  seriesById,
  xFormat,
  xFormatOptions
}: ComboTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div style={styles.tooltip}>
      <div style={styles.tooltipLabel}>{formatCategoryValue(label, xFormat, xFormatOptions)}</div>
      {payload.map((item) => {
        const id = String(item.dataKey ?? item.name ?? '');
        const series = seriesById.get(id);

        return (
          <div key={id} style={styles.tooltipRow}>
            <span>{series?.label ?? item.name ?? id}</span>
            <strong>
              {formatChartValue(
                item.value,
                getSeriesFormat(series, format),
                getSeriesFormatOptions(series, formatOptions)
              )}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

export function ComboChart<TDatum extends object = ChartDatum>({
  data,
  emptyMessage = 'No data available',
  format = 'number',
  formatOptions = {},
  height = 280,
  series,
  title,
  xFormat,
  xFormatOptions = {},
  xKey
}: ComboChartProps<TDatum>) {
  const seriesWithColor = series.map((item, index) => ({
    ...item,
    color: item.color ?? chartTheme.palette[index % chartTheme.palette.length]
  }));
  const baseAxisFormatKey = getAxisFormatKey(undefined, undefined, format, formatOptions);
  const alternateAxisFormatKeys = Array.from(
    new Set(
      seriesWithColor
        .map((item) => getAxisFormatKey(item.format, item.formatOptions, format, formatOptions))
        .filter((itemFormat) => itemFormat !== baseAxisFormatKey)
    )
  );

  if (alternateAxisFormatKeys.length > 1) {
    throw new Error('ComboChart supports one alternate series format. Use the base format plus one secondary format.');
  }

  const rightAxisFormatKey = alternateAxisFormatKeys[0];
  const rightAxisSeries = seriesWithColor.find(
    (item) => getAxisFormatKey(item.format, item.formatOptions, format, formatOptions) === rightAxisFormatKey
  );
  const seriesById = new Map(
    seriesWithColor.map((item) => [item.id, item as unknown as ComboChartSeries<Record<string, unknown>>])
  );
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
              <ComposedChart data={data}>
                <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray={chartTheme.grid.strokeDasharray} />
                <XAxis
                  dataKey={xKey as never}
                  stroke={chartTheme.axis.lineColor}
                  tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.fontSize }}
                  tickFormatter={(value) => formatCategoryValue(toChartValue(value), xFormat, xFormatOptions)}
                />
                <YAxis
                  yAxisId="left"
                  stroke={chartTheme.axis.lineColor}
                  tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.fontSize }}
                  tickFormatter={(value) => formatChartValue(toChartValue(value), format, formatOptions)}
                />
                {rightAxisSeries ? (
                  <YAxis
                    orientation="right"
                    stroke={chartTheme.axis.lineColor}
                    tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.fontSize }}
                    tickFormatter={(value) =>
                      formatChartValue(
                        toChartValue(value),
                        rightAxisSeries.format ?? format,
                        rightAxisSeries.formatOptions ?? formatOptions
                      )
                    }
                    yAxisId="right"
                  />
                ) : null}
                <Tooltip
                  content={
                    <ComboTooltip
                      format={format}
                      formatOptions={formatOptions}
                      seriesById={seriesById}
                      xFormat={xFormat}
                      xFormatOptions={xFormatOptions}
                    />
                  }
                />
                {seriesWithColor.map((item) =>
                  item.type === 'bar' ? (
                    <Bar
                      dataKey={item.id}
                      fill={item.color}
                      key={item.id}
                      name={item.label}
                      radius={[4, 4, 0, 0]}
                      yAxisId={
                        getAxisFormatKey(item.format, item.formatOptions, format, formatOptions) === rightAxisFormatKey
                          ? 'right'
                          : 'left'
                      }
                    />
                  ) : (
                    <Line
                      activeDot={{ r: 4 }}
                      dataKey={item.id}
                      dot={false}
                      key={item.id}
                      name={item.label}
                      stroke={item.color}
                      strokeWidth={2}
                      type="monotone"
                      yAxisId={
                        getAxisFormatKey(item.format, item.formatOptions, format, formatOptions) === rightAxisFormatKey
                          ? 'right'
                          : 'left'
                      }
                    />
                  )
                )}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div aria-label="Chart legend" style={styles.legend}>
            {seriesWithColor.map((item) => {
              const firstDatum = data.find((datum) => !isEmptyValue(getDatumValue(datum, item.id)));

              return (
                <span key={item.id} style={styles.legendItem}>
                  <span
                    aria-hidden="true"
                    style={{
                      ...(item.type === 'line' ? styles.lineMarker : styles.marker),
                      background: item.color
                    }}
                  />
                  <span>{item.label}</span>
                  <span style={styles.legendValue}>
                    {formatChartValue(
                      toChartValue(getDatumValue(firstDatum, item.id)),
                      item.format ?? format,
                      item.formatOptions ?? formatOptions
                    )}
                  </span>
                </span>
              );
            })}
          </div>
        </>
      ) : (
        <div role="status" style={{ ...styles.empty, minHeight: height }}>
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
