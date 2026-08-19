import { render, screen, within } from '@testing-library/react';

import { ComboChart } from '../ComboChart';
import { ComparisonChart } from '../ComparisonChart';
import { ConversionChart } from '../ConversionChart';
import { DonutChart } from '../DonutChart';
import { FunnelChart } from '../FunnelChart';
import { StackedBarChart } from '../StackedBarChart';
import { TrendChart } from '../TrendChart';
import { ChartLocalizationProvider } from '../ChartLocalization';
import { ChartAccessibilityRegion } from './ChartAccessibility';

const trendData = [{ date: '2026-08-19', current: 12, previous: 10 }];
const accessibility = {
  label: 'Revenue analytics',
  description: 'Daily revenue for the selected period.',
  dataTable: (
    <table>
      <caption>Revenue data</caption>
      <tbody><tr><td>2026-08-19</td><td>12</td></tr></tbody>
    </table>
  )
};

describe('ChartAccessibilityRegion', () => {
  it('creates an optional named region with caller-owned hidden semantics', () => {
    render(
      <ChartAccessibilityRegion accessibility={accessibility}>
        <div>Visible chart</div>
      </ChartAccessibilityRegion>
    );

    const region = screen.getByRole('region', { name: 'Revenue analytics' });
    const descriptionId = region.getAttribute('aria-describedby');
    const description = descriptionId ? document.getElementById(descriptionId) : null;

    expect(description).toHaveTextContent('Daily revenue for the selected period.');
    expect(description).toHaveStyle({ clip: 'rect(0 0 0 0)', position: 'absolute' });
    expect(within(region).getByRole('table', { name: 'Revenue data' })).toBeInTheDocument();
    expect(within(region).getAllByRole('table')).toHaveLength(1);
  });

  it('does not add region semantics when accessibility is omitted', () => {
    render(<ChartAccessibilityRegion><div>Visible chart</div></ChartAccessibilityRegion>);

    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.getByText('Visible chart')).toBeVisible();
  });

  it('is supported by every public analytics chart adapter', () => {
    render(
      <>
        <TrendChart accessibility={{ label: 'Trend' }} data={trendData} series={[{ data: trendData, id: 'current', label: 'Current' }]} xKey="date" />
        <ComparisonChart accessibility={{ label: 'Comparison' }} comparisonSeries={{ dataKey: 'previous', label: 'Previous' }} currentSeries={{ dataKey: 'current', label: 'Current' }} data={trendData} xKey="date" />
        <ConversionChart accessibility={{ label: 'Conversion' }} data={trendData} series={[{ dataKey: 'current', label: 'Current' }]} xKey="date" />
        <ComboChart accessibility={{ label: 'Combo' }} data={trendData} series={[{ data: trendData, id: 'current', label: 'Current', type: 'bar' }]} xKey="date" />
        <StackedBarChart accessibility={{ label: 'Stacked' }} data={trendData} series={[{ data: trendData, id: 'current', label: 'Current' }]} xKey="date" />
        <DonutChart accessibility={{ label: 'Donut' }} categoryKey="date" data={trendData} valueKey="current" />
        <FunnelChart accessibility={{ label: 'Funnel' }} data={[{ id: 'view', label: 'View', value: 12 }]} />
      </>
    );

    for (const label of ['Trend', 'Comparison', 'Conversion', 'Combo', 'Stacked', 'Donut', 'Funnel']) {
      expect(screen.getByRole('region', { name: label })).toBeInTheDocument();
    }
  });

  it('localizes built-in chart legends', () => {
    render(
      <ChartLocalizationProvider messages={{ chartLegend: '图表图例' }}>
        <TrendChart data={trendData} series={[{ data: trendData, id: 'current', label: 'Current' }]} xKey="date" />
        <ComboChart data={trendData} series={[{ data: trendData, id: 'current', label: 'Current', type: 'bar' }]} xKey="date" />
        <StackedBarChart data={trendData} series={[{ data: trendData, id: 'current', label: 'Current' }]} xKey="date" />
        <DonutChart categoryKey="date" data={trendData} valueKey="current" />
      </ChartLocalizationProvider>
    );

    expect(screen.getAllByLabelText('图表图例')).toHaveLength(4);
    expect(screen.queryByLabelText('Chart legend')).not.toBeInTheDocument();
  });
});
