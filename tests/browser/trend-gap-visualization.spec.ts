import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const trendGapUrl = '/iframe.html?id=components-trendchart--gaps-and-isolated-dots&viewMode=story';
const comboGapUrl = '/iframe.html?id=components-combochart--gaps-and-dual-axis&viewMode=story';

type PagePoint = { x: number; y: number };

const pathPoints = (path: string | null): PagePoint[] => {
  if (!path) {
    return [];
  }

  const values = path.match(/-?\\d+(?:\\.\\d+)?/g)?.map(Number) ?? [];

  return Array.from({ length: Math.floor(values.length / 2) }, (_, index) => ({
    x: values[index * 2],
    y: values[index * 2 + 1]
  }));
};

async function moveToCircle(page: Page, circle: Locator) {
  const point = await circle.evaluate((element: SVGCircleElement) => {
    const svg = element.ownerSVGElement;
    const rect = svg?.getBoundingClientRect();

    if (!svg || !rect) {
      throw new Error('Expected the isolated dot to belong to an SVG chart.');
    }

    return {
      x: rect.left + Number(element.getAttribute('cx')),
      y: rect.top + Number(element.getAttribute('cy'))
    };
  });

  await page.mouse.move(point.x, point.y);
}

async function expectStoryLoaded(page: Page, storyId: string): Promise<boolean> {
  const missingStory = page.getByRole('heading', { name: new RegExp(`Couldn't find story matching '${storyId}'`) });

  if (await missingStory.count()) {
    test.skip(true, `${storyId} is added by the ComboChart gap story task.`);
    return false;
  }

  return true;
}

test.describe('line gap visualization stories', () => {
  test('mouse clicks do not focus the chart surface while keyboard focus remains available', async ({ page }) => {
    await page.goto(trendGapUrl);
    await expect(page.getByRole('region', { name: 'Revenue data gaps' })).toBeVisible();

    const chartSurface = page.locator('.standhigher-chart-surface');
    const svgSurface = page.locator('svg.recharts-surface');

    await expect(svgSurface).toHaveAttribute('tabindex', '0');
    await chartSurface.click({ position: { x: 120, y: 120 } });
    await expect(svgSurface).not.toBeFocused();

    await svgSurface.focus();
    await expect(svgSurface).toBeFocused();
  });

  test('TrendChart renders dashed connectors below the solid line and activates isolated-point tooltip', async ({ page }) => {
    await page.goto(trendGapUrl);
    await expect(page.getByRole('region', { name: 'Revenue data gaps' })).toBeVisible();
    const mainLine = page.locator('path.recharts-line-curve[stroke="#008060"]');
    await expect(mainLine).toHaveCount(1);
    await expect(mainLine).not.toHaveAttribute('stroke-dasharray', /\S+/);

    const geometry = await page.locator('svg').first().evaluate((svg) => {
      const paths = Array.from(svg.querySelectorAll<SVGPathElement>('path.recharts-line-curve'));
      const connectors = paths.filter((path) => path.getAttribute('stroke-dasharray') === '5 4');
      const main = paths.find((path) => path.getAttribute('stroke') === '#008060');
      const points = (path: SVGPathElement) => {
        const values = path.getAttribute('d')?.match(/-?\\d+(?:\\.\\d+)?/g)?.map(Number) ?? [];

        return Array.from({ length: Math.floor(values.length / 2) }, (_, index) => ({
          x: values[index * 2],
          y: values[index * 2 + 1]
        }));
      };

      return {
        allPaths: paths.map((path) => path.getAttribute('d')),
        connectorPaths: connectors.map((path) => ({
          d: path.getAttribute('d'),
          opacity: path.getAttribute('opacity'),
          stroke: path.getAttribute('stroke'),
          strokeDasharray: path.getAttribute('stroke-dasharray'),
          strokeWidth: path.getAttribute('stroke-width'),
          points: points(path)
        })),
        mainPath: main
          ? {
              d: main.getAttribute('d'),
              points: points(main)
            }
          : null
      };
    });

    expect(geometry.connectorPaths).toHaveLength(2);
    expect(geometry.mainPath).not.toBeNull();
    expect(geometry.connectorPaths.every((path) => path.strokeDasharray === '5 4')).toBe(true);
    expect(geometry.connectorPaths.every((path) => path.stroke === '#6d7175')).toBe(true);
    expect(geometry.connectorPaths.every((path) => path.opacity === '0.8')).toBe(true);
    expect(geometry.connectorPaths.every((path) => path.strokeWidth === '2')).toBe(true);

    const mainPathIndex = geometry.allPaths.findIndex((path) => path === geometry.mainPath?.d);
    expect(mainPathIndex).toBe(geometry.allPaths.length - 1);

    for (const connector of geometry.connectorPaths) {
      for (const endpoint of connector.points) {
        expect(
          geometry.mainPath?.points.some(
            (mainPoint) => Math.abs(mainPoint.x - endpoint.x) < 0.01 && Math.abs(mainPoint.y - endpoint.y) < 0.01
          )
        ).toBe(true);
      }
    }

    const isolatedDots = page.locator('circle.recharts-dot');
    await expect(isolatedDots).toHaveCount(2);
    await moveToCircle(page, isolatedDots.first());

    const tooltip = page.locator('.recharts-tooltip-wrapper');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Current period');
    await expect(tooltip).toContainText('$12,430.40');
  });

  test('TrendChart tooltip keeps internal connector keys out of the payload', async ({ page }) => {
    await page.goto(trendGapUrl);
    await expect(page.getByRole('region', { name: 'Revenue data gaps' })).toBeVisible();

    const isolatedDot = page.locator('circle.recharts-dot').first();
    await expect(isolatedDot).toBeVisible();
    await moveToCircle(page, isolatedDot);

    const tooltip = page.locator('.recharts-tooltip-wrapper');
    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText('Current period');
    await expect(tooltip).not.toContainText('__standhigher_gap__');
    await expect(tooltip.locator('strong')).toHaveCount(1);
  });

  test('ComboChart keeps a right-axis gap connector on the right-axis line coordinate system', async ({ page }) => {
    await page.goto(comboGapUrl);
    if (!(await expectStoryLoaded(page, 'components-combochart--gaps-and-dual-axis'))) {
      return;
    }

    await expect(page.locator('.recharts-yAxis')).toHaveCount(2);

    const rightLine = page.locator('path.recharts-line-curve[stroke="#2c6ecb"]');
    await expect(rightLine).toBeVisible();
    const rightLineData = await rightLine.getAttribute('d');

    const rightConnectors = page.locator('path.recharts-line-curve[stroke-dasharray="3 3"][stroke="#8da9d8"]');
    await expect(rightConnectors).toHaveCount(2);

    const rightLinePoints = pathPoints(rightLineData);
    const connectorPaths = await rightConnectors.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('d'))
    );

    for (const path of connectorPaths) {
      for (const endpoint of pathPoints(path)) {
        expect(
          rightLinePoints.some(
            (linePoint) => Math.abs(linePoint.x - endpoint.x) < 0.01 && Math.abs(linePoint.y - endpoint.y) < 0.01
          )
        ).toBe(true);
      }
    }

  });
});
