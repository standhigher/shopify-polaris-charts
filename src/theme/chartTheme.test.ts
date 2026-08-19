import { chartTheme } from './chartTheme';
import { chartTheme as exportedChartTheme } from '../index';

const relativeLuminance = (color: string) => {
  const channels = color.slice(1).match(/.{2}/g)?.map((channel) => Number.parseInt(channel, 16) / 255) ?? [];
  const [red, green, blue] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

const contrastRatio = (first: string, second: string) => {
  const firstLuminance = relativeLuminance(first);
  const secondLuminance = relativeLuminance(second);
  const lighter = Math.max(firstLuminance, secondLuminance);
  const darker = Math.min(firstLuminance, secondLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

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
      '#409c32',
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

  it('meets text and meaningful graphical contrast thresholds', () => {
    expect(contrastRatio(chartTheme.text.primary, chartTheme.surface.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(chartTheme.text.secondary, chartTheme.surface.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(chartTheme.tooltip.textColor, chartTheme.tooltip.background)).toBeGreaterThanOrEqual(4.5);

    for (const color of [...chartTheme.palette, ...Object.values(chartTheme.status)]) {
      expect(contrastRatio(color, chartTheme.surface.background)).toBeGreaterThanOrEqual(3);
    }
  });
});
