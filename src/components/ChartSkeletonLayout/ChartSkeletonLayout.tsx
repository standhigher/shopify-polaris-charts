import type { CSSProperties, ReactNode } from 'react';

import { chartTheme } from '../../theme';

export interface ChartSkeletonLayoutProps {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  columns?: number | string;
  gap?: number | string;
  style?: CSSProperties;
}

export interface ChartRevealRegionProps {
  children: ReactNode;
  className?: string;
  label: string;
  minHeight?: number;
  mode?: 'overlay' | 'replace';
  ready: boolean;
  skeleton?: ReactNode;
  style?: CSSProperties;
}

const styles: Record<string, CSSProperties> = {
  layout: {
    display: 'grid',
    gap: 16,
    width: '100%'
  },
  overlay: {
    alignItems: 'center',
    background: 'rgba(246, 246, 247, 0.88)',
    border: `1px solid ${chartTheme.surface.border}`,
    borderRadius: 8,
    color: chartTheme.text.secondary,
    display: 'flex',
    inset: 0,
    justifyContent: 'center',
    padding: 24,
    position: 'absolute',
    textAlign: 'center'
  },
  region: {
    position: 'relative'
  },
  regionSkeleton: {
    alignItems: 'center',
    background: chartTheme.surface.subtleBackground,
    border: `1px solid ${chartTheme.surface.border}`,
    borderRadius: 8,
    color: chartTheme.text.secondary,
    display: 'flex',
    justifyContent: 'center',
    minHeight: 220,
    padding: 24,
    textAlign: 'center'
  }
};

const toCssSize = (value: number | string | undefined) => (typeof value === 'number' ? `${value}px` : value);

const resolveGridTemplateColumns = (columns: number | string | undefined) => {
  if (typeof columns === 'number') {
    return `repeat(${columns}, minmax(0, 1fr))`;
  }

  return columns;
};

export function ChartSkeletonLayout({
  ariaLabel = 'Charts loading',
  children,
  className,
  columns,
  gap,
  style
}: ChartSkeletonLayoutProps) {
  return (
    <div
      aria-label={ariaLabel}
      className={className}
      role="status"
      style={{
        ...styles.layout,
        gap: toCssSize(gap) ?? styles.layout.gap,
        gridTemplateColumns: resolveGridTemplateColumns(columns),
        ...style
      }}
    >
      {children}
    </div>
  );
}

export function ChartRevealRegion({
  children,
  className,
  label,
  minHeight,
  mode = 'replace',
  ready,
  skeleton,
  style
}: ChartRevealRegionProps) {
  if (ready) {
    return (
      <div aria-busy="false" aria-label={`${label} region`} className={className} style={{ ...styles.region, ...style }}>
        {children}
      </div>
    );
  }

  const skeletonStyle = { ...styles.regionSkeleton, minHeight: toCssSize(minHeight) ?? styles.regionSkeleton.minHeight };

  if (mode === 'overlay') {
    return (
      <div
        aria-busy="true"
        aria-label={`${label} region`}
        className={className}
        style={{ ...styles.region, minHeight: toCssSize(minHeight), ...style }}
      >
        <div aria-hidden="true">{children}</div>
        <div aria-label={label} role="status" style={styles.overlay}>
          {skeleton ?? `${label} loading`}
        </div>
      </div>
    );
  }

  return (
    <div aria-label={label} className={className} role="status" style={{ ...skeletonStyle, ...style }}>
      {skeleton ?? `${label} loading`}
    </div>
  );
}
