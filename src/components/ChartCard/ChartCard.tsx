import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { chartTheme } from '../../theme';
import type { ChartState } from '../../types';

export interface ChartCardProps {
  title: ReactNode;
  subtitle?: ReactNode;
  metric?: ReactNode;
  trendLabel?: ReactNode;
  actions?: ReactNode;
  filters?: ReactNode;
  state: ChartState;
  errorMessage?: ReactNode;
  children?: ReactNode;
}

const stateCopy: Record<Exclude<ChartState, 'ready'>, string> = {
  empty: 'No data available',
  error: 'Unable to load chart',
  loading: 'Loading chart',
  'no-permission': 'No permission to view this chart',
  stale: 'Data may be out of date'
};

const styles: Record<string, CSSProperties> = {
  card: {
    background: chartTheme.surface.background,
    border: `1px solid ${chartTheme.surface.border}`,
    borderRadius: 8,
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.05)',
    color: chartTheme.text.primary,
    display: 'flex',
    flexDirection: 'column',
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
    overflow: 'hidden'
  },
  body: {
    alignItems: 'stretch',
    display: 'flex',
    flex: '1 1 auto',
    minHeight: 240,
    padding: 16
  },
  controls: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end'
  },
  header: {
    alignItems: 'flex-start',
    borderBottom: `1px solid ${chartTheme.surface.border}`,
    display: 'flex',
    gap: 16,
    justifyContent: 'space-between',
    padding: 16
  },
  heading: {
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.35,
    margin: 0
  },
  meta: {
    minWidth: 0
  },
  metric: {
    alignItems: 'baseline',
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 650,
    lineHeight: 1.2
  },
  statePanel: {
    alignItems: 'center',
    background: chartTheme.surface.subtleBackground,
    border: `1px dashed ${chartTheme.surface.border}`,
    borderRadius: 6,
    color: chartTheme.text.secondary,
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    gap: 8,
    justifyContent: 'center',
    padding: 24,
    textAlign: 'center'
  },
  stateText: {
    color: chartTheme.text.primary,
    fontSize: 14,
    fontWeight: 650,
    lineHeight: 1.4,
    margin: 0
  },
  subtitle: {
    color: chartTheme.text.secondary,
    fontSize: 13,
    lineHeight: 1.4,
    margin: '4px 0 0'
  },
  trend: {
    color: '#008060',
    fontSize: 13,
    fontWeight: 600,
    lineHeight: 1.3
  }
};

function ChartCardState({ errorMessage, state }: Pick<ChartCardProps, 'errorMessage' | 'state'>) {
  if (state === 'ready') {
    return null;
  }

  const isError = state === 'error';

  return (
    <div
      aria-live={isError ? 'assertive' : 'polite'}
      role={isError ? 'alert' : 'status'}
      style={styles.statePanel}
    >
      <p style={styles.stateText}>{stateCopy[state]}</p>
      {isError && errorMessage ? <div>{errorMessage}</div> : null}
    </div>
  );
}

const hasRenderableNode = (node: ReactNode) => node !== null && node !== undefined && node !== false;

export function ChartCard({
  actions,
  children,
  errorMessage,
  filters,
  metric,
  state,
  subtitle,
  title,
  trendLabel
}: ChartCardProps) {
  const titleId = useId();
  const hasControls = Boolean(actions || filters);
  const hasMetric = hasRenderableNode(metric) || hasRenderableNode(trendLabel);

  return (
    <section aria-labelledby={titleId} role="region" style={styles.card}>
      <div style={styles.header}>
        <div style={styles.meta}>
          <h3 id={titleId} style={styles.heading}>
            {title}
          </h3>
          {hasRenderableNode(subtitle) ? <p style={styles.subtitle}>{subtitle}</p> : null}
          {hasMetric ? (
            <div style={styles.metric}>
              {hasRenderableNode(metric) ? <span style={styles.metricValue}>{metric}</span> : null}
              {hasRenderableNode(trendLabel) ? <span style={styles.trend}>{trendLabel}</span> : null}
            </div>
          ) : null}
        </div>
        {hasControls ? (
          <div style={styles.controls}>
            {filters}
            {actions}
          </div>
        ) : null}
      </div>
      <div style={styles.body}>
        {state === 'ready' ? children : <ChartCardState errorMessage={errorMessage} state={state} />}
      </div>
    </section>
  );
}
