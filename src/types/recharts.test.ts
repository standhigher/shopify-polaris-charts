import type {
  ComboChartRechartsProps,
  StackedBarChartRechartsProps,
  TrendChartRechartsProps
} from './recharts';

describe('controlled Recharts props types', () => {
  it('allows visual props while excluding component-owned bindings', () => {
    const trendProps: TrendChartRechartsProps = {
      area: { fillOpacity: 0.18 },
      chart: { margin: { left: -8 } },
      line: { activeDot: { r: 3 }, strokeDasharray: '3 3' },
      tooltip: { cursor: { strokeDasharray: '3 3' } },
      xAxis: { minTickGap: 0 },
      yAxis: { width: 56 }
    };
    const stackedBarProps: StackedBarChartRechartsProps = { bar: { radius: 2 } };
    const comboProps: ComboChartRechartsProps = { bar: { radius: 2 }, line: { strokeWidth: 3 } };

    expect(trendProps.chart?.margin?.left).toBe(-8);
    expect(stackedBarProps.bar?.radius).toBe(2);
    expect(comboProps.line?.strokeWidth).toBe(3);
  });

  it('does not expose component-owned chart, series, axis, or tooltip bindings', () => {
    const chartProps: TrendChartRechartsProps = {
      // @ts-expect-error Chart data is controlled by TrendChart.
      chart: { data: [] }
    };
    const axisProps: TrendChartRechartsProps = {
      // @ts-expect-error Axis data key is controlled by TrendChart.
      xAxis: { dataKey: 'unsafe' }
    };
    const axisTypeProps: TrendChartRechartsProps = {
      // @ts-expect-error Axis type is controlled by TrendChart.
      yAxis: { type: 'category' }
    };
    const seriesProps: ComboChartRechartsProps = {
      // @ts-expect-error Series color is controlled by ComboChart.
      line: { stroke: '#f00' }
    };
    const areaProps: TrendChartRechartsProps = {
      // @ts-expect-error Area stacking is controlled by TrendChart.
      area: { stackId: 'unsafe' }
    };
    const tooltipProps: StackedBarChartRechartsProps = {
      // @ts-expect-error Tooltip content is intentionally not customizable here.
      tooltip: { content: () => null }
    };
    const tooltipAxisProps: ComboChartRechartsProps = {
      // @ts-expect-error Tooltip axis binding is controlled by ComboChart.
      tooltip: { axisId: 'unsafe' }
    };

    expect(chartProps).toBeDefined();
    expect(axisProps).toBeDefined();
    expect(axisTypeProps).toBeDefined();
    expect(seriesProps).toBeDefined();
    expect(areaProps).toBeDefined();
    expect(tooltipProps).toBeDefined();
    expect(tooltipAxisProps).toBeDefined();
  });
});
