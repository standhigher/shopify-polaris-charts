import { useEffect, useRef, useState } from 'react';

/**
 * Measures the rendered width of a chart container so axis tick density can
 * adapt to the available space. Falls back to 0 in environments without
 * layout measurement (SSR, jsdom), where callers apply their own default.
 */
export function useChartWidth<TElement extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<TElement | null>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return undefined;
    }

    const measure = () => setWidth(element.getBoundingClientRect().width);

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);

      observer.observe(element);

      return () => observer.disconnect();
    }

    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, []);

  return { ref, width };
}
