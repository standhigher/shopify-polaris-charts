import type { CSSProperties, ReactNode } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { formatChartValue, type ChartValueFormatOptions } from '../../formatters';
import { chartTheme } from '../../theme';
import type { ChartDatum, ChartFormat, ChartValue } from '../../types';

export interface DonutChartProps<TDatum extends object = ChartDatum> {
  title?: ReactNode;
  data: TDatum[];
  categoryKey: keyof TDatum & string;
  valueKey: keyof TDatum & string;
  centerLabel?: ReactNode;
  height?: number;
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
  emptyMessage?: ReactNode;
}

interface DonutTooltipProps {
  active?: boolean;
  payload?: Array<{
    name?: string;
    value?: string | number | Date | null;
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
  tooltipRow: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    minWidth: 150
  }
};

const isPositiveNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value > 0;

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
  categoryKey,
  centerLabel,
  data,
  emptyMessage = 'No data available',
  format = 'number',
  formatOptions = {},
  height = 280,
  title,
  valueKey
}: DonutChartProps<TDatum>) {
  const slices = data
    .map((datum, index) => ({
      ...datum,
      __color: chartTheme.palette[index % chartTheme.palette.length],
      __name: String(getDatumValue(datum, categoryKey) ?? ''),
      __value: getDatumValue(datum, valueKey)
    }))
    .filter((datum) => isPositiveNumber(datum.__value));
  const hasData = slices.length > 0;

  return (
    <div style={styles.container}>
      {title ? <h3 style={styles.heading}>{title}</h3> : null}
      {hasData ? (
        <>
          <div style={{ ...styles.chartWrap, height }}>
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  data={slices}
                  dataKey="__value"
                  innerRadius="62%"
                  nameKey="__name"
                  outerRadius="86%"
                  paddingAngle={2}
                  stroke={chartTheme.surface.background}
                  strokeWidth={2}
                >
                  {slices.map((slice) => (
                    <Cell fill={slice.__color} key={slice.__name} />
                  ))}
                </Pie>
                <Tooltip content={<DonutTooltip format={format} formatOptions={formatOptions} />} />
              </PieChart>
            </ResponsiveContainer>
            {centerLabel ? <div style={styles.centerLabel}>{centerLabel}</div> : null}
          </div>
          <div aria-label="Chart legend" style={styles.legend}>
            {slices.map((item) => (
              <span key={item.__name} style={styles.legendItem}>
                <span aria-hidden="true" style={{ ...styles.marker, background: item.__color }} />
                <span>{item.__name}</span>
                <span style={styles.legendValue}>{formatChartValue(toChartValue(item.__value), format, formatOptions)}</span>
              </span>
            ))}
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
