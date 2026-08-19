# API 参考

语言：[English](api.md) | 中文

这份文档面向 AI Agent 和代码生成器编写，重点提供稳定的 props 表格、默认值、
类型约束和生成代码时的注意事项。

## 包概览

```ts
import {
  ChartCard,
  ChartLocalizationProvider,
  ChartRevealRegion,
  ChartSkeletonLayout,
  ChartStateRegion,
  ComboChart,
  ComparisonChart,
  ConversionChart,
  DonutChart,
  FunnelChart,
  MetricCard,
  StackedBarChart,
  TrendChart,
  chartFormatters,
  chartTheme,
  createAnalyticsSeries,
  formatCompactNumber,
  formatDate,
  formatMoney,
  formatNumber,
  formatPercentage,
  formatChartCurrency,
  formatChartDate,
  formatChartNumber,
  formatChartPercent,
  formatChartValue,
  normalizePercentageData,
  normalizeFunnelData,
  packageName,
  packageVersion,
  revenueTrendPreset,
  orderTrendPreset,
  conversionTrendPreset,
  customerTrendPreset,
  upsellConversionPreset,
  funnelPreset,
  type AnalyticsSeries,
  type CartesianAxisOptions,
  type ComparisonChartProps,
  type ConversionChartProps,
  type ConversionTarget,
  type FunnelChartProps,
  type FunnelDatum,
  type FunnelPercentageInput,
  type AnalyticsAxisPreset,
  type AnalyticsFunnelPreset,
  type AnalyticsSeriesPreset,
  type AnalyticsTrendPreset,
  type PercentageInput,
  type ChartActiveDotOptions,
  type ChartDatum,
  type ChartDotOptions,
  type ChartFormat,
  type ChartGridOptions,
  type ChartCardState,
  type ChartContentState,
  type ChartLineOptions,
  type ChartMargin,
  type ChartTheme,
  type ChartTooltipContentProps,
  type ChartTooltipContentRenderer,
  type ChartTooltipCursorOptions,
  type ChartTooltipOptions,
  type ChartTooltipPayloadItem,
  type ChartValueFormatOptions,
  type ChartSeries,
  type ChartRevealOptions,
  type ChartSkeletonOptions,
  type ChartStateRegionProps,
  type ChartLocalizationProviderProps,
  type MetricCardProps,
  type MetricCardTrend
} from '@standhigher/charts';
```

运行时 peer dependencies：

| Package | 版本范围 | 用途 |
|---|---:|---|
| `react` | `>=18` | React 渲染运行时 |
| `react-dom` | `>=18` | React DOM 运行时 |
| `@shopify/polaris` | 可选 `>=12` | 消费端应用的设计系统 peer；本包没有运行时 import |
| `recharts` | `>=2` | 图表渲染引擎 |

### 入口公开导出

| Export | 类型 | 说明 |
|---|---|---|
| `ChartCard` | component | Polaris 风格仪表盘卡片外壳，内置图表状态。 |
| `MetricCard` | component | 支持对比、趋势和 loading skeleton 的可访问 KPI 卡片。 |
| `ChartLocalizationProvider` | component | 为组件文案和图表格式默认值提供 React Context。 |
| `ChartStateRegion` | component | 共享图表区域 loading、empty、error/retry、skeleton 与 reveal 渲染器。 |
| `ChartSkeletonLayout` | component | 仪表盘级 skeleton 容器，支持图表区域独立 reveal。 |
| `ChartRevealRegion` | component | 区域包装组件，未 ready 时显示区域 skeleton，ready 后显示 children。 |
| `TrendChart` | component | 趋势折线图或面积图。 |
| `ComparisonChart` | component | 基于 `TrendChart` 的本期与对比周期适配器。 |
| `ConversionChart` | component | 基于 `TrendChart` 的 ratio/百分比趋势适配器，支持可选目标线。 |
| `FunnelChart` | component | 每阶段展示数量、转化率和流失率的可访问垂直漏斗。 |
| `DonutChart` | component | 用于构成占比的环形图。 |
| `StackedBarChart` | component | 用于类别组成对比的堆叠柱状图。 |
| `ComboChart` | component | 柱线组合图。 |
| `createAnalyticsSeries` | function | 将 `AnalyticsSeries` 定义转换为共享 `ChartSeries`。 |
| `normalizePercentageData` | function | 不可变地将选中的 percent 字段归一化为 ratio。 |
| `normalizeFunnelData` | function | 不可变地归一化漏斗 conversion 与 drop-off 字段。 |
| `revenueTrendPreset`、`orderTrendPreset`、`conversionTrendPreset`、`customerTrendPreset`、`upsellConversionPreset`、`funnelPreset` | constant | 可 tree-shaking 的 Shopify Analytics 展示预设。 |
| `formatChartNumber` | function | 格式化可空数字。 |
| `formatChartCurrency` | function | 将可空数字格式化为货币。 |
| `formatChartPercent` | function | 将可空数字格式化为百分比。 |
| `formatChartDate` | function | 格式化日期类值。 |
| `formatChartValue` | function | 按 `ChartFormat` 分派到具体 formatter。 |
| `formatNumber` | function | 标准数字展示的规范 formatter。 |
| `formatCompactNumber` | function | 紧凑数字展示的规范 formatter。 |
| `formatMoney` | function | 货币展示的规范 formatter。 |
| `formatPercentage` | function | 支持明确输入基准的规范百分比 formatter。 |
| `formatDate` | function | 日期展示的规范 formatter。 |
| `chartFormatters` | object | formatter helper 映射。 |
| `chartTheme` | object | 默认视觉主题。 |
| `packageName` | constant | 入口导出的包名字符串。 |
| `packageVersion` | constant | 入口导出的包版本字符串。 |
| `ChartCardProps` | type | `ChartCard` props。 |
| `TrendChartProps` | type | `TrendChart` props。 |
| `AnalyticsSeries` | type | Analytics 适配器使用的 datum 字段序列定义。 |
| `PercentageInput` | type | 输入基准：`'ratio' | 'percent'`。 |
| `ComparisonChartProps` | type | `ComparisonChart` props。 |
| `ConversionChartProps` | type | `ConversionChart` props。 |
| `ConversionTarget` | type | 可选转化目标线定义。 |
| `FunnelChartProps` | type | `FunnelChart` props。 |
| `FunnelDatum` | type | 有序垂直漏斗阶段契约。 |
| `FunnelPercentageInput` | type | 漏斗百分比基准：`'ratio' | 'percent'`。 |
| `AnalyticsAxisPreset`、`AnalyticsFunnelPreset`、`AnalyticsSeriesPreset`、`AnalyticsTrendPreset` | type | 展示预设契约。 |
| `DonutChartProps` | type | `DonutChart` props。 |
| `StackedBarChartProps` | type | `StackedBarChart` props。 |
| `ComboChartProps` | type | `ComboChart` props。 |
| `TrendChartRechartsProps` | type | `TrendChart` 的受控 Recharts props。 |
| `StackedBarChartRechartsProps` | type | `StackedBarChart` 的受控 Recharts props。 |
| `ComboChartRechartsProps` | type | `ComboChart` 的受控 Recharts props。 |
| `ComboChartSeries` | type | `ComboChart` series 项。 |
| `ComboChartSeriesType` | type | `'bar' | 'line'`。 |
| `ChartValue` | type | 共享可空展示值。 |
| `ChartDatum` | type | 默认宽松 datum 形状。 |
| `ChartSeries` | type | 共享 series 形状。 |
| `ChartFormat` | type | 值格式 union。 |
| `ChartCardState` | type | 卡片级状态 union。 |
| `ChartContentState` | type | 共享图表区域状态 union。 |
| `ChartState` | type | `ChartCardState` 的已弃用别名。 |
| `ChartInlineState` | type | `ChartContentState` 的已弃用别名。 |
| `ChartSkeletonOptions` | type | 共享图表区域 skeleton 选项。 |
| `ChartRevealOptions` | type | 共享图表区域 reveal 选项。 |
| `ChartStateRegionProps` | type | `ChartStateRegion` props。 |
| `ChartLocalizationProviderProps` | type | `ChartLocalizationProvider` props。 |
| `ChartMessages` | type | 可本地化组件文案 key。 |
| `ChartLocalizationValue` | type | 解析后的本地化 Context 值。 |
| `MetricCardProps` | type | `MetricCard` props。 |
| `MetricCardTrend` | type | `MetricCard` 的趋势语义。 |
| `MetricCardState` | type | `'loading' | 'ready'`。 |
| `MetricTrendDirection` | type | `'down' | 'neutral' | 'up'`。 |
| `MetricTrendTone` | type | `'negative' | 'neutral' | 'positive'`。 |
| `ChartMargin` | type | Cartesian 图表 margin 选项。 |
| `CartesianAxisOptions` | type | Cartesian X/Y 轴展示选项。 |
| `ChartGridOptions` | type | Cartesian 网格线展示选项。 |
| `ChartTooltipOptions` | type | Tooltip 展示选项。 |
| `ChartTooltipContentProps` | type | Cartesian 自定义 tooltip content 的上下文。 |
| `ChartTooltipContentRenderer` | type | Cartesian 自定义 tooltip 组件或渲染函数。 |
| `ChartTooltipPayloadItem` | type | 带有对应 chart series 信息的 tooltip payload 项。 |
| `ChartTooltipCursorOptions` | type | Tooltip cursor 线条选项。 |
| `ChartLineOptions` | type | 折线和面积图点位选项。 |
| `ChartDotOptions` | type | 非 active dot 选项。 |
| `ChartActiveDotOptions` | type | hover active dot 选项。 |
| `ChartValueFormatOptions` | type | 共享 formatter options。 |
| `FormatNumberOptions` | type | `formatNumber` 的选项。 |
| `FormatCompactNumberOptions` | type | `formatCompactNumber` 的选项。 |
| `FormatMoneyOptions` | type | `formatMoney` 的选项。 |
| `FormatPercentageOptions` | type | `formatPercentage` 的选项。 |
| `FormatDateOptions` | type | `formatDate` 的选项。 |
| `ChartTheme` | type | `chartTheme` 的形状。 |

