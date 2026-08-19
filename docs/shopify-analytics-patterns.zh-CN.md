# Shopify App Analytics 模式

将组件库作为展示边界：

```text
Shopify/API 数据 -> 业务应用请求、对齐、计算 -> @standhigher/charts -> Recharts
```

- KPI：使用六个 `MetricCard` 展示 Revenue、Orders、Conversion Rate、AOV、
  Customers、Upsell Conversion。
- Trend：`TrendChart` 配合展示 Preset。
- Comparison：同一 datum 包含当前周期与对比周期字段，由 `ComparisonChart`
  渲染；周期对齐由业务应用负责。
- Conversion：调用方计算 ratio 或 percent，再交给 `ConversionChart`；目标线
  使用相同输入基准。
- Funnel：调用方提供已计算且有序的阶段，`FunnelChart` 采用垂直布局展示。

每张卡保留独立状态，局部错误不应覆盖已就绪的指标或其他图表。提供有语义的
重试标签或自定义 `retryAction`。无障碍场景提供简洁 label；需要原始值时，由
业务应用传入语义表格。不要把 Shopify 请求、存储、聚合、归因、业务结论或完整
Dashboard Framework 放进组件库。
