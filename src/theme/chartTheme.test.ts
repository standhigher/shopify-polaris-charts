import { chartTheme } from './chartTheme';
import { chartTheme as exportedChartTheme } from '../index';

describe('chart theme', () => {
  it('uses a neutral Polaris-style chart surface', () => {
    expect(chartTheme.surface.background).toBe('#ffffff');
    expect(chartTheme.surface.border).toBe('#dcdfe4');
    expect(chartTheme.text.primary).toBe('#202223');
  });

  it('provides a restrained chart color palette', () => {
    expect(chartTheme.palette).toHaveLength(8);
    expect(chartTheme.palette).toEqual([
      '#2c6ecb',
      '#008060',
      '#b98900',
      '#d72c0d',
      '#5c6ac4',
      '#007ace',
      '#50b83c',
      '#9c6ade'
    ]);
  });

  it('defines default axis, grid, tooltip, and legend styles', () => {
    expect(chartTheme.axis.tickColor).toBe('#6d7175');
    expect(chartTheme.axis.lineColor).toBe('#dcdfe4');
    expect(chartTheme.grid.stroke).toBe('#ebeef2');
    expect(chartTheme.tooltip.background).toBe('#ffffff');
    expect(chartTheme.tooltip.borderRadius).toBe(8);
    expect(chartTheme.legend.textColor).toBe('#6d7175');
  });

  it('exports the theme from the package entry', () => {
    expect(exportedChartTheme).toBe(chartTheme);
  });
});
