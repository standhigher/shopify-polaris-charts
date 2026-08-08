import{j as t}from"./jsx-runtime-DnvfWPe3.js";import{C as o}from"./ComboChart-BSc9juVn.js";import{C as a}from"./ChartCard-BLdy_HVq.js";import"./iframe-MpPk-H-V.js";import"./preload-helper-PPVm8Dsz.js";import"./formatters-DrRghmWY.js";import"./index-hWR1rVbd.js";import"./index-CBUtDgrM.js";import"./CartesianChart-DRfPDS8-.js";import"./Bar-D3MYRt7B.js";import"./tooltipContext-SeZHajY1.js";import"./Line-B_vUCrGM.js";const e=[{date:"2026-07-01",orders:138,conversionRate:.032},{date:"2026-07-02",orders:156,conversionRate:.036},{date:"2026-07-03",orders:171,conversionRate:.041},{date:"2026-07-04",orders:149,conversionRate:.038},{date:"2026-07-05",orders:188,conversionRate:.044},{date:"2026-07-06",orders:204,conversionRate:.047},{date:"2026-07-07",orders:219,conversionRate:.049}],x={title:"Components/ComboChart",component:o},r={render:()=>t.jsx(a,{title:"Orders and conversion",subtitle:"Last 7 days",metric:"1,225 orders",trendLabel:"+11.8%",state:"ready",children:t.jsx(o,{data:e,height:300,series:[{id:"orders",label:"Orders",data:e,type:"bar",format:"number"},{id:"conversionRate",label:"Conversion rate",data:e,type:"line",format:"percent"}],xFormat:"date",xKey:"date"})})};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Orders and conversion" subtitle="Last 7 days" metric="1,225 orders" trendLabel="+11.8%" state="ready">
      <ComboChart data={orderConversionData} height={300} series={[{
      id: 'orders',
      label: 'Orders',
      data: orderConversionData,
      type: 'bar',
      format: 'number'
    }, {
      id: 'conversionRate',
      label: 'Conversion rate',
      data: orderConversionData,
      type: 'line',
      format: 'percent'
    }]} xFormat="date" xKey="date" />
    </ChartCard>
}`,...r.parameters?.docs?.source}}};const y=["OrdersAndConversion"];export{r as OrdersAndConversion,y as __namedExportsOrder,x as default};
