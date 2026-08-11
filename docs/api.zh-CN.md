# API 参考

语言：[English](api.md) | 中文

这份文档面向 AI Agent 和代码生成器编写，重点提供稳定的 props 表格、默认值、
类型约束和生成代码时的注意事项。

## 包概览

```ts
import {
  ChartCard,
  ComboChart,
  DonutChart,
  StackedBarChart,
  TrendChart,
  chartFormatters,
  chartTheme,
  formatChartCurrency,
  formatChartDate,
  formatChartNumber,
  formatChartPercent,
  formatChartValue,
  packageName,
  packageVersion,
  type CartesianAxisOptions,
  type ChartActiveDotOptions,
  type ChartDatum,
  type ChartDotOptions,
  type ChartFormat,
  type ChartGridOptions,
  type ChartLineOptions,
  type ChartMargin,
  type ChartTheme,
  type ChartTooltipCursorOptions,
  type ChartTooltipOptions,
  type ChartValueFormatOptions,
  type ChartSeries,
  type ChartState
} from '@standhigher/charts';
```

运行时 peer dependencies：

| Package | 版本范围 | 用途 |
|---|---:|---|
| `react` | `>=18` | React 渲染运行时 |
| `react-dom` | `>=18` | React DOM 运行时 |
| `@shopify/polaris` | `>=12` | 消费端应用的设计系统 peer |
| `recharts` | `>=2` | 图表渲染引擎 |

### 入口公开导出

| Export | 类型 | 说明 |
|---|---|---|
| `ChartCard` | component | Polaris 风格仪表盘卡片外壳，内置图表状态。 |
| `TrendChart` | component | 趋势折线图或面积图。 |
| `DonutChart` | component | 用于构成占比的环形图。 |
| `StackedBarChart` | component | 用于类别组成对比的堆叠柱状图。 |
| `ComboChart` | component | 柱线组合图。 |
| `formatChartNumber` | function | 格式化可空数字。 |
| `formatChartCurrency` | function | 将可空数字格式化为货币。 |
| `formatChartPercent` | function | 将可空数字格式化为百分比。 |
| `formatChartDate` | function | 格式化日期类值。 |
| `formatChartValue` | function | 按 `ChartFormat` 分派到具体 formatter。 |
| `chartFormatters` | object | formatter helper 映射。 |
| `chartTheme` | object | 默认视觉主题。 |
| `packageName` | constant | 入口导出的包名字符串。 |
| `packageVersion` | constant | 入口导出的包版本字符串。 |
| `ChartCardProps` | type | `ChartCard` props。 |
| `TrendChartProps` | type | `TrendChart` props。 |
| `DonutChartProps` | type | `DonutChart` props。 |
| `StackedBarChartProps` | type | `StackedBarChart` props。 |
| `ComboChartProps` | type | `ComboChart` props。 |
| `ComboChartSeries` | type | `ComboChart` series 项。 |
| `ComboChartSeriesType` | type | `'bar' | 'line'`。 |
| `ChartValue` | type | 共享可空展示值。 |
| `ChartDatum` | type | 默认宽松 datum 形状。 |
| `ChartSeries` | type | 共享 series 形状。 |
| `ChartFormat` | type | 值格式 union。 |
| `ChartState` | type | `ChartCard` 状态 union。 |
| `ChartMargin` | type | Cartesian 图表 margin 选项。 |
| `CartesianAxisOptions` | type | Cartesian X/Y 轴展示选项。 |
| `ChartGridOptions` | type | Cartesian 网格线展示选项。 |
| `ChartTooltipOptions` | type | Tooltip 展示选项。 |
| `ChartTooltipCursorOptions` | type | Tooltip cursor 线条选项。 |
| `ChartLineOptions` | type | 折线和面积图点位选项。 |
| `ChartDotOptions` | type | 非 active dot 选项。 |
| `ChartActiveDotOptions` | type | hover active dot 选项。 |
| `ChartValueFormatOptions` | type | 共享 formatter options。 |
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
}

type ChartFormat = 'number' | 'currency' | 'percent' | 'compact' | 'date';

type ChartState =
  | 'loading'
  | 'empty'
  | 'error'
  | 'no-permission'
  | 'stale'
  | 'ready';

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

