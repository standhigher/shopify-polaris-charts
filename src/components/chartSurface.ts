import type { MouseEvent } from 'react';

export const CHART_SURFACE_CLASS_NAME = 'standhigher-chart-surface';

export function preventChartMouseFocus(event: MouseEvent<HTMLElement>) {
  event.preventDefault();

  const activeElement = document.activeElement;

  if (
    activeElement &&
    event.currentTarget.contains(activeElement) &&
    typeof (activeElement as HTMLElement).blur === 'function'
  ) {
    (activeElement as HTMLElement).blur();
  }
}

export const chartSurfaceProps = {
  className: CHART_SURFACE_CLASS_NAME,
  onMouseDown: preventChartMouseFocus
};
