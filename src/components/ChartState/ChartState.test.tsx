import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ChartLocalizationProvider } from '../ChartLocalization';
import { ChartStateRegion } from './ChartState';

describe('ChartState', () => {
  it('renders a localized error panel and invokes retry', () => {
    const onRetry = vi.fn();

    render(
      <ChartLocalizationProvider messages={{ chartError: '无法加载图表', retry: '重新尝试' }}>
        <ChartStateRegion errorMessage="Revenue API unavailable" onRetry={onRetry} state="error">
          <div>Ready chart</div>
        </ChartStateRegion>
      </ChartLocalizationProvider>
    );

    expect(screen.getByRole('alert')).toHaveTextContent('无法加载图表');
    expect(screen.getByText('Revenue API unavailable')).toBeVisible();
    fireEvent.click(screen.getByRole('button', { name: '重新尝试' }));
    expect(onRetry).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Ready chart')).not.toBeInTheDocument();
  });

  it('keeps ready content mounted until a reveal transition ends', async () => {
    const { rerender } = render(
      <ChartStateRegion reveal={{ active: true, label: 'Preparing chart' }}>
        <div>Ready chart</div>
      </ChartStateRegion>
    );

    expect(screen.getByText('Ready chart')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('Preparing chart');

    rerender(
      <ChartStateRegion reveal={{ active: false, label: 'Preparing chart' }}>
        <div>Ready chart</div>
      </ChartStateRegion>
    );

    await act(async () => {
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    });

    const overlay = screen.getByRole('status');

    expect(screen.getByText('Ready chart')).toBeVisible();
    fireEvent.transitionEnd(overlay, { propertyName: 'opacity' });
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});
