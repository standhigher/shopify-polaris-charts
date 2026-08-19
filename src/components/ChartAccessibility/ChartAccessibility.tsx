import { Fragment, useId } from 'react';
import type { CSSProperties, ReactNode } from 'react';

import type { ChartAccessibilityOptions } from '../../types';

export interface ChartAccessibilityRegionProps {
  accessibility?: ChartAccessibilityOptions;
  children: ReactNode;
}

const visuallyHidden: CSSProperties = {
  border: 0,
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  margin: -1,
  overflow: 'hidden',
  padding: 0,
  position: 'absolute',
  whiteSpace: 'nowrap',
  width: 1
};

export function ChartAccessibilityRegion({
  accessibility,
  children
}: ChartAccessibilityRegionProps) {
  const descriptionId = useId();

  if (!accessibility) {
    return <Fragment>{children}</Fragment>;
  }

  return (
    <div
      aria-describedby={accessibility.description ? descriptionId : undefined}
      aria-label={accessibility.label}
      role="region"
      style={{ minWidth: 0, width: '100%' }}
    >
      {children}
      {accessibility.description ? (
        <div id={descriptionId} style={visuallyHidden}>{accessibility.description}</div>
      ) : null}
      {accessibility.dataTable ? <div style={visuallyHidden}>{accessibility.dataTable}</div> : null}
    </div>
  );
}
