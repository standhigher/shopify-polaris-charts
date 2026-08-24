import { expect, test } from '@playwright/test';
import type { Locator, Page } from '@playwright/test';

const trendGapUrl = '/iframe.html?id=components-trendchart--gaps-and-isolated-dots&viewMode=story';
const comboGapUrl = '/iframe.html?id=components-combochart--gaps-and-dual-axis&viewMode=story';

type PagePoint = { x: number; y: number };

const pathPoints = (path: string | null, commands = 'ML'): PagePoint[] => {
  if (!path) {
    return [];
  }

  const commandPattern = new RegExp(
    `[${commands}](-?\\d+(?:\\.\\d+)?),(-?\\d+(?:\\.\\d+)?)`,
    'g'
  );

  return Array.from(path.matchAll(commandPattern), (match) => ({ x: Number(match[1]), y: Number(match[2]) }));
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
      const points = (path: SVGPathElement, commands: string) => {
        const commandPattern = new RegExp(
          `[${commands}](-?\\d+(?:\\.\\d+)?),(-?\\d+(?:\\.\\d+)?)`,
          'g'
        );

        return Array.from(path.getAttribute('d')?.matchAll(commandPattern) ?? [], (match) => ({
          x: Number(match[1]),
          y: Number(match[2])
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
          points: points(path, 'ML')
        })),
        mainPath: main
          ? {
              d: main.getAttribute('d'),
              points: points(main, 'ML')
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

  test('TrendChart connector hover keeps internal connector keys out of the tooltip', async ({ page }) => {
    await page.goto(trendGapUrl);
    await expect(page.getByRole('region', { name: 'Revenue data gaps' })).toBeVisible();

    const connector = page.locator('path.recharts-line-curve[stroke-dasharray="5 4"]').first();
    await expect(connector).toBeVisible();

    const connectorPoint = await connector.evaluate((element: SVGPathElement) => {
      const svg = element.ownerSVGElement;
      const rect = svg?.getBoundingClientRect();
      const values = element.getAttribute('d')?.match(/-?\d+(?:\.\d+)?/g)?.map(Number) ?? [];

      if (!svg || !rect || values.length < 4) {
        throw new Error('Expected a two-point connector path.');
      }

      return {
        x: rect.left + (values[0] + values[2]) / 2,
        y: rect.top + (values[1] + values[3]) / 2
      };
    });

    await page.mouse.move(connectorPoint.x, connectorPoint.y);

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

    await expect(page.locator('.recharts-yAxis line[orientation="right"]')).toHaveCount(1);

    const rightLine = page.locator('path.recharts-line-curve[name="Conversion rate"]');
    await expect(rightLine).toBeVisible();
    const rightStroke = await rightLine.getAttribute('stroke');
    const rightLineData = await rightLine.getAttribute('d');

    const rightConnectors = page.locator(
      `path.recharts-line-curve[stroke-dasharray][stroke="${rightStroke}"]`
    );
    await expect(rightConnectors).toHaveCount(2);

    const rightLinePoints = pathPoints(rightLineData, 'M');
    const connectorPaths = await rightConnectors.evaluateAll((elements) =>
      elements.map((element) => element.getAttribute('d'))
    );

    for (const path of connectorPaths) {
      for (const endpoint of pathPoints(path, 'ML')) {
        expect(
          rightLinePoints.some(
            (linePoint) => Math.abs(linePoint.x - endpoint.x) < 0.01 && Math.abs(linePoint.y - endpoint.y) < 0.01
          )
        ).toBe(true);
      }
    }

    const rightAxis = page.locator('.recharts-yAxis').filter({ has: page.locator('line[orientation="right"]') });
    await expect(rightAxis).toHaveCount(1);
  });
});
