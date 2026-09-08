import{j as r}from"./jsx-runtime-CvIp3Bc9.js";import{S as d}from"./StackedBarChart-BLSLMlf8.js";import{C as l}from"./ChartCard-BdSuyNeK.js";import"./iframe-CGgJigSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./ChartState-sAfNnfiz.js";import"./ChartLocalization-Dk0sEoCu.js";import"./cartesianRechartsProps-ZNMOvQKd.js";import"./index-DxrsGA-o.js";import"./index-Bd3QtUB_.js";import"./ChartAccessibility-C4aVgj8s.js";import"./CartesianChart-BmisDhzu.js";import"./Bar-CcURs5tM.js";import"./tooltipContext-xhmzweCf.js";const e=[{channel:"Online store",fulfilled:184,returned:12,pending:22},{channel:"Point of sale",fulfilled:92,returned:5,pending:8},{channel:"Shop app",fulfilled:64,returned:3,pending:9},{channel:"Social commerce",fulfilled:48,returned:7,pending:11}],S={title:"Components/StackedBarChart",component:d},a={render:()=>r.jsx(l,{title:"Order status by channel",subtitle:"Last 7 days",metric:"465 orders",trendLabel:"+9.3%",state:"ready",children:r.jsx(d,{data:e,format:"number",height:300,series:[{id:"fulfilled",label:"Fulfilled",data:e},{id:"returned",label:"Returned",data:e},{id:"pending",label:"Pending",data:e}],xKey:"channel"})})},t={render:()=>r.jsx(l,{title:"Order status by channel",subtitle:"Last 7 days",metric:"465 orders",trendLabel:"+9.3%",state:"ready",children:r.jsx(d,{data:e,format:"number",grid:{horizontal:!0,vertical:!1,stroke:"#e5e7eb",strokeDasharray:"3 3"},height:260,margin:{top:8,right:8,bottom:0,left:-8},series:[{id:"fulfilled",label:"Fulfilled",data:e,color:"#008060"},{id:"pending",label:"Pending",data:e,color:"#2C6ECB"},{id:"returned",label:"Returned",data:e,color:"#D72C0D"}],showLegend:!1,tooltip:{cursor:{stroke:"#9ca3af",strokeDasharray:"3 3"}},xAxis:{axisLine:!1,minTickGap:0,tickLine:!1},xKey:"channel",yAxis:{domain:[0,240],ticks:[0,60,120,180,240],width:48}})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
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
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Order status by channel" subtitle="Last 7 days" metric="465 orders" trendLabel="+9.3%" state="ready">
      <StackedBarChart data={orderStatusData} format="number" grid={{
      horizontal: true,
      vertical: false,
      stroke: '#e5e7eb',
      strokeDasharray: '3 3'
    }} height={260} margin={{
      top: 8,
      right: 8,
      bottom: 0,
      left: -8
    }} series={[{
      id: 'fulfilled',
      label: 'Fulfilled',
      data: orderStatusData,
      color: '#008060'
    }, {
      id: 'pending',
      label: 'Pending',
      data: orderStatusData,
      color: '#2C6ECB'
    }, {
      id: 'returned',
      label: 'Returned',
      data: orderStatusData,
      color: '#D72C0D'
    }]} showLegend={false} tooltip={{
      cursor: {
        stroke: '#9ca3af',
        strokeDasharray: '3 3'
      }
    }} xAxis={{
      axisLine: false,
      minTickGap: 0,
      tickLine: false
    }} xKey="channel" yAxis={{
      domain: [0, 240],
      ticks: [0, 60, 120, 180, 240],
      width: 48
    }} />
    </ChartCard>
}`,...t.parameters?.docs?.source}}};const x=["OrderStatusByChannel","AnalyticsStyle"];export{t as AnalyticsStyle,a as OrderStatusByChannel,x as __namedExportsOrder,S as default};
