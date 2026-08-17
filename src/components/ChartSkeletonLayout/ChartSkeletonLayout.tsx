import type { CSSProperties, ReactNode } from 'react';

import { chartTheme } from '../../theme';

export interface ChartSkeletonLayoutProps {
  ariaLabel?: string;
  children: ReactNode;
}

export interface ChartRevealRegionProps {
  children: ReactNode;
  label: string;
  ready: boolean;
  skeleton?: ReactNode;
}

const styles: Record<string, CSSProperties> = {
  layout: {
    display: 'grid',
    gap: 16,
    width: '100%'
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

export function ChartSkeletonLayout({ ariaLabel = 'Charts loading', children }: ChartSkeletonLayoutProps) {
  return (
    <div aria-label={ariaLabel} role="status" style={styles.layout}>
      {children}
    </div>
  );
}

export function ChartRevealRegion({ children, label, ready, skeleton }: ChartRevealRegionProps) {
  if (ready) {
    return <>{children}</>;
  }

  return (
    <div aria-label={label} role="status" style={styles.regionSkeleton}>
      {skeleton ?? `${label} loading`}
    </div>
  );
}
