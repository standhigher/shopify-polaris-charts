import { expect, test } from '@playwright/test';

const dashboardUrl = '/iframe.html?id=examples-shopify-analytics-dashboard--ready&viewMode=story';
const funnelUrl = '/iframe.html?id=components-funnelchart--product-purchase&viewMode=story';

test('dashboard stays usable without horizontal overflow at supported widths', async ({ page }) => {
  for (const width of [320, 768, 1280]) {
    await page.setViewportSize({ height: 900, width });
    await page.goto(dashboardUrl);
    await expect(page.getByRole('heading', { level: 1, name: 'Store performance' })).toBeVisible();

    for (const heading of ['Metric Cards', 'Trend', 'Comparison', 'Conversion', 'Funnel']) {
      await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
    }
    for (const metric of ['Revenue', 'Orders', 'Conversion Rate', 'AOV', 'Customers', 'Upsell Conversion']) {
      await expect(page.getByRole('region', { exact: true, name: metric })).toBeVisible();
    }

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  }

  const dateRange = page.getByRole('combobox', { name: 'Date range' });
  await dateRange.selectOption('30d');
  await expect(dateRange).toHaveValue('30d');
});

test('funnel exposes keyboard details and honors reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(funnelUrl);

  const firstStage = page.getByRole('button').first();
  await firstStage.focus();
  await expect(page.getByRole('tooltip')).toContainText('Product view');
  await expect(page.getByRole('tooltip')).toContainText('Value');

  const transitionDuration = await page.getByTestId('funnel-segment').first().evaluate(
    (element) => getComputedStyle(element).transitionDuration
  );
  expect(transitionDuration).toBe('0s');
});
