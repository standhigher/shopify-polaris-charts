import type { ReactNode } from 'react';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import { render, waitFor } from '@testing-library/react';

import { ComboChart } from './ComboChart/ComboChart';
import { DonutChart } from './DonutChart/DonutChart';
import { StackedBarChart } from './StackedBarChart/StackedBarChart';
import { TrendChart } from './TrendChart/TrendChart';

interface RechartsMockProps {
  children?: ReactNode;
  [prop: string]: unknown;
}

const rechartsMocks = vi.hoisted(() => ({
  area: vi.fn(),
  areaChart: vi.fn(),
  bar: vi.fn(),
  barChart: vi.fn(),
  cell: vi.fn(),
  cartesianGrid: vi.fn(),
  composedChart: vi.fn(),
  line: vi.fn(),
  lineChart: vi.fn(),
  pie: vi.fn(),
  pieChart: vi.fn(),
  responsiveContainer: vi.fn(),
  tooltip: vi.fn(),
  xAxis: vi.fn(),
  yAxis: vi.fn()
}));

vi.mock('recharts', () => {
  const passthrough = (spy: (props: Record<string, unknown>) => void) =>
    function RechartsPassthrough({ children, ...props }: RechartsMockProps) {
      spy(props);
      return children;
    };

  return {
    Area: passthrough(rechartsMocks.area),
    AreaChart: passthrough(rechartsMocks.areaChart),
    Bar: passthrough(rechartsMocks.bar),
    BarChart: passthrough(rechartsMocks.barChart),
    Cell: passthrough(rechartsMocks.cell),
    CartesianGrid: passthrough(rechartsMocks.cartesianGrid),
    ComposedChart: passthrough(rechartsMocks.composedChart),
    Line: passthrough(rechartsMocks.line),
    LineChart: passthrough(rechartsMocks.lineChart),
    Pie: passthrough(rechartsMocks.pie),
    PieChart: passthrough(rechartsMocks.pieChart),
    ResponsiveContainer: passthrough(rechartsMocks.responsiveContainer),
    Tooltip: passthrough(rechartsMocks.tooltip),
    XAxis: passthrough(rechartsMocks.xAxis),
    YAxis: passthrough(rechartsMocks.yAxis)
  };
});

const trendData = [
  { date: '2026-07-01', grossSales: 12430.4 },
  { date: '2026-07-02', grossSales: 14200 }
];

const barData = [
  { channel: 'Online store', fulfilled: 184, conversionRate: 0.032 },
  { channel: 'Point of sale', fulfilled: 92, conversionRate: 0.036 }
];

