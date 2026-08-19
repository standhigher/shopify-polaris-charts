import { fireEvent, render, screen, within } from '@testing-library/react';
import { vi } from 'vitest';

import { ChartLocalizationProvider } from '../ChartLocalization';
import { FunnelChart } from './FunnelChart';
import type { FunnelDatum } from './funnel';

const productFunnel: FunnelDatum[] = [
  { id: 'view', label: 'Product view', value: 1000 },
  { conversion: 0.4, dropOff: 0.6, id: 'cart', label: 'Add to cart', value: 400 },
  { conversion: 0.25, dropOff: 0.75, id: 'checkout', label: 'Checkout', value: 100 },
  { conversion: 0, dropOff: 1, id: 'purchase', label: 'Checkout', value: 0 }
];

describe('FunnelChart', () => {
  it('keeps stage order and exposes every metric as visible text', () => {
    render(<FunnelChart data={productFunnel} title="Store funnel" />);

    expect(screen.getByRole('heading', { name: 'Store funnel' })).toBeVisible();
    const stages = screen.getAllByTestId('funnel-stage');

    expect(stages).toHaveLength(4);
    expect(stages.map((stage) => within(stage).getByTestId('funnel-stage-label').textContent)).toEqual([
      'Product view',
      'Add to cart',
      'Checkout',
      'Checkout'
    ]);
    expect(within(stages[0]).getByText('1,000')).toBeVisible();
    expect(within(stages[0]).getAllByText('—')).toHaveLength(2);
    expect(within(stages[1]).getByText('40%')).toBeVisible();
    expect(within(stages[1]).getByText('60%')).toBeVisible();
    expect(within(stages[3]).getByText('0')).toBeVisible();
    expect(within(stages[3]).getByText('0%')).toBeVisible();
    expect(within(stages[3]).getByTestId('funnel-segment')).toHaveStyle({ width: '2%' });
  });

  it('normalizes explicit percent input and localizes labels and values', () => {
    render(
      <ChartLocalizationProvider
        locale="zh-CN"
        messages={{
          funnelConversion: '转化率',
          funnelDropOff: '流失率',
          funnelStage: '阶段',
          funnelStages: '漏斗阶段',
          funnelValue: '数量'
        }}
      >
        <FunnelChart
          data={[{ conversion: 25, dropOff: 75, id: 'cart', label: '加入购物车', value: 1234 }]}
          formatOptions={{ maximumFractionDigits: 0 }}
          percentageInput="percent"
        />
      </ChartLocalizationProvider>
    );

    const stage = screen.getByTestId('funnel-stage');
    expect(screen.getByRole('list', { name: '漏斗阶段' })).toBeVisible();
    expect(stage).toHaveTextContent('阶段');
    expect(stage).toHaveTextContent('数量');
    expect(stage).toHaveTextContent('转化率');
    expect(stage).toHaveTextContent('流失率');
    expect(stage).toHaveTextContent('1,234');
    expect(stage).toHaveTextContent('25%');
    expect(stage).toHaveTextContent('75%');
  });

  it('shows the same stage details in a keyboard and pointer tooltip', () => {
    render(<FunnelChart data={productFunnel.slice(0, 2)} />);

    const cartStage = screen.getByRole('button', { name: /Add to cart/ });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.focus(cartStage);
    expect(screen.getByRole('tooltip')).toHaveTextContent('Add to cart');
    expect(screen.getByRole('tooltip')).toHaveTextContent('400');
    expect(screen.getByRole('tooltip')).toHaveTextContent('40%');

    fireEvent.blur(cartStage);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    fireEvent.mouseEnter(cartStage);
    expect(screen.getByRole('tooltip')).toHaveTextContent('60%');
    fireEvent.mouseLeave(cartStage);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('remains responsive with a long label in a narrow container', () => {
    render(
      <div style={{ width: 320 }}>
        <FunnelChart
          data={[
            {
              id: 'long',
              label: 'Offer shown to customers with an intentionally long translated stage name',
              value: 12
            }
          ]}
        />
      </div>
    );

    expect(screen.getByTestId('funnel-chart')).toHaveStyle({ width: '100%' });
    expect(screen.getByTestId('funnel-chart').style.minWidth).toBe('');
    expect(screen.getByTestId('funnel-stage-label')).toHaveStyle({ overflowWrap: 'anywhere' });
  });

  it('uses shared loading, empty, error, retry, and custom action states', () => {
    const onRetry = vi.fn();
    const { rerender } = render(<FunnelChart data={productFunnel} state="loading" />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading chart');
    expect(screen.getAllByTestId('chart-state-skeleton-line')).toHaveLength(3);

    rerender(<FunnelChart data={[]} emptyMessage="No funnel stages" />);
    expect(screen.getByRole('status')).toHaveTextContent('No funnel stages');

    rerender(<FunnelChart data={productFunnel} onRetry={onRetry} state="error" />);
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledTimes(1);

    rerender(
      <FunnelChart
        data={productFunnel}
        onRetry={onRetry}
        retryAction={<a href="#support">Contact support</a>}
        state="error"
      />
    );
    expect(screen.getByRole('alert')).toContainElement(screen.getByRole('link', { name: 'Contact support' }));
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  it('does not treat a zero-valued funnel as empty', () => {
    render(<FunnelChart data={[{ id: 'zero', label: 'Purchase', value: 0 }]} />);

    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
    expect(screen.getByTestId('funnel-stage')).toHaveTextContent('Purchase');
  });
});
