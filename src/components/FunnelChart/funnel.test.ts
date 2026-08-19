import type { FunnelDatum } from './funnel';
import { normalizeFunnelData } from './funnel';

describe('Funnel data contract', () => {
  it('preserves ratio input and the original array reference', () => {
    const stages: FunnelDatum[] = [
      { id: 'view', label: 'Product view', value: 1000 },
      { conversion: 0, dropOff: 1, id: 'cart', label: 'Add to cart', value: 0 }
    ];

    expect(normalizeFunnelData(stages, 'ratio')).toBe(stages);
    expect(stages[1]).toEqual({
      conversion: 0,
      dropOff: 1,
      id: 'cart',
      label: 'Add to cart',
      value: 0
    });
  });

  it('normalizes only finite percentage metrics without mutating caller rows', () => {
    const stages = [
      {
        conversion: 25,
        dropOff: 75,
        id: 'cart',
        label: 'Repeated stage',
        metadata: { source: 'prepared' },
        value: 0
      },
      {
        conversion: Number.NaN,
        dropOff: Number.POSITIVE_INFINITY,
        id: 'checkout',
        label: 'Repeated stage',
        value: 12
      },
      {
        id: 'purchase',
        label: 'A long purchase stage label that must remain unchanged',
        value: 4
      }
    ];

    const normalized = normalizeFunnelData(stages, 'percent');

    expect(normalized).not.toBe(stages);
    expect(normalized.map((stage) => stage.id)).toEqual(['cart', 'checkout', 'purchase']);
    expect(normalized[0]).toMatchObject({ conversion: 0.25, dropOff: 0.75, value: 0 });
    expect(normalized[0].metadata).toBe(stages[0].metadata);
    expect(normalized[1].conversion).toBeNaN();
    expect(normalized[1].dropOff).toBe(Number.POSITIVE_INFINITY);
    expect(normalized[2]).not.toHaveProperty('conversion');
    expect(stages[0].conversion).toBe(25);
    expect(stages[0].dropOff).toBe(75);
  });
});