## 共享类型

```ts
type ChartValue = string | number | Date | null | undefined;

interface ChartDatum {
  label?: string;
  value?: ChartValue;
  date?: string | number | Date;
}

interface ChartSeries<TDatum extends object = ChartDatum> {
  id: string;
  label: string;
  data: TDatum[];
  color?: string;
  opacity?: number;
  strokeDasharray?: string | number;
  strokeWidth?: number;
}

type ChartFormat = 'number' | 'currency' | 'percent' | 'compact' | 'date';

type ChartCardState =
  | 'loading'
  | 'empty'
  | 'error'
  | 'no-permission'
  | 'stale'
  | 'ready';

type ChartContentState = 'loading' | 'empty' | 'error' | 'ready';

interface ChartSkeletonOptions {
  label?: ReactNode;
  lineCount?: number;
}

interface ChartRevealOptions {
  active?: boolean;
  delayMs?: number;
  durationMs?: number;
  label?: ReactNode;
}

interface ChartMargin {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

interface CartesianAxisOptions {
  domain?: [number | 'auto', number | 'auto'];
  ticks?: Array<number | string>;
  tickColor?: string;
  tickFontSize?: number;
  axisLine?: boolean;
  tickLine?: boolean;
  minTickGap?: number;
  interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
  width?: number;
}

interface ChartGridOptions {
  horizontal?: boolean;
  vertical?: boolean;
  stroke?: string;
  strokeDasharray?: string;
}

interface ChartTooltipCursorOptions {
  stroke?: string;
  strokeDasharray?: string;
  strokeWidth?: number;
  fill?: string;
}

interface ChartTooltipPayloadItem<TDatum, TSeries> {
  color?: string;
  data?: TDatum;
  dataKey?: string;
  name?: string;
  series?: TSeries;
  value?: ChartValue;
}

interface ChartTooltipContentProps<TDatum, TSeries> {
  active?: boolean;
  label?: ChartValue;
  payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>;
  series: Array<TSeries>;
  format: ChartFormat;
  formatOptions: ChartValueFormatOptions;
  xFormat?: ChartFormat;
  xFormatOptions: ChartValueFormatOptions;
  formatLabel: (label: ChartValue, payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>) => ReactNode;
  formatValue: (value: ChartValue, series?: TSeries) => ReactNode;
}

type ChartTooltipContentRenderer<TDatum, TSeries> =
  (props: ChartTooltipContentProps<TDatum, TSeries>) => ReactNode;

interface ChartTooltipOptions<TDatum, TSeries> {
  cursor?: false | ChartTooltipCursorOptions;
  content?: ChartTooltipContentRenderer<TDatum, TSeries>;
  labelFormatter?: (label: ChartValue, payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>) => ReactNode;
  valueFormatter?: (value: ChartValue, series?: TSeries) => ReactNode;
  minWidth?: number;
  className?: string;
}

interface ChartDotOptions {
  className?: string;
  cx?: number;
  cy?: number;
  r?: number | string;
  clipDot?: boolean;
}

interface ChartActiveDotOptions extends ChartDotOptions {
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

interface ChartLineOptions {
  dot?: boolean | ChartDotOptions;
  activeDot?: boolean | ChartActiveDotOptions;
}
```

