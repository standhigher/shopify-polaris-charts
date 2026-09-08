import{j as r}from"./jsx-runtime-CvIp3Bc9.js";import{C as n}from"./ComboChart-K4X9TJJo.js";import{C as d}from"./ChartCard-BdSuyNeK.js";import"./iframe-CGgJigSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./ChartState-sAfNnfiz.js";import"./ChartLocalization-Dk0sEoCu.js";import"./smoothCurvePath-Cy0qokdl.js";import"./cartesianRechartsProps-ZNMOvQKd.js";import"./index-DxrsGA-o.js";import"./index-Bd3QtUB_.js";import"./CartesianChart-BmisDhzu.js";import"./ChartAccessibility-C4aVgj8s.js";import"./Bar-CcURs5tM.js";import"./tooltipContext-xhmzweCf.js";const e=[{date:"2026-07-01",orders:138,conversionRate:.032},{date:"2026-07-02",orders:156,conversionRate:.036},{date:"2026-07-03",orders:171,conversionRate:.041},{date:"2026-07-04",orders:149,conversionRate:.038},{date:"2026-07-05",orders:188,conversionRate:.044},{date:"2026-07-06",orders:204,conversionRate:.047},{date:"2026-07-07",orders:219,conversionRate:.049}],a=[{date:"2026-07-01",orders:138,revenue:12430.4,conversionRate:.032},{date:"2026-07-02",orders:156,revenue:null,conversionRate:.036},{date:"2026-07-03",orders:171,revenue:15890.75,conversionRate:null},{date:"2026-07-04",orders:149,revenue:null,conversionRate:.038},{date:"2026-07-05",orders:188,revenue:17440.8,conversionRate:.044},{date:"2026-07-06",orders:204,revenue:19120.15,conversionRate:null},{date:"2026-07-07",orders:219,revenue:20480.6,conversionRate:.049}],k={title:"Components/ComboChart",component:n},t={render:()=>r.jsx(d,{title:"Orders and conversion",subtitle:"Last 7 days",metric:"1,225 orders",trendLabel:"+11.8%",state:"ready",children:r.jsx(n,{data:e,height:300,series:[{id:"orders",label:"Orders",data:e,type:"bar",format:"number"},{id:"conversionRate",label:"Conversion rate",data:e,type:"line",format:"percent"}],xFormat:"date",xKey:"date"})})},o={render:()=>r.jsx(d,{title:"Orders, revenue, and conversion gaps",subtitle:"Bridges across both axes",metric:"$117.3K",state:"ready",children:r.jsx(n,{data:a,format:"number",height:300,line:{activeDot:{r:"auto"},dot:{r:"auto",show:"isolated"}},series:[{connectGaps:!0,data:a,format:"number",id:"orders",label:"Orders",type:"bar"},{color:"#008060",connectGaps:{color:"#6d7175",opacity:.8,strokeDasharray:"5 4",strokeWidth:2},data:a,format:"number",id:"revenue",label:"Revenue",type:"line"},{color:"#2c6ecb",connectGaps:{color:"#8da9d8",opacity:.85,strokeDasharray:"3 3",strokeWidth:2},data:a,format:"percent",id:"conversionRate",label:"Conversion rate",type:"line"}],showLegend:!1,xFormat:"date",xKey:"date"})})},s={render:()=>r.jsx(d,{title:"Orders and conversion",subtitle:"Last 7 days",metric:"1,225 orders",trendLabel:"+11.8%",state:"ready",children:r.jsx(n,{data:e,grid:{horizontal:!0,vertical:!1,stroke:"#e5e7eb",strokeDasharray:"3 3"},height:260,line:{dot:!1,activeDot:{r:3,strokeWidth:0}},margin:{top:8,right:8,bottom:0,left:-8},series:[{id:"orders",label:"Orders",data:e,type:"bar",format:"number",color:"#008060"},{id:"conversionRate",label:"Conversion rate",data:e,type:"line",format:"percent",color:"#2C6ECB"}],showLegend:!1,tooltip:{cursor:{stroke:"#9ca3af",strokeDasharray:"3 3"}},xAxis:{axisLine:!1,minTickGap:0,tickLine:!1},xFormat:"date",xKey:"date",yAxis:{axisLine:!1,tickLine:!1,width:48}})})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
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
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Orders, revenue, and conversion gaps" subtitle="Bridges across both axes" metric="$117.3K" state="ready">
      <ComboChart data={gapComboData} format="number" height={300} line={{
      activeDot: {
        r: 'auto'
      },
      dot: {
        r: 'auto',
        show: 'isolated'
      }
    }} series={[{
      connectGaps: true,
      data: gapComboData,
      format: 'number',
      id: 'orders',
      label: 'Orders',
      type: 'bar'
    }, {
      color: '#008060',
      connectGaps: {
        color: '#6d7175',
        opacity: 0.8,
        strokeDasharray: '5 4',
        strokeWidth: 2
      },
      data: gapComboData,
      format: 'number',
      id: 'revenue',
      label: 'Revenue',
      type: 'line'
    }, {
      color: '#2c6ecb',
      connectGaps: {
        color: '#8da9d8',
        opacity: 0.85,
        strokeDasharray: '3 3',
        strokeWidth: 2
      },
      data: gapComboData,
      format: 'percent',
      id: 'conversionRate',
      label: 'Conversion rate',
      type: 'line'
    }]} showLegend={false} xFormat="date" xKey="date" />
    </ChartCard>
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Orders and conversion" subtitle="Last 7 days" metric="1,225 orders" trendLabel="+11.8%" state="ready">
      <ComboChart data={orderConversionData} grid={{
      horizontal: true,
      vertical: false,
      stroke: '#e5e7eb',
      strokeDasharray: '3 3'
    }} height={260} line={{
      dot: false,
      activeDot: {
        r: 3,
        strokeWidth: 0
      }
    }} margin={{
      top: 8,
      right: 8,
      bottom: 0,
      left: -8
    }} series={[{
      id: 'orders',
      label: 'Orders',
      data: orderConversionData,
      type: 'bar',
      format: 'number',
      color: '#008060'
    }, {
      id: 'conversionRate',
      label: 'Conversion rate',
      data: orderConversionData,
      type: 'line',
      format: 'percent',
      color: '#2C6ECB'
    }]} showLegend={false} tooltip={{
      cursor: {
        stroke: '#9ca3af',
        strokeDasharray: '3 3'
      }
    }} xAxis={{
      axisLine: false,
      minTickGap: 0,
      tickLine: false
    }} xFormat="date" xKey="date" yAxis={{
      axisLine: false,
      tickLine: false,
      width: 48
    }} />
    </ChartCard>
}`,...s.parameters?.docs?.source}}};const R=["OrdersAndConversion","GapsAndDualAxis","AnalyticsStyle"];export{s as AnalyticsStyle,o as GapsAndDualAxis,t as OrdersAndConversion,R as __namedExportsOrder,k as default};
