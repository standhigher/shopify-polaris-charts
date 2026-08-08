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
import { chartTheme } from '../../theme';
import type { ChartDatum, ChartFormat, ChartSeries, ChartValue } from '../../types';

type TrendMode = 'line' | 'area';

export interface TrendChartProps<TDatum extends object = ChartDatum> {
  title?: ReactNode;
  data: TDatum[];
  xKey: keyof TDatum & string;
  series: Array<ChartSeries<TDatum>>;
  mode?: TrendMode;
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

interface TrendTooltipProps {
  active?: boolean;
  label?: string | number | Date;
  payload?: TooltipPayloadItem[];
  seriesById: Map<string, ChartSeries<Record<string, unknown>>>;
  format: ChartFormat;
  formatOptions: ChartValueFormatOptions;
  xFormat: ChartFormat;
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

function TrendTooltip({
  active,
  format,
  formatOptions,
  label,
  payload,
  seriesById,
  xFormat,
  xFormatOptions
}: TrendTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div style={styles.tooltip}>
      <div style={styles.tooltipLabel}>{formatChartValue(label, xFormat, xFormatOptions)}</div>
      {payload.map((item) => {
        const id = String(item.dataKey ?? item.name ?? '');
        const series = seriesById.get(id);

        return (
          <div key={id} style={styles.tooltipRow}>
            <span>{series?.label ?? item.name ?? id}</span>
            <strong>{formatChartValue(item.value, format, formatOptions)}</strong>
          </div>
        );
      })}
    </div>
  );
}

export function TrendChart<TDatum extends object = ChartDatum>({
  data,
  emptyMessage = 'No data available',
  format = 'number',
  formatOptions = {},
  height = 280,
  mode = 'line',
  series,
  title,
  xFormat = 'date',
  xFormatOptions = {},
  xKey
}: TrendChartProps<TDatum>) {
  const seriesWithColor = series.map((item, index) => ({
    ...item,
    color: item.color ?? chartTheme.palette[index % chartTheme.palette.length]
  }));
  const seriesById = new Map(
    seriesWithColor.map((item) => [item.id, item as unknown as ChartSeries<Record<string, unknown>>])
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
            <ResponsiveContainer height="100%" width="100%">
              {mode === 'area' ? (
                <AreaChart data={data}>
                  <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray={chartTheme.grid.strokeDasharray} />
                  <XAxis
                    dataKey={xKey as never}
                    stroke={chartTheme.axis.lineColor}
                    tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.fontSize }}
                    tickFormatter={(value) => formatChartValue(toChartValue(value), xFormat, xFormatOptions)}
                  />
                  <YAxis
                    stroke={chartTheme.axis.lineColor}
                    tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.fontSize }}
                    tickFormatter={(value) => formatChartValue(toChartValue(value), format, formatOptions)}
                  />
                  <Tooltip
                    content={
                      <TrendTooltip
                        format={format}
                        formatOptions={formatOptions}
                        seriesById={seriesById}
                        xFormat={xFormat}
                        xFormatOptions={xFormatOptions}
                      />
                    }
                  />
                  {seriesWithColor.map((item) => (
                    <Area
                      activeDot={{ r: 4 }}
                      dataKey={item.id}
                      fill={item.color}
                      fillOpacity={0.12}
                      key={item.id}
                      name={item.label}
                      stroke={item.color}
                      strokeWidth={2}
                      type="monotone"
                    />
                  ))}
                </AreaChart>
              ) : (
                <LineChart data={data}>
                  <CartesianGrid stroke={chartTheme.grid.stroke} strokeDasharray={chartTheme.grid.strokeDasharray} />
                  <XAxis
                    dataKey={xKey as never}
                    stroke={chartTheme.axis.lineColor}
                    tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.fontSize }}
                    tickFormatter={(value) => formatChartValue(toChartValue(value), xFormat, xFormatOptions)}
                  />
                  <YAxis
                    stroke={chartTheme.axis.lineColor}
                    tick={{ fill: chartTheme.axis.tickColor, fontSize: chartTheme.axis.fontSize }}
                    tickFormatter={(value) => formatChartValue(toChartValue(value), format, formatOptions)}
                  />
                  <Tooltip
                    content={
                      <TrendTooltip
                        format={format}
                        formatOptions={formatOptions}
                        seriesById={seriesById}
                        xFormat={xFormat}
                        xFormatOptions={xFormatOptions}
                      />
                    }
                  />
                  {seriesWithColor.map((item) => (
                    <Line
                      activeDot={{ r: 4 }}
                      dataKey={item.id}
                      dot={false}
                      key={item.id}
                      name={item.label}
                      stroke={item.color}
                      strokeWidth={2}
                      type="monotone"
                    />
                  ))}
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
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
        </>
      ) : (
        <div role="status" style={{ ...styles.empty, minHeight: height }}>
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
