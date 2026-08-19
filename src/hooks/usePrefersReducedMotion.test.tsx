import { act, renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { usePrefersReducedMotion } from './usePrefersReducedMotion';

describe('usePrefersReducedMotion', () => {
  it('tracks the reduced-motion media query and removes its listener', () => {
    let listener: (() => void) | undefined;
    const removeEventListener = vi.fn();
    const mediaQuery = {
      addEventListener: vi.fn((_event: string, nextListener: () => void) => { listener = nextListener; }),
      matches: false,
      removeEventListener
    };
    vi.stubGlobal('matchMedia', vi.fn(() => mediaQuery));

    const { result, unmount } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    mediaQuery.matches = true;
    act(() => listener?.());
    expect(result.current).toBe(true);

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith('change', listener);
    vi.unstubAllGlobals();
  });
});
