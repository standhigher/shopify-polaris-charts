# v1 升级指南

每次升级 1.x：

1. 阅读 `CHANGELOG.md`，并查看公共类型声明报告的变化。
2. 保持 React / React DOM 在 `>=18.3 <20`，Recharts 在 `>=3 <4`。
3. 使用业务应用锁文件安装，然后运行类型检查、单测、SSR/框架生产构建，以及
   最窄支持宽度的 Dashboard 检查。
4. 对自定义图表验证 loading、empty、error/retry、键盘 Tooltip 与减少动态效果。
5. 新代码不要继续使用 deprecated 别名；它们在 1.x 兼容，计划于 v2 移除。

次要版本可新增可选属性、导出、消息、Preset 和 Story；补丁版本可修复渲染、
无障碍、格式化、兼容性和类型，但不会改变已记录的数据语义。Shopify 请求、
指标计算、存储仍由业务应用负责。
