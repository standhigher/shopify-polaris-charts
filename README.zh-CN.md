# @standhigher/charts

[![npm version](https://img.shields.io/npm/v/%40standhigher%2Fcharts.svg)](https://www.npmjs.com/package/@standhigher/charts)
[![npm downloads](https://img.shields.io/npm/dm/%40standhigher%2Fcharts.svg)](https://www.npmjs.com/package/@standhigher/charts)
[![CI](https://github.com/standhigher/shopify-polaris-charts/actions/workflows/ci.yml/badge.svg)](https://github.com/standhigher/shopify-polaris-charts/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/%40standhigher%2Fcharts.svg)](LICENSE)
[![Storybook](https://img.shields.io/badge/storybook-demo-ff4785.svg)](https://standhigher.github.io/shopify-polaris-charts/)

语言：[English](README.md) | 中文

**Polaris-style charts for Shopify App analytics and app-owned data.**

面向 Shopify App Analytics 与应用自有数据的 Polaris 风格图表组件库。

该包提供可复用的 Polaris 风格图表体验组件，包括卡片外壳、趋势图、
指标卡片、环形图、堆叠柱状图和组合图。

## 链接

- npm 包：[@standhigher/charts](https://www.npmjs.com/package/@standhigher/charts)
- Storybook 示例：[standhigher.github.io/shopify-polaris-charts](https://standhigher.github.io/shopify-polaris-charts/)
- GitHub 仓库：[standhigher/shopify-polaris-charts](https://github.com/standhigher/shopify-polaris-charts)
- API 参考：[docs/api.zh-CN.md](docs/api.zh-CN.md)
- 使用指南：[docs/usage.zh-CN.md](docs/usage.zh-CN.md)
- 更新日志：[CHANGELOG.md](CHANGELOG.md)
- 贡献指南：[CONTRIBUTING.md](CONTRIBUTING.md)
- 安全策略：[SECURITY.md](SECURITY.md)
- 行为规范：[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)

## 安装

```bash
npm install @standhigher/charts react react-dom recharts
```

## 组件概览

| 组件 | 用途 | 推荐场景 |
| --- | --- | --- |
| `ChartCard` | Polaris 风格图表卡片外壳，支持标题、副标题、指标、趋势、操作区、加载态和空态。 | 包裹所有图表，统一仪表盘卡片体验。 |
| `MetricCard` | 可访问的核心指标卡片，支持对比、趋势与加载 skeleton。 | 收入、订单、转化率、AOV、客户数。 |
| `ChartStateRegion` | 共享图表区域状态渲染器，支持 loading、empty、error/retry、skeleton 与 reveal。 | 为所有主图表保持一致状态体验。 |
| `TrendChart` | 单线或多线趋势图，用于时间序列指标。 | 收入、订单、转化率等趋势分析。 |
| `ComparisonChart` | 统一对比样式的本期与上期趋势适配器。 | 收入、订单、客户等周期对比。 |
| `ConversionChart` | 支持 ratio/percent 输入归一化与可选目标线的百分比趋势适配器。 | 店铺、结账、加购和渠道转化。 |
| `DonutChart` | 分类占比图，支持图例开关。 | 渠道、市场、来源或分群占比。 |
| `StackedBarChart` | 堆叠或分组柱状图，支持坐标轴、网格、提示框和边距配置。 | 对比不同时间或分类下的多指标。 |
| `ComboChart` | 柱状图和折线图组合。 | 同时查看数量类指标和比率类指标。 |

## 兼容性

| 依赖 | 支持范围 |
| --- | --- |
| React | `>=18` |
| React DOM | `>=18` |
| Shopify Polaris | 可选 `>=12` peer，不在运行时导入 |
| Recharts | `>=2` |
| 本地开发 Node.js | `>=20` |

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

## v0.7 基础能力

用 `ChartLocalizationProvider` 统一组件文案与展示默认值。图表或 series 的显式
`formatOptions` 优先级更高。独立 formatter 保持纯函数；只有输入已经是 0–100
百分数时，才向 `formatPercentage` 传入 `input: 'percent'`。

```tsx
<ChartLocalizationProvider locale="zh-CN" timeZone="Asia/Shanghai" currency="CNY"
  messages={{ chartEmpty: '暂无数据', retry: '重试' }}>
  <MetricCard title="收入" value={formatMoney(12400, { currency: 'CNY', locale: 'zh-CN' })} trend={{ direction: 'up', value: '+8.2%' }} />
  <TrendChart {...props} />
</ChartLocalizationProvider>
```

## v0.9 Analytics 组件

`ComparisonChart` 与 `ConversionChart` 是基于 `TrendChart` 的强类型
Analytics 适配器。使用 `AnalyticsSeries` 定义序列，`dataKey` 指向每条 datum
中的字段。对比数据必须由调用方按 X 轴预先对齐，并让同一 datum 包含两个周期
字段，例如 `{ date, currentRevenue, previousRevenue }`。数据请求、日期区间对齐、
聚合及缺失周期处理仍由业务应用负责。

`ConversionChart` 默认接收 ratio（`0.042` 显示为 `4.2%`）。只有源数据已经是
0–100 标度（例如 `4.2`）时才设置 `input="percent"`；可选 `target` 与数据使用
相同输入基准。两个组件均继承统一的 loading、empty、error/retry、skeleton、
reveal、本地化、格式化、Tooltip、坐标轴和受控 Recharts 展示配置。

```tsx
<ComparisonChart
  currentSeries={{ dataKey: 'currentRevenue', label: '本期' }}
  comparisonSeries={{ dataKey: 'previousRevenue', label: '上期' }}
  data={comparisonData}
  format="currency"
  xKey="date"
/>

<ConversionChart
  data={conversionData}
  series={[{ dataKey: 'conversion', label: '店铺转化率' }]}
  target={{ label: '目标', value: 0.05 }}
  xKey="date"
/>
```

组件库不会请求 Shopify 数据、计算 Analytics 指标、存储数据、对齐报告周期，
也不提供完整 Dashboard Framework。

## 示例与 Storybook

本地运行 Storybook 查看单个组件及组合式仪表盘：

```bash
npm run storybook
```

优先打开 `Examples/Analytics Dashboard` 查看 v0.9 Shopify App Analytics
体验：Metric Cards 依次连接收入趋势、周期对比与店铺转化视图。
`Examples/Phase One Overview` 仍保留，用于集中评审底层 `ChartCard`、
`TrendChart`、`DonutChart`、`StackedBarChart` 和 `ComboChart` 基础组件。

按图表类型查看使用建议，请阅读
[docs/usage.zh-CN.md](docs/usage.zh-CN.md)。
查看详细组件 props 和适合 AI 阅读的 API 指南，请阅读
[docs/api.zh-CN.md](docs/api.zh-CN.md)。

## 包质量

该包发布 TypeScript 类型声明、可 tree-shaking 的 ESM 产物，以及尽量精简的
npm tarball。发布内容只包含运行时构建产物、README、API 文档、使用文档、
更新日志、许可证和 npm 元数据。

CI 会在 PR 和推送到 `main` 时运行 lint、typecheck、test、package build、
Storybook build 和 `npm pack --dry-run`。

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