describe('controlled Recharts props escape hatch', () => {
  beforeEach(() => {
    for (const mock of Object.values(rechartsMocks)) {
      mock.mockClear();
    }
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('does not allow the Recharts accessibility layer to be disabled', () => {
    render(
      <TrendChart
        data={trendData}
        rechartsProps={{ chart: { accessibilityLayer: false } } as never}
        series={[{ id: 'grossSales', label: 'Gross sales', data: trendData }]}
        xKey="date"
      />
    );

    expect(rechartsMocks.lineChart).toHaveBeenCalledWith(
      expect.objectContaining({ accessibilityLayer: true })
    );
  });

  it('disables Recharts line, area, bar, and pie animation for reduced motion', async () => {
    vi.stubGlobal('matchMedia', vi.fn(() => ({
      addEventListener: vi.fn(),
      matches: true,
      removeEventListener: vi.fn()
    })));

    render(
      <>
        <TrendChart data={trendData} rechartsProps={{ line: { isAnimationActive: true } }} series={[{ id: 'grossSales', label: 'Line', data: trendData }]} xKey="date" />
        <TrendChart data={trendData} mode="area" rechartsProps={{ area: { isAnimationActive: true } }} series={[{ id: 'grossSales', label: 'Area', data: trendData }]} xKey="date" />
        <StackedBarChart data={barData} rechartsProps={{ bar: { isAnimationActive: true } }} series={[{ id: 'fulfilled', label: 'Bar', data: barData }]} xKey="channel" />
        <DonutChart categoryKey="channel" data={barData} valueKey="fulfilled" />
      </>
    );

    await waitFor(() => {
      expect(rechartsMocks.line).toHaveBeenLastCalledWith(expect.objectContaining({ isAnimationActive: false }));
      expect(rechartsMocks.area).toHaveBeenLastCalledWith(expect.objectContaining({ isAnimationActive: false }));
      expect(rechartsMocks.bar).toHaveBeenLastCalledWith(expect.objectContaining({ isAnimationActive: false }));
      expect(rechartsMocks.pie).toHaveBeenLastCalledWith(expect.objectContaining({ isAnimationActive: false }));
    });
  });

  it('forwards TrendChart line props while retaining chart bindings', () => {
    const unsafeTooltipContent = <div>Unsafe tooltip</div>;
    const unsafeRechartsProps = {
      chart: { margin: { left: -8 }, data: [{ date: 'unsafe' }] },
      xAxis: { dataKey: 'unsafe', minTickGap: 0, stroke: '#f00', type: 'number' },
      yAxis: { type: 'category', width: 56, yAxisId: 'unsafe' },
      cartesianGrid: { syncWithTicks: true, vertical: false },
      tooltip: { axisId: 'unsafe', content: unsafeTooltipContent, cursor: { strokeDasharray: '3 3' }, offset: 16 },
      line: {
        activeDot: { r: 3 },
        dataKey: 'unsafe',
        name: 'Unsafe series',
        stroke: '#f00',
        strokeWidth: 4
      }
    } as unknown as never;

    render(
      <TrendChart
        data={trendData}
        margin={{ left: 12 }}
        rechartsProps={unsafeRechartsProps}
        series={[{ id: 'grossSales', label: 'Gross sales', data: trendData, color: '#008060' }]}
        xKey="date"
      />
    );

    expect(rechartsMocks.lineChart).toHaveBeenCalledWith(
      expect.objectContaining({ data: trendData, margin: { left: -8 } })
    );
    expect(rechartsMocks.xAxis).toHaveBeenCalledWith(expect.objectContaining({ dataKey: 'date', minTickGap: 0 }));
    expect(rechartsMocks.xAxis.mock.calls[0][0].type).toBeUndefined();
    expect(rechartsMocks.yAxis).toHaveBeenCalledWith(expect.objectContaining({ width: 56 }));
    expect(rechartsMocks.yAxis.mock.calls[0][0].type).toBeUndefined();
    expect(rechartsMocks.cartesianGrid).toHaveBeenCalledWith(
      expect.objectContaining({ syncWithTicks: true, vertical: false })
    );
    expect(rechartsMocks.tooltip).toHaveBeenCalledWith(
      expect.objectContaining({ cursor: { strokeDasharray: '3 3' }, offset: 16 })
    );
    expect(rechartsMocks.tooltip.mock.calls[0][0].content).not.toBe(unsafeTooltipContent);
    expect(rechartsMocks.tooltip.mock.calls[0][0].axisId).toBeUndefined();
    expect(rechartsMocks.line).toHaveBeenCalledWith(
      expect.objectContaining({
        activeDot: { r: 3 },
        dataKey: 'grossSales',
        name: 'Gross sales',
        stroke: '#008060',
        strokeWidth: 4,
        type: 'monotone'
      })
    );
  });

  it('preserves global line dot and activeDot precedence over TrendChart line options', () => {
    render(
      <TrendChart
        data={trendData}
        line={{ activeDot: { r: 'auto' }, dot: { show: 'isolated' } }}
        rechartsProps={{ line: { activeDot: { r: 9 }, dot: false } }}
        series={[{ id: 'grossSales', label: 'Gross sales', data: trendData }]}
        xKey="date"
      />
    );

    expect(rechartsMocks.line).toHaveBeenCalledWith(
      expect.objectContaining({ activeDot: { r: 9 }, dot: false })
    );
  });

  it('allows each TrendChart series to override global line styling', () => {
    render(
      <TrendChart
        data={trendData}
        rechartsProps={{ line: { strokeDasharray: '2 2', strokeWidth: 1 } }}
        series={[
          { id: 'grossSales', label: 'Current', data: trendData, color: '#008060' },
          {
            id: 'previousSales',
            label: 'Previous',
            data: trendData,
            color: '#6d7175',
            opacity: 0.72,
            strokeDasharray: '4 4',
            strokeWidth: 2
          }
        ]}
        xKey="date"
      />
    );

    expect(rechartsMocks.line).toHaveBeenCalledWith(
      expect.objectContaining({
        dataKey: 'grossSales',
        strokeDasharray: '2 2',
        strokeWidth: 1
      })
    );
    expect(rechartsMocks.line).toHaveBeenCalledWith(
      expect.objectContaining({
        dataKey: 'previousSales',
        opacity: 0.72,
        strokeDasharray: '4 4',
        strokeWidth: 2
      })
    );
  });

  it('forwards TrendChart area props only in area mode while retaining series color', () => {
    const unsafeRechartsProps = {
      area: {
        dataKey: 'unsafe',
        fill: '#f00',
        fillOpacity: 0.18,
        stackId: 'unsafe',
        stroke: '#f00',
        strokeWidth: 3
      },
      line: { strokeWidth: 10 }
    } as unknown as never;

    render(
      <TrendChart
        data={trendData}
        mode="area"
        rechartsProps={unsafeRechartsProps}
        series={[{ id: 'grossSales', label: 'Gross sales', data: trendData, color: '#008060' }]}
        xKey="date"
      />
    );

    expect(rechartsMocks.area).toHaveBeenCalledWith(
      expect.objectContaining({
        dataKey: 'grossSales',
        fill: '#008060',
        fillOpacity: 0.18,
        stroke: '#008060',
        strokeWidth: 3,
        type: 'monotone'
      })
    );
    expect(rechartsMocks.area.mock.calls[0][0].stackId).toBeUndefined();
    expect(rechartsMocks.line).not.toHaveBeenCalled();
  });

  it('preserves global area dot and activeDot precedence over TrendChart line options', () => {
    render(
      <TrendChart
        data={trendData}
        line={{ activeDot: { r: 'auto' }, dot: { show: 'isolated' } }}
        mode="area"
        rechartsProps={{ area: { activeDot: { r: 9 }, dot: false } }}
        series={[{ id: 'grossSales', label: 'Gross sales', data: trendData }]}
        xKey="date"
      />
    );

    expect(rechartsMocks.area).toHaveBeenCalledWith(
      expect.objectContaining({ activeDot: { r: 9 }, dot: false })
    );
  });

  it('forwards StackedBarChart props while retaining stacked bar bindings', () => {
    const unsafeRechartsProps = {
      bar: { dataKey: 'unsafe', fill: '#f00', name: 'Unsafe bar', radius: 2, stackId: 'unsafe' },
      cartesianGrid: { vertical: false },
      chart: { margin: { bottom: 14 } },
      tooltip: { cursor: false },
      xAxis: { minTickGap: 0 },
      yAxis: { width: 52 }
    } as unknown as never;

    render(
      <StackedBarChart
        data={barData}
        rechartsProps={unsafeRechartsProps}
        series={[{ id: 'fulfilled', label: 'Fulfilled', data: barData, color: '#008060' }]}
        xKey="channel"
      />
    );

    expect(rechartsMocks.barChart).toHaveBeenCalledWith(
      expect.objectContaining({ data: barData, margin: { bottom: 14 } })
    );
    expect(rechartsMocks.xAxis).toHaveBeenCalledWith(expect.objectContaining({ dataKey: 'channel', minTickGap: 0 }));
    expect(rechartsMocks.yAxis).toHaveBeenCalledWith(expect.objectContaining({ width: 52 }));
    expect(rechartsMocks.cartesianGrid).toHaveBeenCalledWith(expect.objectContaining({ vertical: false }));
    expect(rechartsMocks.tooltip).toHaveBeenCalledWith(expect.objectContaining({ cursor: false }));
    expect(rechartsMocks.bar).toHaveBeenCalledWith(
      expect.objectContaining({
        dataKey: 'fulfilled',
        fill: '#008060',
        name: 'Fulfilled',
        radius: 2,
        stackId: 'stack'
      })
    );
  });

  it('forwards ComboChart bar and line props without changing series type, axis, or formatter bindings', () => {
    const unsafeRechartsProps = {
      bar: { fill: '#f00', radius: 2, yAxisId: 'unsafe' },
      chart: { margin: { right: 20 } },
      line: { dataKey: 'unsafe', stroke: '#f00', strokeWidth: 5, type: 'step', yAxisId: 'unsafe' },
      tooltip: { cursor: { strokeDasharray: '3 3' } },
      xAxis: { minTickGap: 0 },
      yAxis: { width: 58, yAxisId: 'unsafe' }
    } as unknown as never;

    render(
      <ComboChart
        data={barData}
        rechartsProps={unsafeRechartsProps}
        series={[
          { id: 'fulfilled', label: 'Fulfilled', data: barData, type: 'bar', color: '#008060' },
          {
            id: 'conversionRate',
            label: 'Conversion rate',
            data: barData,
            type: 'line',
            color: '#2c6ecb',
            format: 'percent'
          }
        ]}
        xKey="channel"
      />
    );

    expect(rechartsMocks.composedChart).toHaveBeenCalledWith(
      expect.objectContaining({ data: barData, margin: { right: 20 } })
    );
    expect(rechartsMocks.xAxis).toHaveBeenCalledWith(expect.objectContaining({ dataKey: 'channel', minTickGap: 0 }));
    expect(rechartsMocks.yAxis).toHaveBeenCalledWith(expect.objectContaining({ width: 58, yAxisId: 'left' }));
    expect(rechartsMocks.yAxis).toHaveBeenCalledWith(expect.objectContaining({ width: 58, yAxisId: 'right' }));
    expect(rechartsMocks.tooltip).toHaveBeenCalledWith(
      expect.objectContaining({ cursor: { strokeDasharray: '3 3' } })
    );
    expect(rechartsMocks.bar).toHaveBeenCalledWith(
      expect.objectContaining({ dataKey: 'fulfilled', fill: '#008060', radius: 2, yAxisId: 'left' })
    );
    expect(rechartsMocks.line).toHaveBeenCalledWith(
      expect.objectContaining({
        dataKey: 'conversionRate',
        stroke: '#2c6ecb',
        strokeWidth: 5,
        type: 'monotone',
        yAxisId: 'right'
      })
    );
  });
});
