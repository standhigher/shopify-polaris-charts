import { useId, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { formatChartValue, type ChartValueFormatOptions } from '../../formatters';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { chartTheme } from '../../theme';
import type {
  ChartAccessibilityOptions,
  ChartContentState,
  ChartFormat,
  ChartRevealOptions,
  ChartSkeletonOptions
} from '../../types';
import { ChartAccessibilityRegion } from '../ChartAccessibility';
import { useChartLocalization } from '../ChartLocalization';
import { ChartStateRegion } from '../ChartState';
import { normalizeFunnelData, type FunnelDatum, type FunnelPercentageInput } from './funnel';

export interface FunnelChartProps {
  accessibility?: ChartAccessibilityOptions;
  colors?: readonly string[];
  data: FunnelDatum[];
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
  height?: number;
  loadingLabel?: ReactNode;
  onRetry?: () => void;
  percentageInput?: FunnelPercentageInput;
  retryAction?: ReactNode;
  retryLabel?: ReactNode;
  reveal?: boolean | ChartRevealOptions;
  skeleton?: boolean | ChartSkeletonOptions;
  state?: ChartContentState;
  title?: ReactNode;
}

const styles: Record<string, CSSProperties> = {
  chart: {
    color: chartTheme.text.primary,
    display: 'flex',
    flexDirection: 'column',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    gap: 12,
    width: '100%'
  },
  funnel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    listStyle: 'none',
    margin: 0,
    padding: 0,
    width: '100%'
  },
  heading: {
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.35,
    margin: 0
  },
  label: {
    fontSize: 13,
    fontWeight: 650,
    lineHeight: 1.35,
    overflowWrap: 'anywhere'
  },
  metric: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    minWidth: 0
  },
  metricLabel: {
    color: chartTheme.text.secondary,
    fontSize: 11,
    lineHeight: 1.3
  },
  metricValue: {
    color: chartTheme.text.primary,
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.35,
    overflowWrap: 'anywhere'
  },
  metrics: {
    display: 'grid',
    gap: 8,
    gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 110px), 1fr))'
  },
  segment: {
    borderRadius: 4,
    height: 14,
    transition: 'width 160ms ease'
  },
  segmentTrack: {
    alignItems: 'center',
    background: chartTheme.surface.subtleBackground,
    border: `1px solid ${chartTheme.surface.border}`,
    borderRadius: 5,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center',
    minHeight: 22,
    overflow: 'hidden',
    padding: 3,
    width: '100%'
  },
  stage: {
    appearance: 'none',
    background: chartTheme.surface.background,
    border: `1px solid ${chartTheme.surface.border}`,
    borderRadius: 8,
    boxSizing: 'border-box',
    color: 'inherit',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 10,
    textAlign: 'left',
    width: '100%'
  },
  tooltip: {
    background: chartTheme.tooltip.background,
    border: `1px solid ${chartTheme.tooltip.border}`,
    borderRadius: chartTheme.tooltip.borderRadius,
    boxShadow: chartTheme.tooltip.boxShadow,
    color: chartTheme.tooltip.textColor,
    fontSize: 12,
    lineHeight: 1.45,
    padding: 10
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1
  }
};

const displayMetric = (value: number | undefined, format: ChartFormat, options: ChartValueFormatOptions) =>
  typeof value === 'number' && Number.isFinite(value) ? formatChartValue(value, format, options) : '—';

