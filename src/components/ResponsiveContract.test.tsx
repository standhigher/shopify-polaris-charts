import { render, screen } from '@testing-library/react';

import { ComboChart } from './ComboChart';
import { DonutChart } from './DonutChart';
import { FunnelChart } from './FunnelChart';
import { StackedBarChart } from './StackedBarChart';
import { TrendChart } from './TrendChart';

const longLabel = 'Returning customers from the international storefront with a deliberately long translated label';
const data = [{ label: longLabel, current: 123456789.25, previous: -1200, zero: 0 }];

function ResponsiveCharts({ width }: { width: number }) {
  return (
    <div data-testid={`viewport-${width}`} style={{ width }}>
      <TrendChart accessibility={{ label: 'Trend responsive region' }} data={data} format="currency" series={[{ data, id: 'current', label: longLabel }]} title="Trend responsive" xKey="label" />
      <ComboChart data={data} format="currency" series={[{ data, id: 'current', label: longLabel, type: 'bar' }]} title="Combo responsive" xKey="label" />
      <StackedBarChart data={data} format="currency" series={[{ data, id: 'previous', label: longLabel }]} title="Stacked responsive" xKey="label" />
      <DonutChart categoryKey="label" data={data} format="currency" title="Donut responsive" valueKey="current" />
      <FunnelChart data={[{ id: 'long', label: longLabel, value: 123456789.25 }]} format="currency" title="Funnel responsive" />
    </div>
  );
}

describe.each([320, 768, 1280])('responsive contract at %ipx', (width) => {
  it('keeps every primary chart shrinkable inside its container', () => {
    render(<ResponsiveCharts width={width} />);

    for (const title of [
      'Trend responsive',
      'Combo responsive',
      'Stacked responsive',
      'Donut responsive',
      'Funnel responsive'
    ]) {
      const chart = screen.getByRole('heading', { name: title }).parentElement;
      expect(chart).toHaveStyle({ boxSizing: 'border-box', minWidth: 0, width: '100%' });
    }

    expect(screen.getByRole('region', { name: 'Trend responsive region' })).toHaveStyle({
      boxSizing: 'border-box',
      minWidth: 0,
      width: '100%'
    });
  });

  it('wraps built-in legends without a fixed width', () => {
    render(<ResponsiveCharts width={width} />);

    for (const legend of screen.getAllByLabelText('Chart legend')) {
      expect(legend).toHaveStyle({ flexWrap: 'wrap', minWidth: 0, width: '100%' });
      expect(legend.style.maxWidth).toBe('');
    }
  });
});