`ChartState` 仍保留为 `ChartCardState` 的已弃用别名。`ChartInlineState`、
`TrendChartSkeletonOptions` 和 `TrendChartRevealOptions` 会在 v1.0 前继续作为
对应共享类型的已弃用别名保留。

`ChartSeries.color` 当前是 series 级别颜色，会影响整条线、整组柱子或整个堆叠
片段。`ChartSeries.strokeDasharray`、`strokeWidth` 和 `opacity` 可用于单条折线或
面积图 series 的视觉覆盖，例如 current 为实线、previous 为虚线。当前公开 API 还不支持
逐根柱子或逐个点单独设色。

`content` 可拿到 active 状态、label、带匹配 series 的 payload、全部 series 与图表
format 配置。它支持 React 组件或渲染函数；自定义内容可调用 `formatLabel` 和
`formatValue` 复用内置的兜底格式化。`ComboChart` 的 payload series 会保留各自的
`format` 与 `formatOptions`。

不传 `content` 时仍使用内置 Polaris 风格 tooltip。`labelFormatter` 用于其 label，
`valueFormatter` 用于每项 value，`minWidth` 和 `className` 作用于其内部容器。这些
选项映射到稳定的 Recharts 概念，但不会开放完整 Recharts escape hatch。

### 受控 Recharts props

`TrendChart`、`StackedBarChart` 和 `ComboChart` 提供受控的 `rechartsProps`
escape hatch，用于常规图表 props 尚未表达的 Recharts 视觉参数。其类型基于对应的
Recharts 组件 props，并移除了内部绑定字段。

```ts
interface TrendChartRechartsProps {
  chart?: Omit<ComponentProps<typeof LineChart>, 'children' | 'data' | 'dataKey' | 'layout'>;
  xAxis?: Omit<ComponentProps<typeof XAxis>, 'children' | 'dataKey' | 'tickFormatter' | 'type' | 'xAxisId' | 'yAxisId'>;
  yAxis?: Omit<ComponentProps<typeof YAxis>, 'children' | 'dataKey' | 'tickFormatter' | 'type' | 'xAxisId' | 'yAxisId'>;
  tooltip?: Omit<ComponentProps<typeof Tooltip>, 'axisId' | 'content' | 'formatter' | 'labelFormatter'>;
  cartesianGrid?: Omit<ComponentProps<typeof CartesianGrid>, 'children' | 'xAxisId' | 'yAxisId'>;
  line?: Omit<ComponentProps<typeof Line>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stroke' | 'type' | 'xAxisId' | 'yAxisId'>;
  area?: Omit<ComponentProps<typeof Area>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stackId' | 'stroke' | 'type' | 'xAxisId' | 'yAxisId'>;
}

interface StackedBarChartRechartsProps extends Omit<TrendChartRechartsProps, 'area' | 'line'> {
  bar?: Omit<ComponentProps<typeof Bar>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stroke' | 'stackId' | 'xAxisId' | 'yAxisId'>;
}

interface ComboChartRechartsProps extends Omit<TrendChartRechartsProps, 'area'> {
  bar?: Omit<ComponentProps<typeof Bar>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stroke' | 'stackId' | 'xAxisId' | 'yAxisId'>;
}
```

`chart.margin` 的优先级高于图表组件顶层 `margin`。用户的安全视觉 props 会覆盖组件
默认值。库始终控制图表 `data`、轴绑定/类型和 formatter、tooltip 轴/内容/formatter，以及
series 的 `dataKey`、`name`、`fill`、`stroke`、`type`、`stackId` 和 `yAxisId`。即使
调用方绕过 TypeScript，运行时也会移除这些受保护字段。此 API 有意不支持 tooltip
custom content。

如需自定义 tooltip 内容，请使用顶层 `tooltip.content`。`rechartsProps.tooltip`
有意不接受 custom content，以保留图表的 tooltip 数据和格式化集成。

## 本地化与图表区域状态

### `ChartLocalizationProvider`

`ChartLocalizationProvider` 只负责组件文案和格式化默认值；它不负责数据请求、
业务计算或 dashboard 编排。

```ts
interface ChartMessages {
  chartEmpty: ReactNode;
  chartError: ReactNode;
  chartLoading: ReactNode;
  chartNoPermission: ReactNode;
  chartPreparing: ReactNode;
  chartStale: ReactNode;
  funnelConversion: ReactNode;
  funnelDropOff: ReactNode;
  funnelStage: ReactNode;
  funnelValue: ReactNode;
  metricLoading: ReactNode;
  retry: ReactNode;
}

interface ChartLocalizationProviderProps {
  children: ReactNode;
  currency?: string;
  locale?: string;
  messages?: Partial<ChartMessages>;
  timeZone?: string;
}
```

默认 Context 为 `locale: 'en-US'`、`currency: 'USD'` 和英文文案。Provider 可以嵌套：
未传的值继承上层，`messages` 按 key 合并。图表值的优先级是显式的图表或 series
`formatOptions`，然后是 Provider 的 `locale` / `currency` / `timeZone`，最后才是内置
默认值。独立 formatter 是纯函数，不读取 React Context；请直接传入其
`locale`、`currency` 或 `timeZone` 选项。

### `ChartStateRegion`

`ChartStateRegion` 是 `TrendChart`、`ComboChart`、`StackedBarChart` 和
`DonutChart` 和 `FunnelChart` 使用的共享图表区域渲染器，也可以包裹自定义图表内容。

| Prop | Type | Required | Default | 说明 |
|---|---|---:|---|---|
| `children` | `ReactNode` | Yes | - | ready 状态的图表内容。 |
| `state` | `ChartContentState` | No | `'ready'` | `loading`、`empty`、`error` 或 `ready`。 |
| `emptyMessage` | `ReactNode` | No | 本地化 `chartEmpty` | 空状态内容。 |
| `errorMessage` | `ReactNode` | No | - | 错误补充说明。 |
| `loadingLabel` | `ReactNode` | No | 本地化 `chartLoading` | 可访问 loading 文案。 |
| `onRetry` | `() => void` | No | - | error 状态展示重试按钮。 |
| `retryLabel` | `ReactNode` | No | 本地化 `retry` | 重试按钮文案。 |
| `retryAction` | `ReactNode` | No | - | 自定义错误操作，优先于默认重试按钮。 |
| `skeleton` | `boolean \| ChartSkeletonOptions` | No | - | skeleton 选项，`lineCount` 默认是 `3`。 |
| `reveal` | `boolean \| ChartRevealOptions` | No | - | ready 内容遮罩，支持 `active`、`delayMs`、`durationMs` 和 `label`。 |
| `minHeight` | `number` | No | - | 状态面板最小高度。 |

