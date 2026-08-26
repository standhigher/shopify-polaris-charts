import { describe, expect, it } from 'vitest';

import { buildBrokenSmoothPath, type SmoothCurvePoint } from './smoothCurvePath';

const point = (x: number, y: number, sourceIndex: number): SmoothCurvePoint => ({
  x,
  y,
  sourceIndex
});

describe('buildBrokenSmoothPath', () => {
  it('returns an empty path for no points', () => {
    expect(buildBrokenSmoothPath([])).toBe('');
  });

  it('moves to a single point without drawing a line', () => {
    expect(buildBrokenSmoothPath([point(10, 20, 0)])).toBe('M10,20');
  });

  it('connects two adjacent points with a straight line', () => {
    expect(buildBrokenSmoothPath([point(10, 20, 0), point(40, 50, 1)])).toBe('M10,20L40,50');
  });

  it('splits two points separated by a gap into separate subpaths', () => {
    expect(buildBrokenSmoothPath([point(10, 20, 0), point(40, 50, 3)])).toBe('M10,20M40,50');
  });

  it('draws a smooth cubic through three consecutive points', () => {
    const d = buildBrokenSmoothPath([point(0, 0, 0), point(2, 4, 1), point(4, 2, 2)]);

    expect(d).toMatch(/^M0,0C/);
    expect(d).toContain('4,2');
    expect(d).not.toContain('L');
  });

  it('keeps full-set tangents while splitting at gaps so a two-point subpath curves', () => {
    // (0,0) and (2,4) sit on opposite sides of a gap. The visible subpath
    // (2,4) -> (4,2) must still be a curve because its tangent is computed
    // from the full point set (including (0,0) across the gap), not a
    // straight two-point line.
    const d = buildBrokenSmoothPath([point(0, 0, 0), point(2, 4, 2), point(4, 2, 3)]);

    expect(d).toMatch(/^M0,0M2,4C/);
    expect(d).not.toContain('L');
    expect(d).toMatch(/^M0,0M2,4C\d+(?:\.\d+)?,4,\d+(?:\.\d+)?,\d+(?:\.\d+)?,\d+(?:\.\d+)?,2$/);
  });

  it('does not mutate the input points', () => {
    const points = [point(0, 0, 0), point(2, 4, 2), point(4, 2, 3)];
    const snapshot = points.map((p) => ({ ...p }));

    buildBrokenSmoothPath(points);

    expect(points).toEqual(snapshot);
  });
});
