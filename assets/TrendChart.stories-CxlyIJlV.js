import{j as e}from"./jsx-runtime-CvIp3Bc9.js";import{T as a}from"./TrendChart-BKnWocs8.js";import{C as r}from"./ChartCard-BdSuyNeK.js";import{C as G,a as T}from"./ChartSkeletonLayout-BoEj1ppv.js";import"./iframe-CGgJigSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./ChartState-sAfNnfiz.js";import"./ChartLocalization-Dk0sEoCu.js";import"./smoothCurvePath-Cy0qokdl.js";import"./cartesianRechartsProps-ZNMOvQKd.js";import"./index-DxrsGA-o.js";import"./index-Bd3QtUB_.js";import"./CartesianChart-BmisDhzu.js";import"./ChartAccessibility-C4aVgj8s.js";function O({active:n,formatLabel:o,formatValue:k,label:L,payload:D}){return!n||!D?.length?null:e.jsxs("div",{style:{background:"#202223",borderRadius:8,color:"#ffffff",minWidth:180,padding:12},children:[e.jsx("strong",{children:o(L)}),D.map((i,j)=>e.jsxs("div",{style:{display:"flex",gap:12,justifyContent:"space-between",marginTop:8},children:[e.jsx("span",{children:i.series?.label}),e.jsx("span",{children:k(i.value,i.series)})]},`${i.series?.label??"series"}-${j}`))]})}const s=[{date:"2026-07-01",grossSales:12430.4,netSales:11280.1},{date:"2026-07-02",grossSales:14200,netSales:12940.35},{date:"2026-07-03",grossSales:15890.75,netSales:14620.5},{date:"2026-07-04",grossSales:13780.2,netSales:12590},{date:"2026-07-05",grossSales:17440.8,netSales:16030.4},{date:"2026-07-06",grossSales:19120.15,netSales:17680.9},{date:"2026-07-07",grossSales:20480.6,netSales:18920.7}],S=Array.from({length:30},(n,o)=>({date:`2026-07-${String(o+1).padStart(2,"0")}`,grossSales:Math.round(11e3+Math.sin(o/2.5)*3200+o*260)})),R=S.map((n,o)=>({...n,grossSales:o===8||o===9||o===19?null:n.grossSales})),d=[{date:"2026-07-01",onlineStore:138,pointOfSale:42},{date:"2026-07-02",onlineStore:156,pointOfSale:48},{date:"2026-07-03",onlineStore:171,pointOfSale:53},{date:"2026-07-04",onlineStore:149,pointOfSale:46},{date:"2026-07-05",onlineStore:188,pointOfSale:62},{date:"2026-07-06",onlineStore:204,pointOfSale:66},{date:"2026-07-07",onlineStore:219,pointOfSale:71}],t=[{date:"2026-07-01",current:12430.4,previous:10980.2},{date:"2026-07-02",current:14200,previous:11840.35},{date:"2026-07-03",current:15890.75,previous:13120.5},{date:"2026-07-04",current:13780.2,previous:12680.8},{date:"2026-07-05",current:17440.8,previous:14220.4},{date:"2026-07-06",current:19120.15,previous:15890.9},{date:"2026-07-07",current:20480.6,previous:16740.7}],K=[{date:"2026-07-01",current:12430.4},{date:"2026-07-02",current:null},{date:"2026-07-03",current:15890.75},{date:"2026-07-04",current:null},{date:"2026-07-05",current:null},{date:"2026-07-06",current:19120.15},{date:"2026-07-07",current:20480.6}],B={title:"Components/TrendChart",component:a},l={render:()=>e.jsx(r,{title:"Revenue trend",subtitle:"Last 7 days",metric:"$117.3K",trendLabel:"+12.4%",state:"ready",children:e.jsx(a,{data:s,format:"currency",height:300,series:[{id:"grossSales",label:"Gross sales",data:s},{id:"netSales",label:"Net sales",data:s}],xKey:"date"})})},c={render:()=>e.jsx(r,{title:"Revenue data gaps",subtitle:"Bridges and isolated observations",metric:"$117.3K",state:"ready",children:e.jsx(a,{data:K,format:"currency",height:300,line:{activeDot:{r:"auto"},dot:{r:"auto",show:"isolated"}},series:[{color:"#008060",connectGaps:{color:"#6d7175",opacity:.8,strokeDasharray:"5 4",strokeWidth:2},data:K,id:"current",label:"Current period"}],showLegend:!1,xFormat:"date",xKey:"date"})})},u={render:()=>e.jsx(r,{title:"Revenue trend",subtitle:"Last 30 days",metric:"$117.3K",trendLabel:"+12.4%",state:"ready",children:e.jsx(a,{data:S,format:"currency",height:300,series:[{data:S,id:"grossSales",label:"Gross sales"}],xFormat:"date",xKey:"date"})})},h={render:()=>e.jsx(r,{title:"Revenue data gaps",subtitle:"Last 30 days",metric:"$117.3K",state:"ready",children:e.jsx(a,{data:R,format:"currency",height:300,line:{activeDot:{r:"auto"},dot:{r:"auto",show:"isolated"}},series:[{color:"#008060",connectGaps:{color:"#6d7175",opacity:.8,strokeDasharray:"5 4",strokeWidth:2},data:R,id:"grossSales",label:"Gross sales"}],showLegend:!1,xAxis:{interval:"preserveStartEnd"},xFormat:"date",xKey:"date"})})},m={render:()=>e.jsx(r,{title:"Orders by channel",subtitle:"Last 7 days",metric:"1,433",trendLabel:"+8.1%",state:"ready",children:e.jsx(a,{data:d,format:"number",height:300,mode:"area",series:[{id:"onlineStore",label:"Online store",data:d},{id:"pointOfSale",label:"Point of sale",data:d}],xKey:"date"})})},p={render:()=>e.jsx(r,{title:"Revenue trend",subtitle:"Last 7 days",metric:"$117.3K",trendLabel:"+12.4%",state:"ready",children:e.jsx(a,{data:s,format:"currency",grid:{horizontal:!0,vertical:!1,stroke:"#e5e7eb",strokeDasharray:"3 3"},height:260,line:{dot:!1,activeDot:{r:3,strokeWidth:0}},margin:{top:8,right:8,bottom:0,left:-8},series:[{id:"grossSales",label:"Gross sales",data:s,color:"#008060"}],showLegend:!1,tooltip:{cursor:{stroke:"#9ca3af",strokeDasharray:"3 3"}},xAxis:{axisLine:!1,minTickGap:0,tickLine:!1},xFormat:"date",xKey:"date",yAxis:{domain:[0,22e3],ticks:[0,5500,11e3,16500,22e3],width:64}})})},y={render:()=>e.jsx(r,{title:"Revenue trend",subtitle:"Last 7 days",metric:"$117.3K",trendLabel:"+12.4%",state:"ready",children:e.jsx(a,{data:s,format:"currency",height:300,series:[{id:"grossSales",label:"Gross sales",data:s},{id:"netSales",label:"Net sales",data:s}],tooltip:{content:O,cursor:{stroke:"#9ca3af",strokeDasharray:"3 3"}},xFormat:"date",xKey:"date"})})},C={render:()=>e.jsx(r,{title:"Revenue trend",subtitle:"Controlled Recharts props",metric:"$117.3K",state:"ready",children:e.jsx(a,{data:s,format:"currency",height:260,rechartsProps:{area:{fillOpacity:.18},cartesianGrid:{vertical:!1},chart:{margin:{left:-8,right:8}},line:{activeDot:{r:3},strokeDasharray:"4 2"},tooltip:{cursor:{strokeDasharray:"3 3"}},xAxis:{minTickGap:0},yAxis:{width:56}},series:[{id:"grossSales",label:"Gross sales",data:s,color:"#008060"}],xFormat:"date",xKey:"date"})})},g={render:()=>e.jsx(r,{title:"Revenue comparison",subtitle:"Current period vs previous period",metric:"$117.3K",state:"ready",children:e.jsx(a,{data:t,format:"currency",height:300,series:[{id:"current",label:"Current period",data:t,color:"#008060"},{id:"previous",label:"Previous period",data:t,color:"#6d7175",opacity:.72,strokeDasharray:"4 4",strokeWidth:2}],xFormat:"date",xKey:"date"})})},b={render:()=>e.jsx(r,{title:"Revenue trend",subtitle:"Embedded business card keeps its own shell",metric:"$117.3K",state:"ready",children:e.jsx(a,{data:t,errorMessage:"Revenue API unavailable. Check the selected date range or retry the request.",format:"currency",onRetry:()=>{},retryLabel:"Try again",state:"error",xKey:"date",series:[{id:"current",label:"Current period",data:t}]})})},v={render:()=>e.jsx(r,{title:"Revenue trend",subtitle:"Chart-area loading state",metric:"$117.3K",state:"ready",children:e.jsx(a,{data:t,loadingLabel:"Loading revenue trend",state:"loading",xKey:"date",series:[{id:"current",label:"Current period",data:t}]})})},x={render:()=>e.jsx(r,{title:"Revenue trend",subtitle:"Chart remains mounted while the overlay fades",metric:"$117.3K",state:"ready",children:e.jsx(a,{data:t,format:"currency",reveal:{active:!0,label:"Preparing chart",durationMs:240},series:[{id:"current",label:"Current period",data:t,color:"#008060"}],xFormat:"date",xKey:"date"})})},f={render:()=>e.jsxs(G,{ariaLabel:"Revenue dashboard loading",columns:2,gap:20,children:[e.jsx(T,{label:"Revenue chart",minHeight:300,mode:"overlay",ready:!1,children:e.jsx(a,{data:t,format:"currency",series:[{id:"current",label:"Current period",data:t}],xKey:"date"})}),e.jsx(T,{label:"Orders chart",minHeight:300,ready:!0,children:e.jsx(r,{title:"Orders by channel",subtitle:"Ready region",metric:"1,433",state:"ready",children:e.jsx(a,{data:d,format:"number",mode:"area",series:[{id:"onlineStore",label:"Online store",data:d},{id:"pointOfSale",label:"Point of sale",data:d}],xKey:"date"})})})]})};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
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
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue data gaps" subtitle="Bridges and isolated observations" metric="$117.3K" state="ready">
      <TrendChart data={gapTrendData} format="currency" height={300} line={{
      activeDot: {
        r: 'auto'
      },
      dot: {
        r: 'auto',
        show: 'isolated'
      }
    }} series={[{
      color: '#008060',
      connectGaps: {
        color: '#6d7175',
        opacity: 0.8,
        strokeDasharray: '5 4',
        strokeWidth: 2
      },
      data: gapTrendData,
      id: 'current',
      label: 'Current period'
    }]} showLegend={false} xFormat="date" xKey="date" />
    </ChartCard>
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue trend" subtitle="Last 30 days" metric="$117.3K" trendLabel="+12.4%" state="ready">
      <TrendChart data={monthTrendData} format="currency" height={300} series={[{
      data: monthTrendData,
      id: 'grossSales',
      label: 'Gross sales'
    }]} xFormat="date" xKey="date" />
    </ChartCard>
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue data gaps" subtitle="Last 30 days" metric="$117.3K" state="ready">
      <TrendChart data={monthGapTrendData} format="currency" height={300} line={{
      activeDot: {
        r: 'auto'
      },
      dot: {
        r: 'auto',
        show: 'isolated'
      }
    }} series={[{
      color: '#008060',
      connectGaps: {
        color: '#6d7175',
        opacity: 0.8,
        strokeDasharray: '5 4',
        strokeWidth: 2
      },
      data: monthGapTrendData,
      id: 'grossSales',
      label: 'Gross sales'
    }]} showLegend={false} xAxis={{
      interval: 'preserveStartEnd'
    }} xFormat="date" xKey="date" />
    </ChartCard>
}`,...h.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
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
}`,...m.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue trend" subtitle="Last 7 days" metric="$117.3K" trendLabel="+12.4%" state="ready">
      <TrendChart data={salesTrendData} format="currency" grid={{
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
      id: 'grossSales',
      label: 'Gross sales',
      data: salesTrendData,
      color: '#008060'
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
      domain: [0, 22000],
      ticks: [0, 5500, 11000, 16500, 22000],
      width: 64
    }} />
    </ChartCard>
}`,...p.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue trend" subtitle="Last 7 days" metric="$117.3K" trendLabel="+12.4%" state="ready">
      <TrendChart data={salesTrendData} format="currency" height={300} series={[{
      id: 'grossSales',
      label: 'Gross sales',
      data: salesTrendData
    }, {
      id: 'netSales',
      label: 'Net sales',
      data: salesTrendData
    }]} tooltip={{
      content: RevenueTooltip,
      cursor: {
        stroke: '#9ca3af',
        strokeDasharray: '3 3'
      }
    }} xFormat="date" xKey="date" />
    </ChartCard>
}`,...y.parameters?.docs?.source}}};C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue trend" subtitle="Controlled Recharts props" metric="$117.3K" state="ready">
      <TrendChart data={salesTrendData} format="currency" height={260} rechartsProps={{
      area: {
        fillOpacity: 0.18
      },
      cartesianGrid: {
        vertical: false
      },
      chart: {
        margin: {
          left: -8,
          right: 8
        }
      },
      line: {
        activeDot: {
          r: 3
        },
        strokeDasharray: '4 2'
      },
      tooltip: {
        cursor: {
          strokeDasharray: '3 3'
        }
      },
      xAxis: {
        minTickGap: 0
      },
      yAxis: {
        width: 56
      }
    }} series={[{
      id: 'grossSales',
      label: 'Gross sales',
      data: salesTrendData,
      color: '#008060'
    }]} xFormat="date" xKey="date" />
    </ChartCard>
}`,...C.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue comparison" subtitle="Current period vs previous period" metric="$117.3K" state="ready">
      <TrendChart data={revenueComparisonData} format="currency" height={300} series={[{
      id: 'current',
      label: 'Current period',
      data: revenueComparisonData,
      color: '#008060'
    }, {
      id: 'previous',
      label: 'Previous period',
      data: revenueComparisonData,
      color: '#6d7175',
      opacity: 0.72,
      strokeDasharray: '4 4',
      strokeWidth: 2
    }]} xFormat="date" xKey="date" />
    </ChartCard>
}`,...g.parameters?.docs?.source}}};b.parameters={...b.parameters,docs:{...b.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue trend" subtitle="Embedded business card keeps its own shell" metric="$117.3K" state="ready">
      <TrendChart data={revenueComparisonData} errorMessage="Revenue API unavailable. Check the selected date range or retry the request." format="currency" onRetry={() => undefined} retryLabel="Try again" state="error" xKey="date" series={[{
      id: 'current',
      label: 'Current period',
      data: revenueComparisonData
    }]} />
    </ChartCard>
}`,...b.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue trend" subtitle="Chart-area loading state" metric="$117.3K" state="ready">
      <TrendChart data={revenueComparisonData} loadingLabel="Loading revenue trend" state="loading" xKey="date" series={[{
      id: 'current',
      label: 'Current period',
      data: revenueComparisonData
    }]} />
    </ChartCard>
}`,...v.parameters?.docs?.source}}};x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  render: () => <ChartCard title="Revenue trend" subtitle="Chart remains mounted while the overlay fades" metric="$117.3K" state="ready">
      <TrendChart data={revenueComparisonData} format="currency" reveal={{
      active: true,
      label: 'Preparing chart',
      durationMs: 240
    }} series={[{
      id: 'current',
      label: 'Current period',
      data: revenueComparisonData,
      color: '#008060'
    }]} xFormat="date" xKey="date" />
    </ChartCard>
}`,...x.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <ChartSkeletonLayout ariaLabel="Revenue dashboard loading" columns={2} gap={20}>
      <ChartRevealRegion label="Revenue chart" minHeight={300} mode="overlay" ready={false}>
        <TrendChart data={revenueComparisonData} format="currency" series={[{
        id: 'current',
        label: 'Current period',
        data: revenueComparisonData
      }]} xKey="date" />
      </ChartRevealRegion>
      <ChartRevealRegion label="Orders chart" minHeight={300} ready>
        <ChartCard title="Orders by channel" subtitle="Ready region" metric="1,433" state="ready">
          <TrendChart data={orderTrendData} format="number" mode="area" series={[{
          id: 'onlineStore',
          label: 'Online store',
          data: orderTrendData
        }, {
          id: 'pointOfSale',
          label: 'Point of sale',
          data: orderTrendData
        }]} xKey="date" />
        </ChartCard>
      </ChartRevealRegion>
    </ChartSkeletonLayout>
}`,...f.parameters?.docs?.source}}};const J=["Line","GapsAndIsolatedDots","MonthlyTrend","MonthlyTrendWithGaps","Area","AnalyticsStyle","CustomTooltip","ControlledRechartsProps","PerSeriesDashedComparison","InlineErrorWithRetry","LoadingSkeleton","RevealOverlay","DashboardPhasedReveal"];export{p as AnalyticsStyle,m as Area,C as ControlledRechartsProps,y as CustomTooltip,f as DashboardPhasedReveal,c as GapsAndIsolatedDots,b as InlineErrorWithRetry,l as Line,v as LoadingSkeleton,u as MonthlyTrend,h as MonthlyTrendWithGaps,g as PerSeriesDashedComparison,x as RevealOverlay,J as __namedExportsOrder,B as default};