四个主图都提供上表所列的一致状态 props。显式传入的 `loading`、`empty` 或 `error`
优先；默认 `ready` 但没有可渲染数值时，会自动解析为 `empty`。loading 使用 status
role，error 使用 assertive alert 和可选重试操作，reveal 会遵守减少动态效果偏好。

## MetricCard

`MetricCard` 用于收入、订单、转化率、AOV 或客户数等已经格式化的 KPI。它只负责展示，
不计算比较值或趋势。

```ts
type MetricCardState = 'loading' | 'ready';
type MetricTrendDirection = 'down' | 'neutral' | 'up';
type MetricTrendTone = 'negative' | 'neutral' | 'positive';

interface MetricCardTrend {
  accessibilityLabel?: string;
  direction: MetricTrendDirection;
  tone?: MetricTrendTone;
  value: ReactNode;
}

interface MetricCardProps {
  comparison?: ReactNode;
  loadingLabel?: ReactNode;
  state?: MetricCardState;
  title: ReactNode;
  trend?: MetricCardTrend;
  value: ReactNode;
}
```

`state="loading"` 会用可访问 skeleton 替换数值区域；未传 `loadingLabel` 时使用本地化的
`metricLoading`。趋势的 `direction` 会被辅助技术播报，`tone` 独立控制颜色，因此可表达
“成本下降是正向”这类场景。

## 格式化

### Formatter option 类型

```ts
interface ChartNumberFormatOptions {
  locale?: string;
  notation?: 'standard' | 'compact';
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

interface ChartCurrencyFormatOptions {
  locale?: string;
  currency?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

interface ChartPercentFormatOptions {
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

interface ChartDateFormatOptions {
  locale?: string;
  timeZone?: string;
}

type FormatNumberOptions = Omit<ChartNumberFormatOptions, 'notation'>;
type FormatCompactNumberOptions = Omit<ChartNumberFormatOptions, 'notation'>;
type FormatMoneyOptions = ChartCurrencyFormatOptions;
type FormatDateOptions = ChartDateFormatOptions;

interface FormatPercentageOptions extends ChartPercentFormatOptions {
  input?: 'percent' | 'ratio';
}

interface ChartValueFormatOptions
  extends ChartNumberFormatOptions,
    ChartCurrencyFormatOptions,
    ChartPercentFormatOptions,
    ChartDateFormatOptions {}
```

所有 formatter helper 在输入为 `null` 或 `undefined` 时都会返回空字符串。数字类
formatter 在字符串无法通过 `Number(value)` 转成数字时也会返回空字符串。

### 规范展示 formatter

新 UI 代码使用以下名称。它们是纯 `Intl` 包装函数，因此 locale 相关选项必须直接传入，
不会读取 `ChartLocalizationProvider`。

```ts
formatNumber(9876.543, { locale: 'en-US' }); // "9,876.54"
formatCompactNumber(9876543, { locale: 'en-US' }); // "9.9M"
formatMoney(12400, { currency: 'CNY', locale: 'zh-CN' }); // "¥12,400.00"
formatPercentage(0.082); // "8.2%"（默认 ratio 输入）
formatPercentage(8.2, { input: 'percent' }); // "8.2%"
formatDate('2026-07-20', { locale: 'en-GB', timeZone: 'UTC' }); // "20 Jul 2026"
```

`formatPercentage` 要明确输入基准：`0.082` 这类比例值使用默认的 `input: 'ratio'`；
只有数据本身已经在 0–100 范围时才使用 `input: 'percent'`。
`formatCompactNumber` 总是使用 compact notation；未传选项时 `formatMoney` 默认
使用 `en-US` 和 `USD`。

### 旧 formatter 兼容策略

`formatChartNumber`、`formatChartCurrency`、`formatChartPercent`、
`formatChartDate`、`formatChartValue` 和 `chartFormatters` 会继续导出并保持 v0.6
行为，但已经标为 deprecated。它们没有运行时 warning，并会在 v1.0 前继续支持。
新展示代码应迁移到上面的规范名称；当需要按 `ChartFormat` union 分派时，仍可使用
`formatChartValue`。

### `formatChartNumber(value, options)`

通过 `Intl.NumberFormat` 格式化可空数字。默认 locale 是 `en-US`，最多 2 位小数，
默认使用 standard notation。

```ts
formatChartNumber(9876.543); // "9,876.54"
formatChartNumber(9876543, { notation: 'compact' }); // "9.9M"
```

### `formatChartCurrency(value, options)`

将可空数字格式化为货币。默认 locale 是 `en-US`，默认 currency 是 `USD`。

```ts
formatChartCurrency(12400); // "$12,400.00"
formatChartCurrency(12400, { currency: 'CNY', locale: 'zh-CN' }); // "¥12,400.00"
```

### `formatChartPercent(value, options)`

将可空数字格式化为百分比。比例值应传小数，`0.082` 会显示为 `8.2%`。

```ts
formatChartPercent(0.082); // "8.2%"
```

### `formatChartDate(value, options)`

通过 `Intl.DateTimeFormat` 格式化可空的 `string | number | Date`。默认输出包含
`year`、短 `month` 和数字 `day`。

```ts
formatChartDate('2026-07-20'); // "Jul 20, 2026"
```

### `formatChartValue(value, format, options)`

按 `ChartFormat` 选择具体 formatter，通常用于 axis tick、metric、legend 和
tooltip。

```ts
formatChartValue(12400, 'currency'); // "$12,400.00"
formatChartValue(0.082, 'percent'); // "8.2%"
formatChartValue(12400, 'compact'); // "12K"
```

图表组件里使用 `formatOptions` 控制数值格式，使用 `xFormatOptions` 控制类别或
日期格式。

### `chartFormatters`

```ts
const chartFormatters = {
  currency: formatChartCurrency,
  date: formatChartDate,
  number: formatChartNumber,
  percent: formatChartPercent,
  value: formatChartValue
};
```

