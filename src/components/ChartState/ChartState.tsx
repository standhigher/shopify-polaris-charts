import { useEffect, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import { chartTheme } from '../../theme';
import type { ChartContentState, ChartRevealOptions, ChartSkeletonOptions } from '../../types';
import { useChartLocalization } from '../ChartLocalization';

export interface ChartStateRegionProps {
  children: ReactNode;
  emptyMessage?: ReactNode;
  errorMessage?: ReactNode;
  loadingLabel?: ReactNode;
  minHeight?: number;
  onRetry?: () => void;
  reveal?: boolean | ChartRevealOptions;
  retryAction?: ReactNode;
  retryLabel?: ReactNode;
  skeleton?: boolean | ChartSkeletonOptions;
  state?: ChartContentState;
}

const styles: Record<string, CSSProperties> = {
  action: {
    background: chartTheme.text.primary, border: 0, borderRadius: 6, color: '#ffffff', cursor: 'pointer', fontSize: 13,
    fontWeight: 650, padding: '8px 12px'
  },
  empty: {
    alignItems: 'center', background: chartTheme.surface.subtleBackground, border: `1px dashed ${chartTheme.surface.border}`,
    borderRadius: 6, color: chartTheme.text.secondary, display: 'flex', justifyContent: 'center', padding: 24, textAlign: 'center'
  },
  error: {
    alignItems: 'center', background: chartTheme.surface.subtleBackground, border: `1px solid ${chartTheme.surface.border}`,
    borderRadius: 6, color: chartTheme.text.primary, display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center',
    padding: 24, textAlign: 'center'
  },
  errorMessage: { color: chartTheme.text.secondary, fontSize: 13, lineHeight: 1.45, margin: 0 },
  errorTitle: { fontSize: 14, fontWeight: 650, margin: 0 },
  overlay: {
    alignItems: 'center', background: 'rgba(255, 255, 255, 0.82)', borderRadius: 6, color: chartTheme.text.secondary,
    display: 'flex', fontSize: 13, inset: 0, justifyContent: 'center', position: 'absolute'
  },
  ready: { position: 'relative' },
  skeleton: {
    background: chartTheme.surface.subtleBackground, border: `1px solid ${chartTheme.surface.border}`, borderRadius: 6,
    display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center', overflow: 'hidden', padding: 24
  },
  skeletonLabel: { color: chartTheme.text.secondary, fontSize: 13 },
  skeletonLine: {
    background: `linear-gradient(90deg, ${chartTheme.surface.border}, rgba(255, 255, 255, 0.9), ${chartTheme.surface.border})`,
    borderRadius: 999, height: 8, width: '100%'
  }
};

const normalizeRevealOptions = (reveal: boolean | ChartRevealOptions | undefined) =>
  typeof reveal === 'object' ? reveal : { active: reveal };

const normalizeSkeletonOptions = (skeleton: boolean | ChartSkeletonOptions | undefined) =>
  typeof skeleton === 'object' ? skeleton : {};

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');

    if (!mediaQuery) {
      return undefined;
    }

    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener?.('change', update);

    return () => mediaQuery.removeEventListener?.('change', update);
  }, []);

  return prefersReducedMotion;
}

export function ChartStateRegion({
  children,
  emptyMessage,
  errorMessage,
  loadingLabel,
  minHeight,
  onRetry,
  reveal,
  retryAction,
  retryLabel,
  skeleton,
  state = 'ready'
}: ChartStateRegionProps) {
  const { messages } = useChartLocalization();
  const revealOptions = normalizeRevealOptions(reveal);
  const skeletonOptions = normalizeSkeletonOptions(skeleton);
  const prefersReducedMotion = usePrefersReducedMotion();
  const isRevealActive = Boolean(revealOptions.active);
  const [isOverlayMounted, setIsOverlayMounted] = useState(isRevealActive);
  const [isOverlayVisible, setIsOverlayVisible] = useState(isRevealActive);

  useEffect(() => {
    if (isRevealActive) {
      const frame = requestAnimationFrame(() => {
        setIsOverlayMounted(true);
        setIsOverlayVisible(true);
      });

      return () => cancelAnimationFrame(frame);
    }

    const frame = requestAnimationFrame(() => {
      setIsOverlayVisible(false);

      if (prefersReducedMotion) {
        setIsOverlayMounted(false);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [isRevealActive, prefersReducedMotion]);

  const panelStyle = { minHeight, width: '100%' };

  if (state === 'loading') {
    const lineCount = skeletonOptions.lineCount ?? 3;

    return (
      <div aria-busy="true" role="status" style={{ ...styles.skeleton, ...panelStyle }}>
        <span style={styles.skeletonLabel}>{skeletonOptions.label ?? loadingLabel ?? messages.chartLoading}</span>
        {skeleton !== false
          ? Array.from({ length: lineCount }).map((_, index) => (
              <span
                aria-hidden="true"
                data-testid="chart-state-skeleton-line"
                key={index}
                style={{ ...styles.skeletonLine, width: `${100 - index * 14}%` }}
              />
            ))
          : null}
      </div>
    );
  }

  if (state === 'error') {
    return (
      <div aria-live="assertive" role="alert" style={{ ...styles.error, ...panelStyle }}>
        <p style={styles.errorTitle}>{messages.chartError}</p>
        {errorMessage ? <p style={styles.errorMessage}>{errorMessage}</p> : null}
        {retryAction ?? (onRetry ? (
          <button onClick={onRetry} style={styles.action} type="button">
            {retryLabel ?? messages.retry}
          </button>
        ) : null)}
      </div>
    );
  }

  if (state === 'empty') {
    return (
      <div role="status" style={{ ...styles.empty, ...panelStyle }}>
        {emptyMessage ?? messages.chartEmpty}
      </div>
    );
  }

  return (
    <div aria-busy={isOverlayMounted ? 'true' : 'false'} style={styles.ready}>
      {children}
      {isOverlayMounted ? (
        <div
          onTransitionEnd={() => {
            if (!isOverlayVisible) {
              setIsOverlayMounted(false);
            }
          }}
          role="status"
          style={{
            ...styles.overlay,
            opacity: isOverlayVisible ? 1 : 0,
            pointerEvents: isOverlayVisible ? 'auto' : 'none',
            transition: prefersReducedMotion ? 'none' : `opacity ${revealOptions.durationMs ?? 180}ms ease ${revealOptions.delayMs ?? 0}ms`
          }}
        >
          {revealOptions.label ?? messages.chartPreparing}
        </div>
      ) : null}
    </div>
  );
}
