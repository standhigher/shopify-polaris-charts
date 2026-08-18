# Analytics Roadmap v0.9.0–v1.0.0 Design

## 定位与基线

`@standhigher/charts` 是面向 Shopify App 自有数据分析场景的 Polaris 风格
Analytics 图表组件库。业务应用负责请求、存储、对齐和计算数据；组件库负责将已经
准备好的数据转换为一致、可访问、可响应的 Analytics UI。

当前基线为 `v0.8.0`。`v0.7.0` 已交付统一 Chart State API、`MetricCard`、
`ChartLocalizationProvider` 和展示 Formatter；`v0.8.0` 已交付 `retryAction` 与
黑白默认 Retry 按钮。后续规划不重复这些能力。

## 版本路线

| 版本 | 目标 | 核心交付 |
|---|---|---|
| `v0.9.0` | Analytics Components | `ComparisonChart`、`ConversionChart`、共享 Analytics 呈现能力、组合 Demo |
| `v0.10.0` | Shopify Analytics 场景 | 垂直 `FunnelChart`、Analytics Presets、完整 Dashboard Pattern、性能基线 |
| `v1.0.0` | Production Ready | API 冻结、SSR/Hydration、A11y、Responsive、性能、兼容矩阵和完整文档 |

## 边界

路线内不包含 Shopify API 请求、Analytics 数据存储、指标计算、日期对齐、完整
Dashboard Framework、大量新增基础图表类型、重写 Recharts 或强依赖 Polaris
React。Presets 只能提供展示配置，不得推断字段、请求数据或计算业务指标。

---

## v0.9.0：Analytics Components

### 0.9-1 Analytics 数据契约

定义 Comparison、Conversion、Tooltip、Legend 和时间区间的公共语义。此任务是
`0.9-2`、`0.9-3` 和 `0.9-4` 的前置任务。

Comparison 使用同一 datum 的当前周期与对比周期字段：

```ts
interface RevenueComparisonDatum {
  date: string;
  currentRevenue: number | null;
  previousRevenue: number | null;
}
```

API 使用明确的一对一 Series 映射：

```tsx
<ComparisonChart
  currentSeries={{dataKey: 'currentRevenue', label: 'Current period'}}
  comparisonSeries={{dataKey: 'previousRevenue', label: 'Previous period'}}
  data={data}
  xKey="date"
/>
```

业务侧负责把上一周期数据对齐到当前周期的 `xKey`。缺失值使用 `null`；组件不插值、
不拼接两组数据、不计算同比或环比。v0.9 只支持一个当前周期和一个对比周期。

Conversion 默认接收 ratio，例如 `0.042` 展示为 `4.2%`；percent 输入必须通过显式
选项声明。组件不根据 visits 和 orders 计算转化率。

验收点：

- 类型能表达当前/对比字段、时间字段、空值和格式化选项。
- Tooltip 固定按当前周期、对比周期排列。
- 当前周期默认实线，对比周期默认虚线和较低透明度。
- 数据契约中不存在 Shopify API 类型或业务计算函数。

### 0.9-2 ComparisonChart

新增 `ComparisonChart`，复用现有 Cartesian、格式化、本地化和 Chart State 能力。

范围：

- 同比和环比的当前周期/对比周期趋势。
- 折线与面积展示模式。
- 当前值与对比值 Tooltip、Legend 和 Axis。
- 颜色、格式、时间区间标签和受控 Recharts 呈现配置。
- Loading、Empty、Error、Retry、`retryAction`、Skeleton、Reveal。

验收点：

- 两个周期正常、部分缺失、全空和长度不一致场景均有测试。
- 组件不计算变化率，也不自动修改输入数据。
- Tooltip、Legend 和 Axis 使用一致的 locale、currency、timeZone。
- 自定义 Series 配置不能覆盖受保护的数据绑定。

### 0.9-3 ConversionChart

新增语义化 `ConversionChart`，优先复用 `TrendChart`，不复制一套 Cartesian 实现。

范围：