## ChartCard

`ChartCard` 是 Polaris 风格仪表盘卡片外壳，用来承载标题、指标、筛选器、操作和
图表状态。

| Prop | Type | Required | Default | 说明 |
|---|---|---:|---|---|
| `title` | `ReactNode` | Yes | - | 卡片标题，也是无障碍 region label。 |
| `subtitle` | `ReactNode` | No | - | 标题下方的辅助说明。 |
| `metric` | `ReactNode` | No | - | 大号核心指标。 |
| `trendLabel` | `ReactNode` | No | - | 指标旁边的趋势文本，默认正向绿色样式。 |
| `actions` | `ReactNode` | No | - | 右侧操作控件。 |
| `filters` | `ReactNode` | No | - | 右侧筛选控件，位于 `actions` 前面。 |
| `state` | `ChartCardState` | Yes | - | 控制渲染 children 还是状态面板。 |
| `errorMessage` | `ReactNode` | No | - | 仅 `state="error"` 时展示的额外错误信息。 |
| `children` | `ReactNode` | No | - | 仅 `state="ready"` 时展示的图表内容。 |

## TrendChart

`TrendChart` 用于时间序列或有序类别趋势，支持 `line` 和 `area` 模式。

| Prop | Type | Required | Default | 说明 |
|---|---|---:|---|---|
| `title` | `ReactNode` | No | - | 图表上方标题。 |
| `data` | `TDatum[]` | Yes | - | 图表级数据源。 |
| `xKey` | `keyof TDatum & string` | Yes | - | X 轴字段。 |
| `series` | `Array<ChartSeries<TDatum>>` | Yes | - | 折线或面积图 series 定义。 |
| `showLegend` | `boolean` | No | `true` | 控制是否渲染组件内置 legend。 |
| `margin` | `ChartMargin` | No | - | Cartesian 图表的 Recharts margin。 |
| `xAxis` | `CartesianAxisOptions` | No | - | X 轴展示选项，例如 tick 样式、轴线、刻度线、interval、minTickGap。 |
| `yAxis` | `CartesianAxisOptions` | No | - | Y 轴展示选项，例如 domain、ticks、width、tick 样式、轴线、刻度线。 |
| `grid` | `ChartGridOptions` | No | - | 网格线方向和线条样式。 |
| `tooltip` | `ChartTooltipOptions<TDatum>` | No | - | Tooltip cursor、默认内容格式化与样式，或自定义内容。 |
| `line` | `ChartLineOptions` | No | - | 折线和面积图的点位选项。 |
| `rechartsProps` | `TrendChartRechartsProps` | No | - | 图表、轴、tooltip、网格、折线和面积图的受控 Recharts 视觉 props。`chart.margin` 覆盖 `margin`。 |
| `mode` | `'line' \| 'area'` | No | `'line'` | 图表模式。 |
| `height` | `number` | No | `280` | 图表高度，单位 px。 |
| `format` | `ChartFormat` | No | `'number'` | Y 轴、tooltip、legend 的值格式。 |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | Y 值格式化选项。 |
| `xFormat` | `ChartFormat` | No | - | X 轴和 tooltip label 格式。 |
| `xFormatOptions` | `ChartValueFormatOptions` | No | `{}` | X 值格式化选项。 |
| `emptyMessage` | `ReactNode` | No | 本地化 `chartEmpty` | 无可渲染数据时的空状态内容。 |
| `state` | `ChartContentState` | No | `'ready'` | 图表区域状态。适合 `TrendChart` 嵌入已有业务卡片时使用。 |
| `errorMessage` | `ReactNode` | No | - | 图表区域 error 面板的补充说明。 |
| `onRetry` | `() => void` | No | - | 传入后在 error 面板渲染重试按钮。 |
| `retryLabel` | `ReactNode` | No | 本地化 `retry` | 重试按钮文案。 |
| `retryAction` | `ReactNode` | No | - | 自定义错误操作，优先于 `onRetry` 和 `retryLabel`。 |
| `loadingLabel` | `ReactNode` | No | 本地化 `chartLoading` | 图表 skeleton 的可访问文案。 |
| `skeleton` | `boolean \| ChartSkeletonOptions` | No | - | 图表 skeleton 选项，例如 `lineCount` 和自定义 label。 |
| `reveal` | `boolean \| ChartRevealOptions` | No | - | 保持图表挂载，并在图表区域上方显示 reveal overlay。 |

AI 生成代码时，应确保 `series[].id` 是 `data` 每项里的真实字段名。

Revenue current/previous 虚线对比示例：

```tsx
<TrendChart
  data={data}
  format="currency"
  series={[
    { id: 'current', label: 'Current period', data, color: '#008060' },
    {
      id: 'previous',
      label: 'Previous period',
      data,
      color: '#6d7175',
      opacity: 0.72,
      strokeDasharray: '4 4',
      strokeWidth: 2
    }
  ]}
  xKey="date"
/>;
```

图表区域 error/retry 示例：

```tsx
<TrendChart
  data={data}
  errorMessage="Revenue API unavailable"
  onRetry={reloadRevenue}
  retryLabel="Try again"
  state="error"
  xKey="date"
  series={[{ id: 'current', label: 'Current period', data }]}
/>;
```

图表区域 loading/reveal 示例：

```tsx
<TrendChart
  data={data}
  loadingLabel="Loading revenue trend"
  state="loading"
  xKey="date"
  series={[{ id: 'current', label: 'Current period', data }]}
/>;

<TrendChart
  data={data}
  reveal={{ active: isPreparing, label: 'Preparing chart', durationMs: 240 }}
  xKey="date"
  series={[{ id: 'current', label: 'Current period', data }]}
/>;
```

## ChartSkeletonLayout 和 ChartRevealRegion

当一个 dashboard 中多个图表依赖不同 API，需要分区逐步 reveal 时使用。

