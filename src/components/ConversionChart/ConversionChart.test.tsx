import { render, screen } from '@testing-library/react';

import { ConversionChart } from './ConversionChart';

const series = [{ dataKey: 'conversion' as const, label: 'Conversion', color: '#008060' }];

describe('ConversionChart', () => {
  it('formats ratio input as a percentage by default', () => {
    render(<ConversionChart data={[{ date: 'Aug 1', conversion: 0.042 }]} series={series} xKey="date" />);

    expect(screen.getByLabelText('Chart legend')).toHaveTextContent('Conversion4.2%');
  });

  it('normalizes percent input without mutating caller data', () => {
    const data = [{ date: 'Aug 1', conversion: 4.2 }];

    render(<ConversionChart data={data} input="percent" series={series} xKey="date" />);

    expect(screen.getByLabelText('Chart legend')).toHaveTextContent('Conversion4.2%');
    expect(data).toEqual([{ date: 'Aug 1', conversion: 4.2 }]);
  });

  it('renders multiple conversion series in definition order', () => {
    render(
      <ConversionChart
        data={[{ date: 'Aug 1', checkout: 0.031, purchase: 0.018 }]}
        series={[
          { dataKey: 'checkout', label: 'Checkout' },
          { dataKey: 'purchase', label: 'Purchase' }
        ]}
        xKey="date"
      />
    );

    expect(screen.getByLabelText('Chart legend')).toHaveTextContent('Checkout3.1%Purchase1.8%');
  });

  it('adds a dashed target series and normalizes its value on the same input basis', () => {
    const data = [
      { date: 'Aug 1', conversion: 4.2, __conversionTarget: 91, __conversionTarget1: 92 },
      { date: 'Aug 2', conversion: 4.4, __conversionTarget: 93, __conversionTarget1: 94 }
    ];
    const { container } = render(
      <ConversionChart
        data={data}
        input="percent"
        series={series}
        target={{ label: 'Goal', value: 5 }}
        rechartsProps={{ line: { isAnimationActive: false } }}
        xKey="date"
      />
    );

    expect(screen.getByLabelText('Chart legend')).toHaveTextContent('Conversion4.2%Goal5%');
    expect(container.querySelectorAll('.recharts-line-curve')[1]).toHaveAttribute('stroke-dasharray');
    expect(data).toEqual([
      { date: 'Aug 1', conversion: 4.2, __conversionTarget: 91, __conversionTarget1: 92 },
      { date: 'Aug 2', conversion: 4.4, __conversionTarget: 93, __conversionTarget1: 94 }
    ]);
  });

  it('preserves zero values and treats null-only data as empty', () => {
    const { rerender } = render(
      <ConversionChart data={[{ date: 'Aug 1', conversion: 0 }]} series={series} xKey="date" />
    );
    expect(screen.getByLabelText('Chart legend')).toHaveTextContent('Conversion0%');

    rerender(
      <ConversionChart
        data={[{ date: 'Aug 1', conversion: null }]}
        series={[{ dataKey: 'conversion', label: 'Conversion' }]}
        xKey="date"
      />
    );
    expect(screen.getByText('No data available')).toBeVisible();
  });

  it('forwards error state and retryAction', () => {
    render(
      <ConversionChart
        data={[]}
        retryAction={<a href="#retry">Try elsewhere</a>}
        series={series}
        state="error"
        xKey="date"
      />
    );

    expect(screen.getByRole('alert')).toBeVisible();
    expect(screen.getByRole('link', { name: 'Try elsewhere' })).toHaveAttribute('href', '#retry');
  });

  it('forwards explicit percentage format options', () => {
    render(
      <ConversionChart
        data={[{ date: 'Aug 1', conversion: 0.0425 }]}
        formatOptions={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
        series={series}
        xKey="date"
      />
    );

    expect(screen.getByLabelText('Chart legend')).toHaveTextContent('Conversion4.25%');
  });
});
