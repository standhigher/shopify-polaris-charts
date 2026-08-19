import { act, createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';

import { TrendChart } from '../src';

describe('v1 hydration contract', () => {
  it('hydrates the same initial chart tree without a mismatch', async () => {
    const data = [{ date: '2026-08-19', revenue: 12 }];
    const props = {
      data,
      series: [{ data, id: 'revenue', label: 'Revenue' }],
      xKey: 'date' as const
    };
    const container = document.createElement('div');
    const onError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    container.innerHTML = renderToString(createElement(TrendChart, props));
    document.body.append(container);

    const root = hydrateRoot(container, createElement(TrendChart, props));
    await act(async () => undefined);

    const messages = onError.mock.calls.flat().map(String).join('\n');
    expect(messages).not.toMatch(/hydration|did not match|server rendered html/i);

    await act(async () => root.unmount());
    onError.mockRestore();
    container.remove();
  });
});