| Component | Prop | Type | Required | Default | 说明 |
|---|---|---:|---:|---|---|
| `ChartSkeletonLayout` | `ariaLabel` | `string` | No | `'Charts loading'` | 仪表盘 loading 容器的可访问标签。 |
| `ChartSkeletonLayout` | `children` | `ReactNode` | Yes | - | reveal regions 或图表卡片。 |
| `ChartSkeletonLayout` | `columns` | `number \| string` | No | - | Grid 列模板。数字会映射为 `repeat(n, minmax(0, 1fr))`；字符串会直接使用。 |
| `ChartSkeletonLayout` | `gap` | `number \| string` | No | `16` | Grid 间距。数字按 px 处理。 |
| `ChartSkeletonLayout` | `className` | `string` | No | - | layout wrapper 的可选 className。 |
| `ChartSkeletonLayout` | `style` | `CSSProperties` | No | - | 可选内联样式覆盖。 |
| `ChartRevealRegion` | `label` | `string` | Yes | - | 区域可访问标签，也是默认 skeleton 文案前缀。 |
| `ChartRevealRegion` | `ready` | `boolean` | Yes | - | 为 true 时渲染 children，否则显示区域 skeleton。 |
| `ChartRevealRegion` | `children` | `ReactNode` | Yes | - | ready 后展示的内容。 |
| `ChartRevealRegion` | `skeleton` | `ReactNode` | No | - | 自定义区域 skeleton 内容。 |
| `ChartRevealRegion` | `mode` | `'replace' \| 'overlay'` | No | `'replace'` | `replace` 用 skeleton 替换 children；`overlay` 会让 children 保持挂载，并在上方显示 skeleton overlay。 |
| `ChartRevealRegion` | `minHeight` | `number` | No | `220` | loading 时区域最小高度，单位 px。 |
| `ChartRevealRegion` | `className` | `string` | No | - | region wrapper 的可选 className。 |
| `ChartRevealRegion` | `style` | `CSSProperties` | No | - | 可选内联样式覆盖。 |

```tsx
<ChartSkeletonLayout ariaLabel="Revenue dashboard loading" columns={2} gap={20}>
  <ChartRevealRegion label="Revenue chart" mode="overlay" ready={revenueReady}>
    <TrendChart {...revenueChartProps} />
  </ChartRevealRegion>
  <ChartRevealRegion label="Orders chart" ready={ordersReady}>
    <TrendChart {...ordersChartProps} />
  </ChartRevealRegion>
</ChartSkeletonLayout>
```

当 API 未 ready 前不希望挂载图表，使用默认 `mode="replace"`。当希望真实图表保持
挂载、避免 skeleton 结束后重新测量或动画闪动时，使用 `mode="overlay"`。

Analytics 风格示例：

```tsx
<TrendChart
  data={data}
  format="currency"
  grid={{ horizontal: true, vertical: false, stroke: '#e5e7eb', strokeDasharray: '3 3' }}
  line={{ dot: false, activeDot: { r: 3, strokeWidth: 0 } }}
  margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
  series={[{ id: 'grossSales', label: 'Gross sales', data }]}
  showLegend={false}
  tooltip={{ cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' } }}
  xAxis={{ axisLine: false, tickLine: false, minTickGap: 0 }}
  xKey="date"
  yAxis={{ domain: [0, 800], ticks: [0, 200, 400, 600, 800], width: 56 }}
/>;
```

### Tooltip 定制示例

```tsx
function RevenueTooltip({ active, formatLabel, formatValue, label, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="analytics-tooltip">
      <strong>{formatLabel(label)}</strong>
      {payload.map((item) => (
        <div key={item.series?.id}>
          {item.series?.label}: {formatValue(item.value, item.series)}
        </div>
      ))}
    </div>
  );
}

<TrendChart
  data={data}
  format="currency"
  series={[{ id: 'grossSales', label: 'Gross sales', data }]}
  tooltip={{
    cursor: { stroke: '#9ca3af', strokeDasharray: '3 3' },
    content: RevenueTooltip,
    labelFormatter: (label) => `日期：${label}`,
    valueFormatter: (value, series) => `${series?.label}: ${value}`,
    minWidth: 180,
    className: 'analytics-tooltip'
  }}
  xKey="date"
/>;
```

## DonutChart

`DonutChart` 用于少量部分占整体的分布。

| Prop | Type | Required | Default | 说明 |
|---|---|---:|---|---|
| `title` | `ReactNode` | No | - | 图表上方标题。 |
| `data` | `TDatum[]` | Yes | - | 切片数据源。 |
| `categoryKey` | `keyof TDatum & string` | Yes | - | 切片名称和 legend label 字段。 |
| `valueKey` | `keyof TDatum & string` | Yes | - | 正数值字段。 |
| `centerLabel` | `ReactNode` | No | - | 环形图中心内容。 |
| `showLegend` | `boolean` | No | `true` | 控制是否渲染组件内置 legend。 |
| `height` | `number` | No | `280` | 图表高度，单位 px。 |
| `format` | `ChartFormat` | No | `'number'` | tooltip 和 legend 的值格式。 |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | 值格式化选项。 |
| `emptyMessage` | `ReactNode` | No | 本地化 `chartEmpty` | 无正数值时的空状态内容。 |
| `state` | `ChartContentState` | No | `'ready'` | 共享图表区域状态；ready 但无正数值时会解析为 empty。 |
| `errorMessage` | `ReactNode` | No | - | error 面板的补充说明。 |
| `onRetry` | `() => void` | No | - | error 面板展示重试按钮。 |
| `retryLabel` | `ReactNode` | No | 本地化 `retry` | 重试按钮文案。 |
| `retryAction` | `ReactNode` | No | - | 自定义错误操作，优先于 `onRetry` 和 `retryLabel`。 |
| `loadingLabel` | `ReactNode` | No | 本地化 `chartLoading` | skeleton 的可访问文案。 |
| `skeleton` | `boolean \| ChartSkeletonOptions` | No | - | skeleton 线条选项。 |
| `reveal` | `boolean \| ChartRevealOptions` | No | - | ready 内容遮罩选项。 |

`valueKey` 必须对应正数或数字字符串；0、负数、空值和非数字会被过滤。

## StackedBarChart

`StackedBarChart` 用于同时比较类别总量和组成。

