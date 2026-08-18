import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ChartLocalizationProvider } from '../ChartLocalization';
import { ChartStateRegion } from './ChartState';

describe('ChartState', () => {
  it('renders a custom retry action instead of the default button', () => {
    const onCustomRetry = vi.fn();
    const onRetry = vi.fn();

    render(
      <ChartStateRegion
        onRetry={onRetry}
        retryAction={<button onClick={onCustomRetry}>Contact support</button>}
        state="error"
      >
        <div>Ready chart</div>
      </ChartStateRegion>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Contact support' }));
    expect(onCustomRetry).toHaveBeenCalledTimes(1);
    expect(onRetry).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Retry' })).not.toBeInTheDocument();
  });

  it('uses the neutral black style for the default retry button', () => {
    render(
      <ChartStateRegion onRetry={() => undefined} state="error">
        <div>Ready chart</div>
      </ChartStateRegion>
    );

    expect(screen.getByRole('button', { name: 'Retry' })).toHaveStyle({
      background: '#202223',
      color: '#ffffff'
    });
  });

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
