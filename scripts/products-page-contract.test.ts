// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const productsUrl =
  'https://standhigher.github.io/shopify-polaris-charts/products/?utm_source=GitHub&utm_medium=social&utm_content=standhigher-charts';

describe('standhigher Products referral contract', () => {
  it('keeps the English npm and GitHub README referral content together', () => {
    const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

    expect(readme).toContain('## Built by standhigher');
    expect(readme).toContain(productsUrl);
    expect(readme).toContain('[BestTrack]');
    expect(readme).toContain('[BestUpsell]');
  });

  it('preserves the package-specific attribution through the Products page', () => {
    const page = readFileSync(new URL('../public/products/index.html', import.meta.url), 'utf8');

    expect(page).toContain('https://apps.shopify.com/besttrack?utm_source=GitHub&utm_medium=social&utm_content=standhigher-charts');
    expect(page).toContain('https://apps.shopify.com/bestupsellapp?utm_source=GitHub&utm_medium=social&utm_content=standhigher-charts');
    expect(page).toContain("destination.searchParams.set('utm_content', incomingContent)");
  });
});