| Prop | Type | Required | Default | 说明 |
|---|---|---:|---|---|
| `title` | `ReactNode` | No | - | 图表上方标题。 |
| `data` | `TDatum[]` | Yes | - | 图表级数据源。 |
| `xKey` | `keyof TDatum & string` | Yes | - | X 轴类别字段。 |
| `series` | `Array<ChartSeries<TDatum>>` | Yes | - | 堆叠片段 series 定义。 |
| `showLegend` | `boolean` | No | `true` | 控制是否渲染组件内置 legend。 |
| `margin` | `ChartMargin` | No | - | Cartesian 图表的 Recharts margin。 |
| `xAxis` | `CartesianAxisOptions` | No | - | X 轴展示选项，例如 tick 样式、轴线、刻度线、interval、minTickGap。 |
| `yAxis` | `CartesianAxisOptions` | No | - | Y 轴展示选项，例如 domain、ticks、width、tick 样式、轴线、刻度线。 |
| `grid` | `ChartGridOptions` | No | - | 网格线方向和线条样式。 |
| `tooltip` | `ChartTooltipOptions<TDatum>` | No | - | Tooltip cursor、默认内容格式化与样式，或自定义内容。 |
| `rechartsProps` | `StackedBarChartRechartsProps` | No | - | 图表、轴、tooltip、网格和柱状图的受控 Recharts 视觉 props。`chart.margin` 覆盖 `margin`。 |
| `height` | `number` | No | `280` | 图表高度，单位 px。 |
| `format` | `ChartFormat` | No | `'number'` | Y 轴、tooltip、legend 的值格式。 |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | Y 值格式化选项。 |
| `xFormat` | `ChartFormat` | No | - | X 轴和 tooltip label 格式。 |
| `xFormatOptions` | `ChartValueFormatOptions` | No | `{}` | X 值格式化选项。 |
| `emptyMessage` | `ReactNode` | No | 本地化 `chartEmpty` | 无可渲染数据时的空状态内容。 |
| `state` | `ChartContentState` | No | `'ready'` | 共享图表区域状态；ready 但无可渲染数值时会解析为 empty。 |
| `errorMessage` | `ReactNode` | No | - | error 面板的补充说明。 |
| `onRetry` | `() => void` | No | - | error 面板展示重试按钮。 |
| `retryLabel` | `ReactNode` | No | 本地化 `retry` | 重试按钮文案。 |
| `retryAction` | `ReactNode` | No | - | 自定义错误操作，优先于 `onRetry` 和 `retryLabel`。 |
| `loadingLabel` | `ReactNode` | No | 本地化 `chartLoading` | skeleton 的可访问文案。 |
| `skeleton` | `boolean \| ChartSkeletonOptions` | No | - | skeleton 线条选项。 |
| `reveal` | `boolean \| ChartRevealOptions` | No | - | ready 内容遮罩选项。 |

`series[].color` 会改变某个堆叠片段在所有类别中的颜色。当前 API 不支持同一个
series 在不同类别下使用不同颜色。

## ComboChart

`ComboChart` 用于把相关的柱状指标和折线指标放在一起阅读。

```ts
type ComboChartSeriesType = 'bar' | 'line';

interface ComboChartSeries<TDatum extends object = ChartDatum>
  extends ChartSeries<TDatum> {
  type: ComboChartSeriesType;
  format?: ChartFormat;
  formatOptions?: ChartValueFormatOptions;
}
```

| Prop | Type | Required | Default | 说明 |
|---|---|---:|---|---|
| `title` | `ReactNode` | No | - | 图表上方标题。 |
| `data` | `TDatum[]` | Yes | - | 图表级数据源。 |
| `xKey` | `keyof TDatum & string` | Yes | - | X 轴字段。 |
| `series` | `Array<ComboChartSeries<TDatum>>` | Yes | - | 柱状和折线 series 定义。 |
| `showLegend` | `boolean` | No | `true` | 控制是否渲染组件内置 legend。 |
| `margin` | `ChartMargin` | No | - | Cartesian 图表的 Recharts margin。 |
| `xAxis` | `CartesianAxisOptions` | No | - | X 轴展示选项，例如 tick 样式、轴线、刻度线、interval、minTickGap。 |
| `yAxis` | `CartesianAxisOptions` | No | - | Y 轴展示选项，例如 domain、ticks、width、tick 样式、轴线、刻度线。 |
| `grid` | `ChartGridOptions` | No | - | 网格线方向和线条样式。 |
| `tooltip` | `ChartTooltipOptions<TDatum, ComboChartSeries<TDatum>>` | No | - | Tooltip cursor、默认内容格式化与样式，或可读取每个 series format 的自定义内容。 |
| `line` | `ChartLineOptions` | No | - | 仅作用于 line series 的点位选项。 |
| `rechartsProps` | `ComboChartRechartsProps` | No | - | 图表、轴、tooltip、网格、柱状和折线 series 的受控 Recharts 视觉 props。`chart.margin` 覆盖 `margin`。 |
| `height` | `number` | No | `280` | 图表高度，单位 px。 |
| `format` | `ChartFormat` | No | `'number'` | 基础 Y 轴、tooltip、legend 的值格式。 |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | 基础 Y 值格式化选项。 |
| `xFormat` | `ChartFormat` | No | - | X 轴和 tooltip label 格式。 |
| `xFormatOptions` | `ChartValueFormatOptions` | No | `{}` | X 值格式化选项。 |
| `emptyMessage` | `ReactNode` | No | 本地化 `chartEmpty` | 无可渲染数据时的空状态内容。 |
| `state` | `ChartContentState` | No | `'ready'` | 共享图表区域状态；ready 但无可渲染数值时会解析为 empty。 |
| `errorMessage` | `ReactNode` | No | - | error 面板的补充说明。 |
| `onRetry` | `() => void` | No | - | error 面板展示重试按钮。 |
| `retryLabel` | `ReactNode` | No | 本地化 `retry` | 重试按钮文案。 |
| `retryAction` | `ReactNode` | No | - | 自定义错误操作，优先于 `onRetry` 和 `retryLabel`。 |
| `loadingLabel` | `ReactNode` | No | 本地化 `chartLoading` | skeleton 的可访问文案。 |
| `skeleton` | `boolean \| ChartSkeletonOptions` | No | - | skeleton 线条选项。 |
| `reveal` | `boolean \| ChartRevealOptions` | No | - | ready 内容遮罩选项。 |

`ComboChart` 支持基础 `format` 加一种额外 series format。额外 format 会走右侧
Y 轴。例如 base 是 `number`，折线是 `percent`。如果出现两个不同的额外格式，
组件会抛错。

## Analytics 组件

### `AnalyticsSeries<TDatum>`

```ts
interface AnalyticsSeries<TDatum extends object> {
  dataKey: keyof TDatum & string;
  label: string;
  color?: string;
  opacity?: number;
  strokeDasharray?: string | number;
  strokeWidth?: number;
}

type PercentageInput = 'ratio' | 'percent';
```

`dataKey` 指向每条 datum 中的数值字段。Analytics 适配器保留 `TrendChart`
统一的状态、本地化、格式化、Tooltip、坐标轴、网格、边距、skeleton、reveal、
retry 及受控 Recharts 展示属性。

### `createAnalyticsSeries(data, definition)`

