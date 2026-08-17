# 图表使用指南

语言：[English](usage.md) | 中文

`@standhigher/charts` 提供第一阶段的 Polaris 风格图表基础组件，面向
Shopify App 仪表盘场景。你可以通过 Storybook 总览，在接近真实仪表盘密度的
静态示例数据中对比这些组件。

## ChartCard

使用 `ChartCard` 作为图表或紧凑分析视图的标准仪表盘卡片外壳。它适合统一承载
标题、副标题、核心指标、趋势标签、筛选器、操作入口，以及 loading、empty、
stale、permission 和 error 等状态。

## TrendChart

当用户需要查看随时间变化的数据时使用 `TrendChart`，例如按日展示 gross sales、
net sales、sessions、orders 或 customer count。需要直接比较时使用 line 模式；
希望整体走势更突出时使用 area 模式。

Revenue 当前周期 vs 上一周期对比时，把线型配置放在单条 series 上：current 保持
实线，previous 使用虚线。

```tsx
<TrendChart
  data={data}
  format="currency"
  series={[
    { id: 'current', label: 'Current period', data, color: '#008060' },
    { id: 'previous', label: 'Previous period', data, color: '#6d7175', strokeDasharray: '4 4', opacity: 0.72 }
  ]}
  xKey="date"
/>
```

当图表嵌入已有业务卡片时，使用 `TrendChart` 的图表区域状态，不要用 `ChartCard`
状态替换整张卡片：

```tsx
<TrendChart
  data={data}
  errorMessage="Revenue API unavailable"
  onRetry={reloadRevenue}
  retryLabel="Try again"
  state="error"
  xKey="date"
  series={[{ id: 'current', label: 'Current period', data }]}
/>
```

`state="loading"` 会显示折线图 skeleton；如果希望真实图表保持挂载、只在上层盖一层
过渡遮罩，使用 `reveal`。

## DonutChart

使用 `DonutChart` 展示少量部分占整体的类别，例如流量来源占比、订单状态占比，
或按计划类型拆分的收入。类别数量应保持克制，避免图例在仪表盘卡片中过于拥挤。

## StackedBarChart

当需要同时比较类别总量和组成时使用 `StackedBarChart`，例如按销售渠道展示
fulfilled、pending 和 returned orders。它最适合每个类别共享同一组 series
定义的场景。

## ComboChart

当两个相关指标需要一起阅读时使用 `ComboChart`，例如订单量和转化率。通常用柱形
表示 volume，用折线表示 rate 或 benchmark，这样可以看出关系，同时避免暗示两个
指标使用同一刻度。

## 共享图表状态

`TrendChart`、`ComboChart`、`StackedBarChart` 和 `DonutChart` 都提供相同的图表区域
状态契约：`state`、`emptyMessage`、`errorMessage`、`loadingLabel`、`onRetry`、
`retryLabel`、`skeleton` 和 `reveal`。显式传入的 `loading`、`empty` 或 `error` 优先；
默认 `state="ready"` 时，没有可渲染数值会自动解析为空状态。

```tsx
<DonutChart
  categoryKey="source"
  data={trafficSources}
  errorMessage="无法加载流量来源"
  onRetry={reloadTrafficSources}
  retryLabel="重试"
  state="error"
  valueKey="visits"
/>
```

通过 `skeleton={{ lineCount: 4, label: '正在加载订单' }}` 调整 loading 文案和密度。
希望 ready 内容保持挂载、在短暂遮罩下 reveal 时，使用
`reveal={{ active: isRefreshing, label: '正在准备图表' }}`。状态 UI 具备可访问的
status/alert role，并遵守减少动态效果偏好。

## MetricCard

`MetricCard` 适合精简的、已经格式化的 KPI。它有意不计算收入、转化率、比较值或趋势，
这些展示值由应用提供。

```tsx
import { MetricCard, formatMoney, formatPercentage } from '@standhigher/charts';

<MetricCard
  comparison="对比前 30 天"
  title="收入"
  trend={{ direction: 'up', value: '+8.2%' }}
  value={formatMoney(12400, { currency: 'CNY', locale: 'zh-CN' })}
/>

<MetricCard
  state="loading"
  title="转化率"
  value={formatPercentage(0)}
/>
```

`trend.direction` 可取 `up`、`down` 或 `neutral`，并会被辅助技术播报。业务含义与方向不同时，
单独设置 `trend.tone`；例如成本下降可使用 `direction: 'down'` 与 `tone: 'positive'`。

## 本地化文案与格式化

`ChartLocalizationProvider` 为图表提供组件文案以及默认 `locale`、`currency`、
`timeZone`；它不是数据或业务逻辑 Provider。显式图表或 `ComboChart` series 的
`formatOptions` 优先于 Provider；Provider 又优先于内置 `en-US` 和 `USD` 默认值。

```tsx
<ChartLocalizationProvider
  currency="CNY"
  locale="zh-CN"
  messages={{ chartEmpty: '暂无数据', chartError: '图表加载失败', retry: '重试' }}
  timeZone="Asia/Shanghai"
>
  <TrendChart format="currency" {...revenueChartProps} />
</ChartLocalizationProvider>
```

独立 formatter 是纯函数，不读取 Provider。新展示代码优先使用 `formatMoney`、
`formatPercentage`、`formatNumber`、`formatCompactNumber` 和 `formatDate`。
`formatPercentage` 默认把输入当作比例（`0.082` 显示为 `8.2%`）；只有数据已经是
`8.2` 这类 0–100 百分数时才指定 `input: 'percent'`。

旧的 `formatChart*` helpers 和 `chartFormatters` 仍兼容，但已在 v1.0 前弃用。
只有需要按旧 `ChartFormat` 分派时才继续使用它们。

## Dashboard 分区 reveal

当一个 dashboard 中多个图表依赖不同 API，需要独立完成、独立显示时，使用
`ChartSkeletonLayout` 和 `ChartRevealRegion`。

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

如果图表需要保持挂载，并在 reveal 期间只覆盖 skeleton，使用 `mode="overlay"`。
如果希望 API ready 前完全不挂载图表，使用默认 `mode="replace"`。

## 受控 Recharts props

`TrendChart`、`StackedBarChart` 和 `ComboChart` 提供聚焦的 `rechartsProps`
escape hatch，用于当前常规组件 props 未覆盖的小范围视觉调整；它不是替换组件数据模型
或自定义 tooltip 内容的接口。

```tsx
<TrendChart
  data={data}
  rechartsProps={{
    chart: { margin: { left: -8 } },
    xAxis: { minTickGap: 0 },
    yAxis: { width: 56 },
    tooltip: { cursor: { strokeDasharray: '3 3' } },
    cartesianGrid: { vertical: false },
    line: { activeDot: { r: 3 } },
    area: { fillOpacity: 0.18 }
  }}
  series={[{ id: 'grossSales', label: 'Gross sales', data }]}
  xKey="date"
/>
```

`rechartsProps.chart.margin` 的优先级高于顶层 `margin`。图表 `data`、轴的
`dataKey`/formatter、tooltip 内容和 formatter，以及 series 的 `dataKey`、`name`、
颜色、类型、堆叠和轴 ID 仍由库控制。`ComboChart` 使用 `bar` 和 `line` 分别调整
对应类型的系列。

## 本地预览

运行 Storybook 查看示例：

```bash
npm run storybook
```

然后打开 `Examples/Phase One Overview` story。

`Components/ChartStateRegion` 与 `Components/MetricCard` story 展示新的状态和
可访问性行为。

查看详细 props、默认值和适合 AI 阅读的实现指引，请阅读 [api.zh-CN.md](api.zh-CN.md)。