interface ChartTooltipOptions {
  cursor?: false | ChartTooltipCursorOptions;
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

`ChartSeries.color` 当前是 series 级别颜色，会影响整条线、整组柱子或整个堆叠
片段。当前公开 API 还不支持逐根柱子或逐个点单独设色。

这些展示选项用于受控微调图表外观，优先于业务侧写 CSS 或修改 DOM；它们映射到
稳定的 Recharts 概念，但不会开放完整 Recharts escape hatch。

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

interface ChartValueFormatOptions
  extends ChartNumberFormatOptions,
    ChartCurrencyFormatOptions,
    ChartPercentFormatOptions,
    ChartDateFormatOptions {}
```

所有 formatter helper 在输入为 `null` 或 `undefined` 时都会返回空字符串。数字类
formatter 在字符串无法通过 `Number(value)` 转成数字时也会返回空字符串。

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
| `state` | `ChartState` | Yes | - | 控制渲染 children 还是状态面板。 |
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
| `tooltip` | `ChartTooltipOptions` | No | - | Tooltip 展示选项，当前支持 `cursor`。 |
| `line` | `ChartLineOptions` | No | - | 折线和面积图的点位选项。 |
| `mode` | `'line' \| 'area'` | No | `'line'` | 图表模式。 |
| `height` | `number` | No | `280` | 图表高度，单位 px。 |
| `format` | `ChartFormat` | No | `'number'` | Y 轴、tooltip、legend 的值格式。 |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | Y 值格式化选项。 |
| `xFormat` | `ChartFormat` | No | - | X 轴和 tooltip label 格式。 |
| `xFormatOptions` | `ChartValueFormatOptions` | No | `{}` | X 值格式化选项。 |
| `emptyMessage` | `ReactNode` | No | `'No data available'` | 无可渲染数据时的空状态内容。 |

AI 生成代码时，应确保 `series[].id` 是 `data` 每项里的真实字段名。

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
| `emptyMessage` | `ReactNode` | No | `'No data available'` | 无正数值时的空状态内容。 |

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
| `tooltip` | `ChartTooltipOptions` | No | - | Tooltip 展示选项，当前支持 `cursor`。 |
| `height` | `number` | No | `280` | 图表高度，单位 px。 |
| `format` | `ChartFormat` | No | `'number'` | Y 轴、tooltip、legend 的值格式。 |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | Y 值格式化选项。 |
| `xFormat` | `ChartFormat` | No | - | X 轴和 tooltip label 格式。 |
| `xFormatOptions` | `ChartValueFormatOptions` | No | `{}` | X 值格式化选项。 |
| `emptyMessage` | `ReactNode` | No | `'No data available'` | 无可渲染数据时的空状态内容。 |

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
| `tooltip` | `ChartTooltipOptions` | No | - | Tooltip 展示选项，当前支持 `cursor`。 |
| `line` | `ChartLineOptions` | No | - | 仅作用于 line series 的点位选项。 |
| `height` | `number` | No | `280` | 图表高度，单位 px。 |
| `format` | `ChartFormat` | No | `'number'` | 基础 Y 轴、tooltip、legend 的值格式。 |
| `formatOptions` | `ChartValueFormatOptions` | No | `{}` | 基础 Y 值格式化选项。 |
| `xFormat` | `ChartFormat` | No | - | X 轴和 tooltip label 格式。 |
| `xFormatOptions` | `ChartValueFormatOptions` | No | `{}` | X 值格式化选项。 |
| `emptyMessage` | `ReactNode` | No | `'No data available'` | 无可渲染数据时的空状态内容。 |

`ComboChart` 支持基础 `format` 加一种额外 series format。额外 format 会走右侧
Y 轴。例如 base 是 `number`，折线是 `percent`。如果出现两个不同的额外格式，
组件会抛错。

## AI 组件选择规则

| 用户意图 | 推荐组件 | 数据结构 |
|---|---|---|
| 需要带标题、指标、操作和状态的仪表盘卡片 | `ChartCard` | 任意 React children |
| 查看时间趋势或有序类别走势 | `TrendChart` | 一个 X 字段加一个或多个数值字段 |
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