- 单条或多条 Conversion Series。
- ratio 默认格式及显式 percent 输入。
- 可选目标线或基准线。
- Percentage Tooltip、Axis 和 Legend 默认值。
- 完整 Chart State API。

验收点：

- `0.042` 默认展示为 `4.2%`。
- 多 Series、目标线、零值、空值和负值规则均有测试。
- 目标线与数据线在视觉和可访问名称上可区分。
- 组件不接收原始订单/访问量并在内部计算转化率。

### 0.9-4 共享 Analytics 呈现能力

提取 Comparison 与 Conversion 共同使用的内部能力：Analytics Tooltip 行、周期标识、
目标线语义、Percentage 默认值、时间区间标签和无障碍文案。保持内部 API，除非至少
两个公共组件确实需要消费者配置同一能力。

验收点：

- `TrendChart`、`ComparisonChart` 和 `ConversionChart` 不复制状态处理逻辑。
- Tooltip 与 Legend 的格式化优先级一致。
- 公共 API 不暴露不必要的 Recharts 内部对象。

### 0.9-5 Analytics Dashboard Demo

新增组合 Story，展示 Revenue、Orders、Conversion Rate 三个 `MetricCard`，以及
Revenue Trend、Order Comparison 和 Conversion Trend。使用静态 Shopify App 场景数据。

验收点：

- Ready、Loading、Empty、Error 和局部 Retry 均有可访问示例。
- 320px 窄容器和多列桌面布局可用。
- 示例展示组件组合，不引入数据请求或 Dashboard Framework。

### 0.9-6 文档与发布

更新中英文 README、API、Usage、Storybook 和 CHANGELOG；执行全量测试、类型检查、
Lint、库构建、Storybook 构建、npm pack 检查和基础 Tree-shaking smoke test后发布。

---

## v0.10.0：Shopify Analytics 场景

### 0.10-1 Funnel 数据契约

Funnel MVP 使用垂直布局，数组顺序即阶段顺序：

```ts
interface FunnelDatum {
  id: string;
  label: ReactNode;
  value: number;
  conversion?: number;
  dropOff?: number;
}
```

业务侧负责计算 `conversion` 和 `dropOff`。`value: 0` 是合法阶段；缺失数值不得被
组件自动推算。v0.10 不提供 `orientation` 属性，也不承诺水平布局。

### 0.10-2 FunnelChart

新增垂直 `FunnelChart`，展示 Stage、Value、Conversion 和 Drop-off，并支持 Tooltip、
Formatter、颜色、Localization、完整 Chart State、Responsive 与 Accessibility。

优先场景：Product view → Add to cart → Checkout → Purchase，以及 Offer shown →
Offer accepted。

验收点：

- 阶段顺序稳定，零值、重复标签、长标签和窄容器行为明确。
- 信息不只通过面积或颜色表达。
- 组件不计算漏斗指标，也不重排阶段。

### 0.10-3 Analytics Presets

提供 `revenueTrendPreset`、`orderTrendPreset`、`conversionTrendPreset`、
`customerTrendPreset`、`upsellConversionPreset` 和 `funnelPreset`。

Preset 只能包含 Formatter、颜色、Series 样式、Tooltip/Legend 文案和 Axis 建议；支持
消费者局部覆盖，可 Tree-shake，不增加 Shopify 运行时依赖。

### 0.10-4 Dashboard Patterns

新增完整 Shopify App Analytics Dashboard 示例，覆盖 Revenue、Orders、Conversion
Rate、AOV、Customers、Upsell Conversion 和 Funnel，以及日期切换、局部 Error、
部分 Empty、多列 Skeleton 和 Progressive Reveal。

### 0.10-5 产品定位与文档

README 首屏使用：

> Polaris-style charts for Shopify App analytics and app-owned data.

展示顺序为 Metric Cards → Trend → Comparison → Conversion → Funnel，并明确业务应用
拥有数据、请求和计算职责。

### 0.10-6 性能基线与发布

