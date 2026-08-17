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

## Dashboard 分区 reveal

当一个 dashboard 中多个图表依赖不同 API，需要独立完成、独立显示时，使用
`ChartSkeletonLayout` 和 `ChartRevealRegion`。

```tsx
<ChartSkeletonLayout ariaLabel="Revenue dashboard loading">
  <ChartRevealRegion label="Revenue chart" ready={revenueReady}>
    <TrendChart {...revenueChartProps} />
  </ChartRevealRegion>
  <ChartRevealRegion label="Orders chart" ready={ordersReady}>
    <TrendChart {...ordersChartProps} />
  </ChartRevealRegion>
</ChartSkeletonLayout>
```

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

查看详细 props、默认值和适合 AI 阅读的实现指引，请阅读 [api.zh-CN.md](api.zh-CN.md)。
