import { useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { chartTheme } from '../../theme';
import { useChartLocalization } from '../ChartLocalization';

export type MetricCardState = 'loading' | 'ready';
export type MetricTrendDirection = 'down' | 'neutral' | 'up';
export type MetricTrendTone = 'negative' | 'neutral' | 'positive';

export interface MetricCardTrend {
  accessibilityLabel?: string;
  direction: MetricTrendDirection;
  tone?: MetricTrendTone;
  value: ReactNode;
}

export interface MetricCardProps {
  comparison?: ReactNode;
  loadingLabel?: ReactNode;
  state?: MetricCardState;
  title: ReactNode;
  trend?: MetricCardTrend;
  value: ReactNode;
}

const styles: Record<string, CSSProperties> = {
  card: {
    background: chartTheme.surface.background, border: `1px solid ${chartTheme.surface.border}`, borderRadius: 8,
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.05)', color: chartTheme.text.primary, fontFamily:
      '-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif', padding: 16
  },
  comparison: { color: chartTheme.text.secondary, fontSize: 12, lineHeight: 1.35, margin: '8px 0 0' },
  skeleton: { display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 },
  skeletonLine: { background: chartTheme.surface.subtleBackground, borderRadius: 999, height: 10 },
  title: { color: chartTheme.text.secondary, fontSize: 13, fontWeight: 600, lineHeight: 1.35, margin: 0 },
  trend: { alignItems: 'center', display: 'inline-flex', fontSize: 13, fontWeight: 650, gap: 4, lineHeight: 1.3 },
  value: { fontSize: 24, fontWeight: 650, lineHeight: 1.2, margin: '8px 0 0' },
  valueRow: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: 8 }
};

const visuallyHidden: CSSProperties = {
  clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)', height: 1, margin: -1, overflow: 'hidden', position: 'absolute',
  whiteSpace: 'nowrap', width: 1
};

const directionCopy: Record<MetricTrendDirection, string> = {
  down: 'Decreased', neutral: 'Unchanged', up: 'Increased'
};

const directionGlyph: Record<MetricTrendDirection, string> = {
  down: '↓', neutral: '→', up: '↑'
};

const resolveTone = (trend: MetricCardTrend): MetricTrendTone =>
  trend.tone ?? (trend.direction === 'up' ? 'positive' : trend.direction === 'down' ? 'negative' : 'neutral');

export function MetricCard({ comparison, loadingLabel, state = 'ready', title, trend, value }: MetricCardProps) {
  const titleId = useId();
  const { messages } = useChartLocalization();

  return (
    <section aria-busy={state === 'loading' ? 'true' : 'false'} aria-labelledby={titleId} role="region" style={styles.card}>
      <h3 id={titleId} style={styles.title}>{title}</h3>
      {state === 'loading' ? (
        <div aria-label={String(loadingLabel ?? messages.metricLoading)} role="status" style={styles.skeleton}>
          <span aria-hidden="true" data-testid="metric-card-skeleton-value" style={{ ...styles.skeletonLine, height: 26, width: '58%' }} />
          <span aria-hidden="true" data-testid="metric-card-skeleton-comparison" style={{ ...styles.skeletonLine, width: '76%' }} />
        </div>
      ) : (
        <>
          <div style={styles.valueRow}>
            <p style={styles.value}>{value}</p>
            {trend ? (
              <span style={{ ...styles.trend, color: chartTheme.status[resolveTone(trend)] }}>
                <span aria-hidden="true">{directionGlyph[trend.direction]}</span>
                <span style={visuallyHidden}>{trend.accessibilityLabel ?? directionCopy[trend.direction]}</span>
                <span>{trend.value}</span>
              </span>
            ) : null}
          </div>
          {comparison ? <p style={styles.comparison}>{comparison}</p> : null}
        </>
      )}
    </section>
  );
}
