# 迁移到 v1

## 支持矩阵

`@standhigher/charts@1` 支持 React / React DOM `>=18.3 <20`、Recharts
`>=3 <4`，以及现代主流 Chrome、Firefox、Safari、Edge。开发与发布脚本支持
Node.js `>=20 <25`；类型声明使用 TypeScript 5.4.5 和仓库当前版本验证。

```bash
npm install @standhigher/charts@^1 react@^18.3 react-dom@^18.3 recharts@^3
```

也支持 React 19，请保持 React 与 React DOM 版本一致。

## 必须升级 Recharts 3

v1 不再支持 Recharts 2。请先将业务应用升级至 Recharts 3，再安装本主版本。
组件库仍负责数据绑定、Tooltip 内容、Series/Stack/Axis 标识与无障碍层；
`rechartsProps` 只用于文档中允许的展示属性。

## SSR 与框架

包在服务端导入和渲染阶段不会读取浏览器全局变量。Next.js App Router 中，
基于 Recharts 的交互图表仍应放在带 `'use client'` 的客户端组件内。服务端组件
可以从 `@standhigher/charts/formatters` 导入 formatter，该子路径不需要 React
或 Recharts。

## 无障碍与本地化

主要图表新增可选 `accessibility={{label, description, dataTable}}`。其中
`dataTable` 完全由调用方提供，组件库不会推导业务行、汇总、对比或结论。
完整类型的本地化消息需要补充 `chartLegend`。系统开启减少动态效果时，组件库
控制的 reveal 与图表动画会被关闭。

## 兼容说明

- v0.x 的 deprecated 别名与 formatter 在整个 1.x 保留，计划于 v2 移除。
- `chartTheme` 已深度冻结并改为 readonly；自定义时请复制，不要直接修改。
- 调色板绿色由 `#50b83c` 调整为 `#409c32`，以满足白底 3:1 图形对比度。
- 发布包提供 ESM 根入口与 `./formatters` 子入口。

升级后请运行类型检查、业务测试、SSR 构建，并检查 320px Dashboard。后续 1.x
升级参考 [upgrade-guide.zh-CN.md](upgrade-guide.zh-CN.md)。
