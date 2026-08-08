import{j as r}from"./jsx-runtime-DnvfWPe3.js";import{S as a}from"./StackedBarChart-76jHouON.js";import{C as d}from"./ChartCard-BLdy_HVq.js";import"./iframe-MpPk-H-V.js";import"./preload-helper-PPVm8Dsz.js";import"./formatters-DrRghmWY.js";import"./index-hWR1rVbd.js";import"./index-CBUtDgrM.js";import"./CartesianChart-DRfPDS8-.js";import"./Bar-D3MYRt7B.js";import"./tooltipContext-SeZHajY1.js";const e=[{channel:"Online store",fulfilled:184,returned:12,pending:22},{channel:"Point of sale",fulfilled:92,returned:5,pending:8},{channel:"Shop app",fulfilled:64,returned:3,pending:9},{channel:"Social commerce",fulfilled:48,returned:7,pending:11}],b={title:"Components/StackedBarChart",component:a},t={render:()=>r.jsx(d,{title:"Order status by channel",subtitle:"Last 7 days",metric:"465 orders",trendLabel:"+9.3%",state:"ready",children:r.jsx(a,{data:e,format:"number",height:300,series:[{id:"fulfilled",label:"Fulfilled",data:e},{id:"returned",label:"Returned",data:e},{id:"pending",label:"Pending",data:e}],xKey:"channel"})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Order status by channel" subtitle="Last 7 days" metric="465 orders" trendLabel="+9.3%" state="ready">
      <StackedBarChart data={orderStatusData} format="number" height={300} series={[{
      id: 'fulfilled',
      label: 'Fulfilled',
      data: orderStatusData
    }, {
      id: 'returned',
      label: 'Returned',
      data: orderStatusData
    }, {
      id: 'pending',
      label: 'Pending',
      data: orderStatusData
    }]} xKey="channel" />
    </ChartCard>
}`,...t.parameters?.docs?.source}}};const S=["OrderStatusByChannel"];export{t as OrderStatusByChannel,S as __namedExportsOrder,b as default};
