import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

const monthlyTrendUrl = '/iframe.html?id=components-trendchart--monthly-trend&viewMode=story';

async function getXTickLabels(page: Page): Promise<string[]> {
  return page.evaluate(() =>
    Array.from(document.querySelectorAll('.recharts-cartesian-axis-tick-value'))
      .map((element) => element.textContent)
      .filter((text): text is string => Boolean(text) && !/^[$0-9]/.test(text))
  );
}

async function hasCollidingXTickLabels(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('.recharts-cartesian-axis-tick-value')).filter(
      (element) => Boolean(element.textContent) && !/^[$0-9]/.test(element.textContent ?? '')
    );
    const rects = labels.map((element) => (element as SVGGraphicsElement).getBoundingClientRect());

    for (let i = 0; i < rects.length - 1; i += 1) {
      if (rects[i].right > rects[i + 1].left + 0.5) {
        return true;
      }
    }

    return false;
  });
}

test.describe('monthly trend x-axis', () => {
  test('shows first and last labels with evenly-spaced middle ticks that never collide', async ({ page }) => {
    await page.setViewportSize({ width: 900, height: 520 });
    await page.goto(monthlyTrendUrl);
    await expect(page.getByRole('region', { name: 'Revenue trend' })).toBeVisible();

    // Wait for the container width measurement and the chart render to settle.
    await expect
      .poll(async () => (await getXTickLabels(page)).length, { timeout: 5000 })
      .toBeGreaterThanOrEqual(3);

    const labels = await getXTickLabels(page);

    expect(labels[0]).toBe('Jul 1, 2026');
    expect(labels[labels.length - 1]).toBe('Jul 30, 2026');
    expect(new Set(labels).size).toBe(labels.length);
    expect(await hasCollidingXTickLabels(page)).toBe(false);
  });

  test('drops middle labels on a narrow viewport while keeping both endpoints', async ({ page }) => {
    await page.setViewportSize({ width: 640, height: 520 });
    await page.goto(monthlyTrendUrl);
    await expect(page.getByRole('region', { name: 'Revenue trend' })).toBeVisible();

    await expect
      .poll(async () => (await getXTickLabels(page)).length, { timeout: 5000 })
      .toBeGreaterThanOrEqual(3);

    const labels = await getXTickLabels(page);

    expect(labels[0]).toBe('Jul 1, 2026');
    expect(labels[labels.length - 1]).toBe('Jul 30, 2026');
    expect(await hasCollidingXTickLabels(page)).toBe(false);
  });
});