建立 5/10/20 个图表、100/500/1000 个时间点的初次渲染、数据更新、bundle size 和
内存趋势基线。此版本修复明显问题，但最终性能门槛在 v1.0 冻结。

---

## v1.0.0：Production Ready

### 1.0-1 公共 API 审计与冻结

审查 Props、State、Formatter、Series、Preset、默认值、空值语义、Recharts 透传和所有
Deprecated API。交付 v1 API 清单、Breaking Changes、Migration Guide 和删除计划。

### 1.0-2 SSR 与 Hydration

承诺范围为“SSR-safe and hydration-safe interactive client components”，不承诺图表
作为 React Server Component 直接渲染。

验收点：

- 无 `window` 环境 import 和 `renderToString` 不抛错。
- 服务端与客户端首次 DOM 结构一致，无 hydration mismatch。
- `matchMedia`、ResizeObserver、尺寸测量和动画只在客户端 effect 后执行。
- Next.js App Router 通过 Client Component 使用图表。
- Formatter 是纯函数，可用于 Server Component。

评估增加 `@standhigher/charts/formatters` 子路径，使纯 Formatter 与客户端组件边界更
清晰，并改善 Tree-shaking。

### 1.0-3 Accessibility

完成 Region 标题、Tooltip 键盘策略、Legend、状态播报、Funnel 非视觉信息、颜色
对比度和 Reduced Motion 审计。v1 前必须决定 SVG 图表是否提供数据摘要或表格替代。

### 1.0-4 Responsive 与主题稳定性

验证 320px、768px、1280px 容器，长标题、长 Legend、多语言、高数值、负数、多列
Dashboard 和截图场景。不建设完整 Theme Provider，只稳定现有 Theme API。

### 1.0-5 性能与 Tree-shaking

验证组件和 Preset 独立 Tree-shaking、Context 更新范围、多图表重复计算、Dashboard
渲染与更新基准。建立可重复的发布性能门槛。

### 1.0-6 兼容矩阵与 CI

公开支持矩阵：

| 维度 | v1 支持范围 |
|---|---|
| 浏览器 | Chrome、Edge、Firefox、macOS Safari、iOS Safari 最新两个版本；Chrome Android 最新版 |
| React | `>=18.3 <20`，CI 覆盖 18.3.x 与 19.2.x |
| Recharts | `>=3 <4` |
| TypeScript | `>=5.4` |
| Node | 20.x、22.x、24.x，用于开发、构建和 SSR 测试 |
| Framework | Vite 稳定版；Next.js App Router Client Component smoke test |

不支持 IE、老旧 Android WebView、React 16/17 或 Recharts 2。v0.9 和 v0.10 暂时保留
Recharts 2 的 legacy 声明并增加 smoke test；如新组件依赖 Recharts 3 能力，v1 通过
Migration Guide 正式移除 Recharts 2。

浏览器 CI 使用 Playwright Chromium 作为主测试，WebKit 验证 Safari/SVG/响应式，
Firefox 执行基础 smoke test。

### 1.0-7 完整文档与发布

交付完整 Storybook、API Reference、Usage、Shopify Analytics Patterns、Migration
Guide、Upgrade Guide、CHANGELOG、Release Checklist、包内容验证和回滚流程。

---

## 依赖顺序

```text
0.9-1
├── 0.9-2
├── 0.9-3
└── 0.9-4
     ↓
   0.9-5 → 0.9-6
     ↓
   0.10-1
   ├── 0.10-2
   └── 0.10-3
        ↓
      0.10-4 + 0.10-5 → 0.10-6
        ↓
      1.0-1
      ├── 1.0-2
      ├── 1.0-3
      ├── 1.0-4
      ├── 1.0-5
      └── 1.0-6
           ↓
         1.0-7
```

## 发布原则

每个任务使用独立设计与实施计划；同一版本的组件任务可以并行，但版本发布任务必须
等待全部前置任务完成。每个版本都通过全量测试、类型检查、Lint、构建、Storybook、
npm pack 和公开 API 检查。v1.0 额外要求兼容矩阵、SSR、浏览器和性能门禁全部通过。
