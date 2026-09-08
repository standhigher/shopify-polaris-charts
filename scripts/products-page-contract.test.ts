// @vitest-environment node

import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const productsUrl =
  'https://standhigher.github.io/shopify-polaris-charts/products/?utm_source=GitHub&utm_medium=social&utm_content=standhigher-charts';
const bestTrackUrl = 'https://apps.shopify.com/besttrack?utm_source=GitHub&utm_medium=social';
const bestUpsellUrl = 'https://apps.shopify.com/bestupsellapp?utm_source=GitHub&utm_medium=social';
const bestBundleUrl = 'https://apps.shopify.com/bestbundle?utm_source=GitHub&utm_medium=social';
const sonarUrl = 'https://apps.shopify.com/sonarfulfill?locale=zh-CN&utm_source=GitHub&utm_medium=social';

describe('standhigher Products referral contract', () => {
  it('keeps the English npm and GitHub README referral content together', () => {
    const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8');

    expect(readme).toContain('## Built by standhigher');
    expect(readme).toContain(productsUrl);
    expect(readme).toContain(`[BestTrack](${bestTrackUrl})`);
    expect(readme).toContain(`[BestUpsell](${bestUpsellUrl})`);
    expect(readme).toContain(`[BestBundle](${bestBundleUrl})`);
    expect(readme).toContain(`[SonarFulfill](${sonarUrl})`);
  });

  it('uses the designated Shopify App Store destinations', () => {
    const page = readFileSync(new URL('../public/products/index.html', import.meta.url), 'utf8');

    expect(page).toContain('src="assets/besttrack.webp"');
    expect(page).toContain('src="assets/bestupsell.webp"');
    expect(page).toContain('src="assets/bestbundle.webp"');
    expect(page).toContain('src="assets/sonar.webp"');
    expect(page).toContain(bestTrackUrl);
    expect(page).toContain(bestUpsellUrl);
    expect(page).toContain(bestBundleUrl);
    expect(page).toContain(sonarUrl);
    expect(page).not.toContain('utm_content=standhigher-charts');
  });
});
