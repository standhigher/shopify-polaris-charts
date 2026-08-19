import { memo, useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ComboChart } from '../ComboChart';
import { DonutChart } from '../DonutChart';
import { StackedBarChart } from '../StackedBarChart';
import { TrendChart } from '../TrendChart';
import { ChartLocalizationProvider, useChartLocalization } from './ChartLocalization';

function LocalizationProbe() {
  const { currency, locale, messages, timeZone } = useChartLocalization();

  return <div>{`${locale}|${timeZone}|${currency}|${messages.retry}|${messages.chartEmpty}`}</div>;
}

describe('ChartLocalizationProvider', () => {
  it('merges nested formatting defaults and translated messages', () => {
    render(
      <ChartLocalizationProvider currency="CNY" locale="zh-CN" messages={{ retry: '重试' }} timeZone="Asia/Shanghai">
        <ChartLocalizationProvider messages={{ chartEmpty: '暂无数据' }}>
          <LocalizationProbe />
        </ChartLocalizationProvider>
      </ChartLocalizationProvider>
    );

    expect(screen.getByText('zh-CN|Asia/Shanghai|CNY|重试|暂无数据')).toBeVisible();
  });

  it('applies provider copy to empty states across all primary charts', () => {
    render(
      <ChartLocalizationProvider messages={{ chartEmpty: '暂无数据' }}>
        <TrendChart data={[]} series={[{ data: [], id: 'sales', label: 'Sales' }]} xKey="date" />
        <ComboChart data={[]} series={[{ data: [], id: 'orders', label: 'Orders', type: 'bar' }]} xKey="date" />
        <StackedBarChart data={[]} series={[{ data: [], id: 'orders', label: 'Orders' }]} xKey="channel" />
        <DonutChart categoryKey="source" data={[]} valueKey="visits" />
      </ChartLocalizationProvider>
    );

    expect(screen.getAllByText('暂无数据')).toHaveLength(4);
  });

  it('does not notify memoized consumers on unrelated parent rerenders', () => {
    const renderConsumer = vi.fn();
    const messages = { retry: 'Try again' };
    const MemoizedConsumer = memo(function MemoizedConsumer() {
      renderConsumer();
      useChartLocalization();
      return <span>Stable consumer</span>;
    });

    function Harness() {
      const [count, setCount] = useState(0);

      return (
        <>
          <button onClick={() => setCount((value) => value + 1)} type="button">Parent {count}</button>
          <ChartLocalizationProvider locale="en-US" messages={messages}>
            <MemoizedConsumer />
          </ChartLocalizationProvider>
        </>
      );
    }

    render(<Harness />);
    fireEvent.click(screen.getByRole('button', { name: 'Parent 0' }));

    expect(renderConsumer).toHaveBeenCalledTimes(1);
  });
});
