import { act, createEvent, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { TrendChart } from './TrendChart';

const revenueData = [
  { date: '2026-07-01', grossSales: 12430.4, orders: 138 },
  { date: '2026-07-02', grossSales: 14200, orders: 156 },
  { date: '2026-07-03', grossSales: 15890.75, orders: 171 }
];

const activateTooltip = (container: HTMLElement, clientX = 320) => {
  const chart = container.querySelector('.recharts-wrapper');

  if (!chart) {
    throw new Error('Expected the Recharts chart wrapper to render');
  }

  fireEvent.mouseMove(chart, { clientX, clientY: 120 });
};

describe('TrendChart', () => {
  it('prevents mouse clicks from taking chart focus while preserving keyboard focusability', () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        series={[{ data: revenueData, id: 'grossSales', label: 'Gross sales' }]}
        xKey="date"
      />
    );
    const chartSurface = container.querySelector('.recharts-wrapper');
    const svgSurface = container.querySelector('svg.recharts-surface');

    expect(chartSurface).toBeInTheDocument();
    expect(svgSurface).toHaveAttribute('tabindex', '0');

    const mouseDown = createEvent.mouseDown(chartSurface as HTMLElement);

    act(() => {
      fireEvent(chartSurface as HTMLElement, mouseDown);
    });

    expect(mouseDown.defaultPrevented).toBe(true);
    expect(document.activeElement).not.toBe(svgSurface);

    act(() => {
      (svgSurface as SVGSVGElement).focus();
    });
    expect(document.activeElement).toBe(svgSurface);
  });

  it('renders one dashed overlay per gapped series plus the solid line without mutating input data', () => {
    const data = [
      { date: '2026-08-01', value: 1 },
      { date: '2026-08-02', value: null },
      { date: '2026-08-03', value: 3 },
      { date: '2026-08-04', value: null },
      { date: '2026-08-05', value: null },
      { date: '2026-08-06', value: 8 }
    ];
    const originalData = data.map((datum) => ({ ...datum }));

    const { container } = render(
      <TrendChart
        data={data}
        line={{ dot: { r: 'auto', show: 'isolated' } }}
        series={[
          {
            color: '#008060',
            connectGaps: { opacity: 0.4, strokeDasharray: '2 3', strokeWidth: 3 },
            data,
            id: 'value',
            label: 'Value'
          }
        ]}
        xKey="date"
      />
    );

    expect(data).toEqual(originalData);
    expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(2);
    const dots = [...container.querySelectorAll('.recharts-line-dots .recharts-dot')];

    expect(dots).toHaveLength(3);
    expect(dots.every((dot) => dot.getAttribute('r') === '2')).toBe(true);
    expect(dots.every((dot) => dot.getAttribute('fill') === '#008060')).toBe(true);
    expect(dots.every((dot) => dot.getAttribute('stroke') === '#008060')).toBe(true);
    expect(dots.every((dot) => dot.getAttribute('stroke-width') === '0')).toBe(true);
  });

  it('draws a single full-length dashed overlay below the solid line per gapped series', () => {
    const data = [
      { date: '2026-08-01', value: 1 },
      { date: '2026-08-02', value: null },
      { date: '2026-08-03', value: 3 },
      { date: '2026-08-04', value: null },
      { date: '2026-08-05', value: null },
      { date: '2026-08-06', value: 8 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        rechartsProps={{ line: { isAnimationActive: false } }}
        series={[{ connectGaps: true, data, id: 'value', label: 'Value' }]}
        xKey="date"
      />
    );

    const paths = [...container.querySelectorAll('.recharts-line-curve')];

    expect(paths).toHaveLength(2);
    const [overlay, solid] = paths;

    expect(overlay).toHaveAttribute('stroke-dasharray', '5 5');
    expect(overlay).toHaveAttribute('stroke', solid.getAttribute('stroke'));
    expect(overlay).toHaveAttribute('stroke-width', '2');
    expect(overlay).toHaveAttribute('opacity', '1');
    expect(solid).not.toHaveAttribute('stroke-dasharray', /\S+/);

    const overlayPath = overlay.getAttribute('d') ?? '';
    const solidPath = solid.getAttribute('d') ?? '';

    expect(overlayPath).toContain('M');
    expect(solidPath).toContain('M');
    expect(overlayPath).not.toContain('Z');
    // The solid line is broken into one subpath per valid run.
    expect(solidPath.match(/M/g) ?? []).toHaveLength(3);
    expect(solidPath).not.toContain('Z');
  });

  it('keeps solid segments on the same smooth curve as the dashed overlay', () => {
    const data = [
      { date: '2026-08-01', value: 1 },
      { date: '2026-08-02', value: null },
      { date: '2026-08-03', value: 3 },
      { date: '2026-08-04', value: 4 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        rechartsProps={{ line: { isAnimationActive: false } }}
        series={[{ connectGaps: true, data, id: 'value', label: 'Value' }]}
        xKey="date"
      />
    );

    const paths = [...container.querySelectorAll('.recharts-line-curve')];
    const [overlay, solid] = paths;
    const overlayPath = overlay.getAttribute('d') ?? '';
    const solidPath = solid.getAttribute('d') ?? '';
    const solidSubpaths = solidPath.split('M').filter(Boolean);

    expect(solidSubpaths).toHaveLength(2);
    expect(overlayPath).not.toContain('Z');

    for (const subpath of solidSubpaths) {
      expect(overlayPath).toContain(subpath.replace(/^M/, ''));
    }
  });

  it('renders one dashed overlay per series when multiple series have gaps', () => {
    const data = [
      { date: '2026-08-01', current: 1, previous: 10 },
      { date: '2026-08-02', current: null, previous: null },
      { date: '2026-08-03', current: 3, previous: 8 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        rechartsProps={{ line: { isAnimationActive: false } }}
        series={[
          { connectGaps: true, data, id: 'current', label: 'Current' },
          { connectGaps: true, data, id: 'previous', label: 'Previous' }
        ]}
        xKey="date"
      />
    );

    expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(4);
    expect(container.querySelectorAll('path.recharts-line-curve[stroke-dasharray]')).toHaveLength(2);
  });

  it('keeps the dashed overlay off when breakpoint connection is disabled', () => {
    const data = [
      { date: '2026-08-01', value: 1 },
      { date: '2026-08-02', value: null },
      { date: '2026-08-03', value: 3 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        rechartsProps={{ line: { isAnimationActive: false } }}
        series={[{ data, id: 'value', label: 'Value' }]}
        xKey="date"
      />
    );

    expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(1);
    expect(container.querySelector('path.recharts-line-curve[stroke-dasharray]')).not.toBeInTheDocument();
  });

  it('keeps the dashed overlay off for a continuous series without breakpoints', () => {
    const data = [
      { date: '2026-08-01', value: 1 },
      { date: '2026-08-02', value: 2 },
      { date: '2026-08-03', value: 3 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        rechartsProps={{ line: { isAnimationActive: false } }}
        series={[{ connectGaps: true, data, id: 'value', label: 'Value' }]}
        xKey="date"
      />
    );

    expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(1);
    expect(container.querySelector('path.recharts-line-curve[stroke-dasharray]')).not.toBeInTheDocument();
  });

  it('normalizes empty strings, undefined values, and NaN before gap analysis', () => {
    const data = [
      { date: '2026-08-01', value: 1 },
      { date: '2026-08-02', value: '' },
      { date: '2026-08-03', value: Number.NaN },
      { date: '2026-08-04', value: undefined },
      { date: '2026-08-05', value: 5 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        series={[{ connectGaps: true, data, id: 'value', label: 'Value' }]}
        xKey="date"
      />
    );

    expect(data[2].value).toBeNaN();
    expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(2);
    expect(container.querySelector('.recharts-line-curve')?.getAttribute('d')).not.toContain('NaN');
  });

  it('renders configured bridge styling before the real line', () => {
    const data = [
      { date: '2026-08-01', value: 1 },
      { date: '2026-08-02', value: 2 },
      { date: '2026-08-03', value: null },
      { date: '2026-08-04', value: 4 },
      { date: '2026-08-05', value: 5 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        line={{ dot: true, activeDot: true }}
        rechartsProps={{ line: { connectNulls: true, isAnimationActive: false } as never }}
        series={[
          {
            color: '#008060',
            connectGaps: { color: '#ff0000', opacity: 0.4, strokeDasharray: '2 3', strokeWidth: 4 },
            data,
            id: 'value',
            label: 'Value',
            strokeWidth: 6
          }
        ]}
        xKey="date"
      />
    );

    const paths = [...container.querySelectorAll('.recharts-line-curve')];

    expect(paths).toHaveLength(2);
    expect(paths[0]).toHaveAttribute('stroke', '#ff0000');
    expect(paths[0]).toHaveAttribute('stroke-dasharray', '2 3');
    expect(paths[0]).toHaveAttribute('stroke-width', '4');
    expect(paths[0]).toHaveAttribute('opacity', '0.4');
    expect(paths[1]).toHaveAttribute('stroke', '#008060');
    expect(paths[1]).toHaveAttribute('stroke-width', '6');
    expect(paths[1].getAttribute('d')).toContain('M');
  });

  it('keeps non-gap extrema in the Y-axis domain when rendering a connector', () => {
    const data = [
      { date: '2026-08-01', value: 1 },
      { date: '2026-08-02', value: null },
      { date: '2026-08-03', value: 3 },
      { date: '2026-08-04', value: 1000 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        series={[{ connectGaps: true, data, id: 'value', label: 'Value' }]}
        xKey="date"
      />
    );

    const paths = [...container.querySelectorAll('.recharts-line-curve')];
    const realLinePath = paths[paths.length - 1]?.getAttribute('d') ?? '';
    const yCoordinates = [...realLinePath.matchAll(/,(-?\d+(?:\.\d+)?)/g)].map((match) => Number(match[1]));

    expect(paths).toHaveLength(2);
    expect(Math.min(...yCoordinates)).toBeGreaterThanOrEqual(0);
    expect(Math.min(...yCoordinates)).toBeLessThanOrEqual(10);
  });

  it('filters gap connectors from custom tooltip payloads', async () => {
    const data = [
      { date: '2026-08-01', value: 1 },
      { date: '2026-08-02', value: null },
      { date: '2026-08-03', value: 3 },
      { date: '2026-08-04', value: 4 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        series={[{ connectGaps: true, data, id: 'value', label: 'Value' }]}
        tooltip={{
          content: ({ payload }) => (
            <div data-testid="gap-tooltip-payload">
              {payload?.map((item) => item.dataKey).join(',')}
            </div>
          )
        }}
        xKey="date"
      />
    );

    activateTooltip(container, 65);

    const payload = await screen.findByTestId('gap-tooltip-payload');

    expect(payload).toHaveTextContent('value');
    expect(payload).not.toHaveTextContent('__standhigher_gap__');
  });

  it('keeps area mode free of gap connectors and line-only dot semantics', () => {
    const data = [
      { date: '2026-08-01', value: 1 },
      { date: '2026-08-02', value: null },
      { date: '2026-08-03', value: 3 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        line={{ dot: { r: 'auto', show: 'isolated' } }}
        mode="area"
        series={[{ connectGaps: true, data, id: 'value', label: 'Value' }]}
        xKey="date"
      />
    );

    expect(container.querySelectorAll('.recharts-area-curve')).toHaveLength(1);
    expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(0);
    expect([...container.querySelectorAll('.recharts-dot')].every((dot) => dot.getAttribute('r') !== 'auto')).toBe(true);
  });

  it('does not render gap connectors or dots for an empty series', () => {
    const data = [
      { date: '2026-08-01', value: null },
      { date: '2026-08-02', value: '' },
      { date: '2026-08-03', value: undefined }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        line={{ dot: { show: 'isolated' } }}
        series={[{ connectGaps: true, data, id: 'value', label: 'Value' }]}
        xKey="date"
      />
    );

    expect(screen.getByText('No data available')).toBeVisible();
    expect(container.querySelectorAll('.recharts-line-curve')).toHaveLength(0);
    expect(container.querySelectorAll('.recharts-dot')).toHaveLength(0);
  });

  it('treats all NaN values as empty without showing NaN in the legend', () => {
    const data = [
      { date: '2026-08-01', value: Number.NaN },
      { date: '2026-08-02', value: Number.NaN }
    ];

    render(
      <TrendChart
        data={data}
        format="currency"
        series={[{ data, id: 'value', label: 'Value' }]}
        xKey="date"
      />
    );

    expect(screen.getByText('No data available')).toBeVisible();
    expect(screen.queryByText('NaN')).not.toBeInTheDocument();
  });

  it('keeps zero as valid data when checking empty state', () => {
    const data = [{ date: '2026-08-01', value: 0 }];

    render(
      <TrendChart
        data={data}
        series={[{ data, id: 'value', label: 'Value' }]}
        xKey="date"
      />
    );

    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Chart legend')).toHaveTextContent('0');
  });

  it('renders line chart title, legend labels, and formatted values', () => {
    render(
      <TrendChart
        title="Shopify revenue trend"
        data={revenueData}
        xKey="date"
        series={[
          { id: 'grossSales', label: 'Gross sales', data: revenueData },
          { id: 'orders', label: 'Orders', data: revenueData }
        ]}
        format="currency"
        xFormat="date"
        height={320}
      />
    );

    expect(screen.getByRole('heading', { name: 'Shopify revenue trend' })).toBeVisible();
    expect(screen.getByText('Gross sales')).toBeVisible();
    expect(screen.getByText('Orders')).toBeVisible();
    expect(screen.getByText('$12,430.40')).toBeVisible();
  });

  it('renders area chart with compact formatted legend values', () => {
    render(
      <TrendChart
        title="Orders over time"
        data={revenueData}
        mode="area"
        xKey="date"
        series={[{ id: 'orders', label: 'Orders', data: revenueData }]}
        format="compact"
        height={280}
      />
    );

    expect(screen.getByRole('heading', { name: 'Orders over time' })).toBeVisible();
    expect(screen.getByText('Orders')).toBeVisible();
    expect(screen.getByText('138')).toBeVisible();
  });

  it('renders categorical x values by default', () => {
    render(
      <TrendChart
        title="Orders by cohort"
        data={[
          { cohort: 'New customers', orders: 138 },
          { cohort: 'Returning customers', orders: 246 }
        ]}
        xKey="cohort"
        series={[{ id: 'orders', label: 'Orders', data: [] }]}
        format="number"
        height={280}
      />
    );

    expect(screen.getByText('New customers')).toBeVisible();
    expect(screen.getByText('Returning customers')).toBeVisible();
  });

  it('renders exactly the x-axis ticks provided through xAxis.ticks', () => {
    render(
      <TrendChart
        title="Tick ladder"
        data={[
          { date: '2026-07-01', grossSales: 1 },
          { date: '2026-07-02', grossSales: 2 },
          { date: '2026-07-03', grossSales: 3 }
        ]}
        series={[{ id: 'grossSales', label: 'Gross sales', data: [] }]}
        xAxis={{ ticks: ['2026-07-01', '2026-07-03'] }}
        xKey="date"
      />
    );

    expect(screen.getByText('2026-07-01')).toBeVisible();
    expect(screen.getByText('2026-07-03')).toBeVisible();
    expect(screen.queryByText('2026-07-02')).not.toBeInTheDocument();
  });

  it('applies the evenly-spaced default ticks that keep both x-axis endpoints', () => {
    const data = Array.from({ length: 30 }, (_, index) => ({
      date: `2026-07-${String(index + 1).padStart(2, '0')}`,
      grossSales: index
    }));

    render(
      <TrendChart
        data={data}
        series={[{ id: 'grossSales', label: 'Gross sales', data }]}
        xKey="date"
      />
    );

    expect(screen.getAllByText('2026-07-01').length).toBeGreaterThan(0);
    expect(screen.getAllByText('2026-07-30').length).toBeGreaterThan(0);
  });

  it('renders date-category data chronologically even when caller data arrives out of order', async () => {
    const data = [
      { date: '2026-08-04', averageUpsellValueMinor: 40 },
      { date: '2026-08-01', averageUpsellValueMinor: 10 },
      { date: '2026-08-03', averageUpsellValueMinor: 30 },
      { date: '2026-08-02', averageUpsellValueMinor: 20 }
    ];

    const { container } = render(
      <TrendChart
        data={data}
        format="currency"
        series={[{ data, id: 'averageUpsellValueMinor', label: 'Average upsell value' }]}
        tooltip={{
          labelFormatter: (label) => `Tooltip date: ${label}`,
          valueFormatter: (value) => `Tooltip value: ${value}`
        }}
        xFormat="date"
        xKey="date"
      />
    );

    const earliestTick = screen.getByText('Aug 1, 2026');
    const latestTick = screen.getByText('Aug 4, 2026');

    expect(earliestTick.compareDocumentPosition(latestTick) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    activateTooltip(container, 65);

    expect(await screen.findByText('Tooltip date: 2026-08-01')).toBeVisible();
    expect(screen.getByText('Tooltip value: 10')).toBeVisible();
  });

  it('keeps sampled date-category ticks chronological when rendering a gap connector line', () => {
    const data = Array.from({ length: 30 }, (_, index) => {
      const date = new Date(Date.UTC(2026, 6, 31 + index)).toISOString().slice(0, 10);
      const valuesByDate: Record<string, number> = {
        '2026-08-05': 12,
        '2026-08-12': 3,
        '2026-08-19': 6,
        '2026-08-29': 9
      };

      return {
        date,
        value: valuesByDate[date]
      };
    });

    const { container } = render(
      <TrendChart
        data={data}
        format="number"
        rechartsProps={{ line: { isAnimationActive: false } }}
        series={[{ connectGaps: true, data, id: 'value', label: 'Value' }]}
        xAxis={{ interval: 'preserveStartEnd' }}
        xFormat="date"
        xKey="date"
      />
    );

    const dateTicks = [...container.querySelectorAll('svg text.recharts-cartesian-axis-tick-value')]
      .map((tick) => tick.textContent ?? '')
      .filter((text) => text.includes('2026') && !text.startsWith('$'));
    const timestamps = dateTicks.map((text) => new Date(text).valueOf());

    expect(dateTicks.length).toBeGreaterThan(2);
    expect(timestamps).toEqual([...timestamps].sort((left, right) => left - right));
  });

  it('hides the built-in legend when showLegend is false', () => {
    render(
      <TrendChart
        data={revenueData}
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
        showLegend={false}
      />
    );

    expect(screen.queryByLabelText('Chart legend')).not.toBeInTheDocument();
  });

  it('accepts cartesian presentation options without changing render output', () => {
    render(
      <TrendChart
        data={revenueData}
        format="currency"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
        margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
        yAxis={{ domain: [0, 800], ticks: [0, 200, 400, 600, 800], width: 56 }}
        xAxis={{ axisLine: false, tickLine: false, minTickGap: 0 }}
        grid={{ horizontal: true, vertical: false, stroke: '#e5e7eb', strokeDasharray: '3 3' }}
        tooltip={{ cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }}
        line={{ dot: false, activeDot: { r: 3, strokeWidth: 0 } }}
      />
    );

    expect(screen.getByText('Gross sales')).toBeVisible();
    expect(screen.getByText('$12,430.40')).toBeVisible();
  });

  it('renders the default tooltip when it becomes active', async () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        format="currency"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      />
    );

    activateTooltip(container);

    expect(await screen.findByText('$14,200.00')).toBeVisible();
  });

  it('applies label and value formatters to the default tooltip', async () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
        tooltip={{
          labelFormatter: (label) => `Tooltip date: ${label}`,
          valueFormatter: (value, series) => `Formatted ${series?.id}: ${value}`
        }}
      />
    );

    activateTooltip(container);

    expect(await screen.findByText('Tooltip date: 2026-07-02')).toBeVisible();
    expect(screen.getByText('Formatted grossSales: 14200')).toBeVisible();
  });

  it('applies className and minWidth to the default tooltip container', async () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
        tooltip={{
          className: 'analytics-tooltip',
          labelFormatter: (label) => `Tooltip date: ${label}`,
          minWidth: 180
        }}
      />
    );

    activateTooltip(container);

    const label = await screen.findByText('Tooltip date: 2026-07-02');

    expect(label.parentElement).toHaveClass('analytics-tooltip');
    expect(label.parentElement).toHaveStyle({ minWidth: '180px' });
  });

  it('passes chart context to custom tooltip content', async () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        format="currency"
        formatOptions={{ currency: 'CAD' }}
        xFormat="date"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
        tooltip={{
          content: ({ active, format, formatLabel, formatOptions, label, payload, series, xFormat, xFormatOptions }) => (
            <div data-testid="custom-tooltip">
              {`active=${active}; label=${label}; payload=${payload?.[0]?.series?.label}; series=${series[0]?.label}; format=${format}; currency=${formatOptions.currency}; xFormat=${xFormat}; xLocale=${xFormatOptions.locale}; formattedLabel=${formatLabel(label)}`}
            </div>
          )
        }}
      />
    );

    activateTooltip(container);

    expect(await screen.findByTestId('custom-tooltip')).toHaveTextContent(
      'active=true; label=2026-07-02; payload=Gross sales; series=Gross sales; format=currency; currency=CAD; xFormat=date; xLocale=en-US; formattedLabel=Jul 2, 2026'
    );
  });

  it('renders an empty state when data is empty', () => {
    render(
      <TrendChart
        title="Shopify revenue trend"
        data={[]}
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: [] }]}
        format="currency"
      />
    );

    expect(screen.getByRole('heading', { name: 'Shopify revenue trend' })).toBeVisible();
    expect(screen.getByText('No data available')).toBeVisible();
  });

  it('renders an inline chart error state with a retry action', () => {
    const onRetry = vi.fn();

    render(
      <TrendChart
        data={revenueData}
        errorMessage="Revenue API unavailable"
        onRetry={onRetry}
        retryLabel="Try again"
        state="error"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      />
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Unable to load chart');
    expect(screen.getByText('Revenue API unavailable')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it('forwards a custom retry action to the error state', () => {
    render(
      <TrendChart
        data={revenueData}
        retryAction={<a href="#support">Contact support</a>}
        state="error"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      />
    );

    expect(screen.getByRole('alert')).toContainElement(screen.getByRole('link', { name: 'Contact support' }));
  });

  it('renders a line-chart skeleton for the chart loading state', () => {
    render(
      <TrendChart
        data={revenueData}
        loadingLabel="Loading revenue trend"
        state="loading"
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      />
    );

    expect(screen.getByRole('status')).toHaveTextContent('Loading revenue trend');
    expect(screen.getAllByTestId('chart-state-skeleton-line')).toHaveLength(3);
  });

  it('keeps the chart mounted behind the reveal overlay', () => {
    const { container } = render(
      <TrendChart
        data={revenueData}
        reveal={{ active: true, label: 'Preparing chart' }}
        xKey="date"
        series={[{ id: 'grossSales', label: 'Gross sales', data: revenueData }]}
      />
    );

    expect(container.querySelector('.recharts-wrapper')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Preparing chart');
  });
});
