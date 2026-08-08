# @standhigher/charts

语言：[English](README.md) | 中文

面向 Shopify App 仪表盘的 Polaris 风格 React 图表组件库。

该包提供可复用的 Polaris 风格图表体验组件，包括卡片外壳、趋势图、
环形图、堆叠柱状图和组合图。

## 安装

```bash
npm install @standhigher/charts react react-dom @shopify/polaris recharts
```

## 基础用法

```tsx
import { ChartCard, TrendChart } from '@standhigher/charts';

const data = [
  { date: '2026-07-20', grossSales: 18342.8 },
  { date: '2026-07-21', grossSales: 19218.1 }
];

export function RevenueCard() {
  return (
    <ChartCard title="Revenue trend" subtitle="Sample period" metric="$37.6K" state="ready">
      <TrendChart
        data={data}
        format="currency"
        series={[{ id: 'grossSales', label: 'Gross sales', data }]}
        xFormat="date"
        xKey="date"
      />
    </ChartCard>
  );
}
```

## 示例与 Storybook

本地运行 Storybook 查看单个组件示例，以及用于产品和设计评审的第一阶段总览：

```bash
npm run storybook
```

打开 `Examples/Phase One Overview`，即可在接近 Shopify App 仪表盘密度的
静态示例数据中查看 `ChartCard`、`TrendChart`、`DonutChart`、
`StackedBarChart` 和 `ComboChart`。

按图表类型查看使用建议，请阅读
[docs/usage.zh-CN.md](docs/usage.zh-CN.md)。

## 本地开发

从锁文件安装依赖：

```bash
npm ci
```

开发时运行测试：

```bash
npm run test
npm run test:watch
```

打开或更新 PR 前运行完整本地质量门禁。以下命令与 CI 工作流保持一致：

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm run build-storybook
npm pack --dry-run
```

Storybook 也可用于本地预览：

```bash
npm run storybook
```

## 发布准备

该包已按 `@standhigher/charts` 准备手动发布到 npm。它使用
`@standhigher` scope，并将 `publishConfig.access` 设置为 `public`，
因此真实发布时必须以公开 scoped package 的方式发布到 npmjs：
`https://registry.npmjs.org/`。

发布前，请确认 npm 账号拥有 `@standhigher` scope 的发布权限，然后运行本地发布门禁：

```bash
npm config get registry
npm run lint
npm run test
npm run typecheck
npm run build
npm run build-storybook
npm pack --dry-run --registry=https://registry.npmjs.org/
```

调用 `npm publish` 时，`prepublishOnly` 脚本会自动运行相同的 lint、test、
typecheck、build 和 Storybook build 检查。该仓库采用手动发布审核流程；
在包名、scope 权限、版本、dry-run 打包内容和 npm dist-tag 都被明确确认前，
不要发布。
