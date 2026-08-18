import { render } from '@testing-library/react';
import { vi } from 'vitest';

interface CapturedTrendChartProps {
  data: Array<Record<string, unknown>>;
  series: Array<{
    data: Array<Record<string, unknown>>;
    id: string;
  }>;
}

const capture = vi.hoisted(() => ({ props: undefined as CapturedTrendChartProps | undefined }));

vi.mock('../TrendChart', () => ({
  TrendChart: (props: CapturedTrendChartProps) => {
    capture.props = props;
    return null;
  }
}));

import { ConversionChart } from './ConversionChart';

describe('ConversionChart adapter', () => {
  it('uses a distinct target field without overwriting colliding user fields', () => {
    const data = [
      { date: 'Aug 1', conversion: 4.2, __conversionTarget: 91, __conversionTarget1: 92 }
    ];

    render(
      <ConversionChart
        data={data}
        input="percent"
        series={[
          { dataKey: 'conversion', label: 'Conversion' },
          { dataKey: '__conversionTarget', label: 'Existing target field' },
          { dataKey: '__conversionTarget1', label: 'Existing suffixed field' }
        ]}
        target={{ label: 'Goal', value: 5 }}
        xKey="date"
      />
    );

    const props = capture.props;
    expect(props).toBeDefined();
    expect(props?.data[0]).toMatchObject({
      conversion: 0.042,
      __conversionTarget: 0.91,
      __conversionTarget1: 0.92
    });

    const targetSeries = props?.series[props.series.length - 1];
    expect(targetSeries?.id).not.toBe('__conversionTarget');
    expect(targetSeries?.id).not.toBe('__conversionTarget1');
    expect(targetSeries?.data[0]?.[targetSeries.id]).toBe(0.05);
  });

  it('reserves declared series keys even when they are absent from every row', () => {
    const data: Array<{ date: string; conversion: number; __conversionTarget?: number }> = [
      { date: 'Aug 1', conversion: 0.042 }
    ];

    render(
      <ConversionChart
        data={data}
        series={[
          { dataKey: 'conversion', label: 'Conversion' },
          { dataKey: '__conversionTarget', label: 'Optional benchmark' }
        ]}
        target={{ label: 'Goal', value: 0.05 }}
        xKey="date"
      />
    );

    const props = capture.props;
    const optionalSeries = props?.series.find(({ id }) => id === '__conversionTarget');
    const targetSeries = props?.series[props.series.length - 1];

    expect(optionalSeries).toBeDefined();
    expect(targetSeries?.id).not.toBe(optionalSeries?.id);
    expect(targetSeries?.data[0]?.[targetSeries.id]).toBe(0.05);
  });
});
