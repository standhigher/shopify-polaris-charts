import { Curve } from 'recharts';
import type { LineDrawShapeProps } from 'recharts';
import type { ReactElement } from 'react';

/**
 * A point used to build the smooth curve. `sourceIndex` is the point's index
 * in the source data row list; a jump larger than 1 between consecutive
 * points marks a data gap where the path must be broken.
 */
export interface SmoothCurvePoint {
  x: number;
  y: number;
  sourceIndex: number;
}

const sign = (x: number): number => (x < 0 ? -1 : 1);

/**
 * Builds an SVG path for a monotone (d3 `curveMonotoneX`) line that is fit
 * over the FULL point set, so tangents flow across data gaps, but is split
 * into separate subpaths at every gap (`sourceIndex` jump). The visible
 * segments therefore follow the exact same curve as a continuous
 * `connectNulls` line, while the break at missing data is preserved.
 *
 * The generator is a faithful port of d3-shape's `curveMonotoneX` so the
 * output coincides with Recharts' native monotone rendering.
 */
export function buildBrokenSmoothPath(points: readonly SmoothCurvePoint[]): string {
  if (points.length === 0) {
    return '';
  }

  let commands = '';
  let x0 = Number.NaN;
  let y0 = Number.NaN;
  let x1 = Number.NaN;
  let y1 = Number.NaN;
  let t0 = Number.NaN;
  let i0 = -1;
  let i1 = -1;
  let pointCount = 0;

  const slope3 = (x2: number, y2: number): number => {
    const h0 = x1 - x0;
    const h1 = x2 - x1;
    const s0 = (y1 - y0) / (h0 || (h1 < 0 ? -0 : 0));
    const s1 = (y2 - y1) / (h1 || (h0 < 0 ? -0 : 0));
    const p = (s0 * h1 + s1 * h0) / (h0 + h1);

    return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
  };

  const slope2 = (t: number): number => {
    const h = x1 - x0;

    return h ? (3 * (y1 - y0) / h - t) / 2 : t;
  };

  const emitPendingSegment = (startTangent: number, endTangent: number): void => {
    if (i1 > i0 + 1) {
      commands += `M${x1},${y1}`;

      return;
    }

    const dx = (x1 - x0) / 3;

    commands +=
      `C${x0 + dx},${y0 + dx * startTangent},${x1 - dx},${y1 - dx * endTangent},${x1},${y1}`;
  };

  for (const point of points) {
    const x = +point.x;
    const y = +point.y;

    if (x === x1 && y === y1) {
      continue;
    }

    const index = point.sourceIndex;
    let t1 = Number.NaN;

    if (pointCount === 0) {
      pointCount = 1;
      commands += `M${x},${y}`;
    } else if (pointCount === 1) {
      pointCount = 2;
    } else if (pointCount === 2) {
      pointCount = 3;
      t1 = slope3(x, y);
      emitPendingSegment(slope2(t1), t1);
    } else {
      t1 = slope3(x, y);
      emitPendingSegment(t0, t1);
    }

    x0 = x1;
    y0 = y1;
    i0 = i1;
    x1 = x;
    y1 = y;
    i1 = index;
    t0 = t1;
  }

  if (pointCount === 2) {
    if (i1 > i0 + 1) {
      commands += `M${x1},${y1}`;
    } else {
      commands += `L${x1},${y1}`;
    }
  } else if (pointCount === 3) {
    emitPendingSegment(t0, slope2(t0));
  }

  return commands;
}

/**
 * Reads the total length of an SVG path element, returning 0 if the element
 * is null or the measurement fails (e.g. in JSDOM).
 */
function getTotalLength(path: SVGPathElement | null): number {
  try {
    return (path && path.getTotalLength && path.getTotalLength()) || 0;
  } catch {
    return 0;
  }
}

/**
 * Computes the stroke-dasharray for a line's entrance draw-in animation:
 * reveals exactly `visibleLength` pixels of the path. Mirrors Recharts'
 * `LineDrawShape` behavior for the common (non-custom-dash) case.
 */
function computeAnimatedStrokeDasharray(totalLength: number, visibleLength: number): string {
  return `${visibleLength}px ${totalLength}px`;
}

/**
 * Recharts `Line` `shape` that draws the smooth full-data monotone curve but
 * breaks it into subpaths at data gaps. Used so the visible segments of a
 * broken line coincide exactly with the continuous `connectNulls` overlay
 * underneath, instead of falling back to straight two-point segments.
 *
 * The native entrance draw-in animation is replicated through the animated
 * stroke-dasharray so gapped lines animate like ordinary lines.
 */
export function brokenSmoothLineShape(props: LineDrawShapeProps): ReactElement | null {
  const points = props.points ?? [];
  const smoothPoints: SmoothCurvePoint[] = [];

  points.forEach((point, index) => {
    if (point !== null && point !== undefined && Number.isFinite(point.x) && Number.isFinite(point.y)) {
      smoothPoints.push({ x: point.x as number, y: point.y as number, sourceIndex: index });
    }
  });

  const d = buildBrokenSmoothPath(smoothPoints);
  let strokeDasharray: string | number | undefined = props.strokeDasharray;

  if (props.visibleLength != null) {
    const totalLength = getTotalLength(props.pathRef?.current ?? null);

    strokeDasharray = computeAnimatedStrokeDasharray(totalLength, props.visibleLength);
  }

  return <Curve {...props} points={[]} path={d} strokeDasharray={strokeDasharray} />;
}
