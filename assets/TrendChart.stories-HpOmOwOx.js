import{j as t}from"./jsx-runtime-DnvfWPe3.js";import{T as o}from"./TrendChart-oc9KR7o2.js";import{C as d}from"./ChartCard-BLdy_HVq.js";import"./iframe-MpPk-H-V.js";import"./preload-helper-PPVm8Dsz.js";import"./formatters-DrRghmWY.js";import"./index-hWR1rVbd.js";import"./index-CBUtDgrM.js";import"./CartesianChart-DRfPDS8-.js";import"./Line-B_vUCrGM.js";const r=[{date:"2026-07-01",grossSales:12430.4,netSales:11280.1},{date:"2026-07-02",grossSales:14200,netSales:12940.35},{date:"2026-07-03",grossSales:15890.75,netSales:14620.5},{date:"2026-07-04",grossSales:13780.2,netSales:12590},{date:"2026-07-05",grossSales:17440.8,netSales:16030.4},{date:"2026-07-06",grossSales:19120.15,netSales:17680.9},{date:"2026-07-07",grossSales:20480.6,netSales:18920.7}],s=[{date:"2026-07-01",onlineStore:138,pointOfSale:42},{date:"2026-07-02",onlineStore:156,pointOfSale:48},{date:"2026-07-03",onlineStore:171,pointOfSale:53},{date:"2026-07-04",onlineStore:149,pointOfSale:46},{date:"2026-07-05",onlineStore:188,pointOfSale:62},{date:"2026-07-06",onlineStore:204,pointOfSale:66},{date:"2026-07-07",onlineStore:219,pointOfSale:71}],u={title:"Components/TrendChart",component:o},e={render:()=>t.jsx(d,{title:"Revenue trend",subtitle:"Last 7 days",metric:"$117.3K",trendLabel:"+12.4%",state:"ready",children:t.jsx(o,{data:r,format:"currency",height:300,series:[{id:"grossSales",label:"Gross sales",data:r},{id:"netSales",label:"Net sales",data:r}],xKey:"date"})})},a={render:()=>t.jsx(d,{title:"Orders by channel",subtitle:"Last 7 days",metric:"1,433",trendLabel:"+8.1%",state:"ready",children:t.jsx(o,{data:s,format:"number",height:300,mode:"area",series:[{id:"onlineStore",label:"Online store",data:s},{id:"pointOfSale",label:"Point of sale",data:s}],xKey:"date"})})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue trend" subtitle="Last 7 days" metric="$117.3K" trendLabel="+12.4%" state="ready">
      <TrendChart data={salesTrendData} format="currency" height={300} series={[{
      id: 'grossSales',
      label: 'Gross sales',
      data: salesTrendData
    }, {
      id: 'netSales',
      label: 'Net sales',
      data: salesTrendData
    }]} xKey="date" />
    </ChartCard>
}`,...e.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Orders by channel" subtitle="Last 7 days" metric="1,433" trendLabel="+8.1%" state="ready">
      <TrendChart data={orderTrendData} format="number" height={300} mode="area" series={[{
      id: 'onlineStore',
      label: 'Online store',
      data: orderTrendData
    }, {
      id: 'pointOfSale',
      label: 'Point of sale',
      data: orderTrendData
    }]} xKey="date" />
    </ChartCard>
}`,...a.parameters?.docs?.source}}};const y=["Line","Area"];export{a as Area,e as Line,y as __namedExportsOrder,u as default};