export function FunnelChart({
  accessibility,
  colors,
  data,
  emptyMessage,
  errorMessage,
  format = 'number',
  formatOptions: suppliedFormatOptions = {},
  height = 360,
  loadingLabel,
  onRetry,
  percentageInput = 'ratio',
  retryAction,
  retryLabel,
  reveal,
  skeleton,
  state = 'ready',
  title
}: FunnelChartProps) {
  const localization = useChartLocalization();
  const prefersReducedMotion = usePrefersReducedMotion();
  const tooltipId = useId();
  const [activeStageId, setActiveStageId] = useState<string>();
  const normalizedData = normalizeFunnelData(data, percentageInput);
  const palette = colors?.length ? colors : chartTheme.palette;
  const maxValue = normalizedData.reduce(
    (maximum, stage) =>
      Number.isFinite(stage.value) && stage.value >= 0 ? Math.max(maximum, stage.value) : maximum,
    0
  );
  const formatOptions = {
    currency: localization.currency,
    locale: localization.locale,
    timeZone: localization.timeZone,
    ...suppliedFormatOptions
  };
  const resolvedState = state === 'ready' && normalizedData.length === 0 ? 'empty' : state;
  const activeStage = normalizedData.find((stage) => stage.id === activeStageId);
  const formatValue = (value: number | undefined) => displayMetric(value, format, formatOptions);
  const formatPercentage = (value: number | undefined) => displayMetric(value, 'percent', formatOptions);
  return (
    <ChartAccessibilityRegion accessibility={accessibility}>
    <div data-testid="funnel-chart" style={styles.chart}>
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
        <div style={{ minHeight: height }}>
          <span id={`${tooltipId}-list-label`} style={styles.visuallyHidden}>
            {localization.messages.funnelStages}
          </span>
          <ol aria-labelledby={`${tooltipId}-list-label`} style={styles.funnel}>
            {normalizedData.map((stage, index) => {
              const ratio = maxValue > 0 && Number.isFinite(stage.value) && stage.value > 0
                ? stage.value / maxValue
                : 0;
              const segmentWidth = `${Math.max(2, Math.min(100, ratio * 100))}%`;
              const isActive = stage.id === activeStageId;

              return (
                <li data-testid="funnel-stage" key={stage.id}>
                  <button
                    aria-describedby={isActive ? tooltipId : undefined}
                    onBlur={() => setActiveStageId(undefined)}
                    onClick={() => setActiveStageId(isActive ? undefined : stage.id)}
                    onFocus={() => setActiveStageId(stage.id)}
                    onMouseEnter={() => setActiveStageId(stage.id)}
                    onMouseLeave={() => setActiveStageId(undefined)}
                    style={styles.stage}
                    type="button"
                  >
                    <span style={styles.segmentTrack}>
                      <span
                        aria-hidden="true"
                        data-testid="funnel-segment"
                        style={{
                          ...styles.segment,
                          background: palette[index % palette.length],
                          transition: prefersReducedMotion ? 'none' : styles.segment.transition,
                          width: segmentWidth
                        }}
                      />
                    </span>
                    <span style={styles.metrics}>
                      <span style={styles.metric}>
                        <span style={styles.metricLabel}>{localization.messages.funnelStage}</span>
                        <span data-testid="funnel-stage-label" style={styles.label}>{stage.label}</span>
                      </span>
                      <span style={styles.metric}>
                        <span style={styles.metricLabel}>{localization.messages.funnelValue}</span>
                        <strong style={styles.metricValue}>{formatValue(stage.value)}</strong>
                      </span>
                      <span style={styles.metric}>
                        <span style={styles.metricLabel}>{localization.messages.funnelConversion}</span>
                        <strong style={styles.metricValue}>{formatPercentage(stage.conversion)}</strong>
                      </span>
                      <span style={styles.metric}>
                        <span style={styles.metricLabel}>{localization.messages.funnelDropOff}</span>
                        <strong style={styles.metricValue}>{formatPercentage(stage.dropOff)}</strong>
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {activeStage ? (
            <div id={tooltipId} role="tooltip" style={styles.tooltip}>
              <strong>{activeStage.label}</strong>
              {'. '}
              <span>{localization.messages.funnelValue} {formatValue(activeStage.value)}. </span>
              <span>{localization.messages.funnelConversion} {formatPercentage(activeStage.conversion)}. </span>
              <span>{localization.messages.funnelDropOff} {formatPercentage(activeStage.dropOff)}.</span>
            </div>
          ) : null}
        </div>
      </ChartStateRegion>
    </div>
    </ChartAccessibilityRegion>
  );
}