```ts
function createAnalyticsSeries<TDatum extends object>(
  data: TDatum[],
  definition: AnalyticsSeries<TDatum>
): ChartSeries<TDatum>;
```

返回的 `ChartSeries` 以 `definition.dataKey` 作为 `id`，保留原始 `data` 数组
引用，并复制定义中的 label 及可选展示字段。该函数不会复制、对齐或转换 datum。

### `normalizePercentageData(data, dataKeys, input)`

```ts
function normalizePercentageData<TDatum extends object>(
  data: TDatum[],
  dataKeys: ReadonlyArray<keyof TDatum & string>,
  input: PercentageInput
): TDatum[];
```

当 `input: 'ratio'` 时，原样返回输入数组引用。当 `input: 'percent'` 时，返回
逐行浅拷贝的新数组，并将选中字段中的有限数值除以 100。非选中字段，以及选中
字段中的 `null`、字符串、日期、非有限数值或其他非数值内容保持不变；函数不会
修改调用方 datum。

### `ComparisonChart<TDatum>`

`ComparisonChartProps<TDatum>` 继承除 `series` 外的 `TrendChartProps<TDatum>`，
并要求传入 `currentSeries` 与 `comparisonSeries`。本期序列始终在前；对比序列
未显式配置时默认使用 `opacity: 0.64` 与 `strokeDasharray: '6 4'`，显式值
（包括零）会被保留。

调用方必须按 X 轴预先对齐周期，并让同一 datum 同时包含两个周期字段：

```ts
type RevenueDatum = {
  date: string;
  currentRevenue: number | null;
  previousRevenue: number | null;
};
```

组件不负责请求、聚合、日期平移、周期对齐或决定缺失值策略。

### `ConversionChart<TDatum>`

```ts
interface ConversionTarget {
  color?: string;
  label: string;
  value: number;
}
```

`ConversionChartProps<TDatum>` 接收 `data`、一个或多个 `AnalyticsSeries`、
可选 `input` 和可选 `target`。`input` 默认是 `'ratio'`，因此 `0.042` 显示为
`4.2%`；使用 `input="percent"` 时，`4.2` 显示为 `4.2%`。目标线与数据使用
相同输入基准，默认显示为中性虚线。percent 归一化不会修改调用方数据，并保留
非选中字段、`Date`、字符串、`null`、零以及负数的语义。

这些组件仅负责展示：Shopify API 请求、Analytics 指标计算、数据存储、聚合、
周期对齐及完整 Dashboard Framework 均不在组件库范围内。

### `FunnelChart`

```ts
interface FunnelDatum {
  id: string;
  label: ReactNode;
  value: number;
  conversion?: number;
  dropOff?: number;
}

type FunnelPercentageInput = 'ratio' | 'percent';
```

`FunnelChart` 按调用方原始顺序，为每条 datum 渲染一个语义化有序列表项。`id`
必须稳定且唯一。label 可为任意 `ReactNode`；数量、转化率和流失率始终以文本显示，
并在鼠标或键盘 tooltip 中重复展示。零值是有效阶段，仍保留最小可见轮廓；缺失
百分比显示为 `—`。

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|---|---|---:|---|---|
| `data` | `FunnelDatum[]` | 是 | - | 调用方预先计算并排序的漏斗阶段。 |
| `title` | `ReactNode` | 否 | - | 可选漏斗标题。 |
| `colors` | `readonly string[]` | 否 | 主题色板 | 按顺序循环使用的阶段颜色。 |
| `format` | `ChartFormat` | 否 | `'number'` | 阶段数量格式。 |
| `formatOptions` | `ChartValueFormatOptions` | 否 | 本地化默认值 | 数量与百分比展示选项。 |
| `percentageInput` | `'ratio' \| 'percent'` | 否 | `'ratio'` | 转化率与流失率输入基准。 |
| `height` | `number` | 否 | `360` | ready/state 区域最小高度。 |
| `state`、`emptyMessage`、`errorMessage`、`loadingLabel`、`onRetry`、`retryLabel`、`retryAction`、`skeleton`、`reveal` | 共享状态属性 | 否 | 共享默认值 | loading、empty、error/retry、skeleton 与 reveal。 |

`normalizeFunnelData(data, percentageInput)` 在 ratio 输入时返回原数组；percent
输入时逐行浅拷贝，并把有限数值的 `conversion` 与 `dropOff` 除以 100，不修改
调用方数据。组件不会排序阶段、推导转化/流失率，也不提供其他方向布局。

### Shopify Analytics 展示预设

包导出 `revenueTrendPreset`、`orderTrendPreset`、`conversionTrendPreset`、
`customerTrendPreset`、`upsellConversionPreset` 与 `funnelPreset`。这些冻结且可
tree-shaking 的对象只包含展示信息：序列标签/颜色/线条样式、格式建议，或漏斗
颜色与输入基准；不会包含 `dataKey`、数据、请求、聚合或业务计算。

趋势预设实现 `AnalyticsTrendPreset`，漏斗预设实现 `AnalyticsFunnelPreset`。
请把 `currentSeries` 与 `comparisonSeries` 映射到具体 datum 的
`AnalyticsSeries`，再通过对象展开做局部覆盖。`axis` 是展示建议，不是组件 prop。

## AI 组件选择规则

| 用户意图 | 推荐组件 | 数据结构 |
|---|---|---|
| 需要带标题、指标、操作和状态的仪表盘卡片 | `ChartCard` | 任意 React children |
| 查看时间趋势或有序类别走势 | `TrendChart` | 一个 X 字段加一个或多个数值字段 |
| 查看商品、结账或加购的有序转化阶段 | `FunnelChart` | 调用方预先计算的有序 `FunnelDatum[]` |
| 查看占比或构成 | `DonutChart` | 一个类别字段加一个正数值字段 |
| 比较类别总量及组成 | `StackedBarChart` | 一个类别字段加多个数值片段字段 |
| 同时查看 volume 和 rate | `ComboChart` | 一个 X 字段加 bar/line series 字段 |

## AI 生成代码通用规则

1. 图表级 `data` 和每个 `series[].data` 建议传同一个数组。
2. `xKey`、`categoryKey`、`valueKey`、`series[].id` 必须匹配真实字段名。
3. 金额用 `format="currency"`，比例用 `format="percent"`，紧凑指标用
   `format="compact"`。
4. 日期 X 轴用 `xFormat="date"`。
5. 仪表盘场景优先用 `ChartCard state="ready"` 包裹图表。
6. 在卡片中给图表稳定的 `height`，避免布局跳动。
