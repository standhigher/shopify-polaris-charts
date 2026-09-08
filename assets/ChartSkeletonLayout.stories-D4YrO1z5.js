import{j as e}from"./jsx-runtime-CvIp3Bc9.js";import{C as s,a as n}from"./ChartSkeletonLayout-BoEj1ppv.js";import{C as o}from"./ChartCard-BdSuyNeK.js";import{T as d}from"./TrendChart-BKnWocs8.js";import"./iframe-CGgJigSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./ChartLocalization-Dk0sEoCu.js";import"./ChartState-sAfNnfiz.js";import"./smoothCurvePath-Cy0qokdl.js";import"./cartesianRechartsProps-ZNMOvQKd.js";import"./index-DxrsGA-o.js";import"./index-Bd3QtUB_.js";import"./CartesianChart-BmisDhzu.js";import"./ChartAccessibility-C4aVgj8s.js";const r=[{date:"2026-07-01",revenue:12430.4},{date:"2026-07-02",revenue:14200},{date:"2026-07-03",revenue:15890.75},{date:"2026-07-04",revenue:13780.2},{date:"2026-07-05",revenue:17440.8}],j={title:"Components/ChartSkeletonLayout",component:s},a={render:()=>e.jsxs(s,{ariaLabel:"Revenue dashboard loading",columns:2,gap:20,children:[e.jsx(n,{label:"Revenue chart",minHeight:300,ready:!1,skeleton:"Loading revenue API",children:e.jsx(o,{title:"Revenue trend",subtitle:"Loading region",metric:"$117.3K",state:"ready",children:e.jsx(d,{data:r,format:"currency",series:[{id:"revenue",label:"Revenue",data:r,color:"#008060"}],xKey:"date"})})}),e.jsx(n,{label:"Orders chart",ready:!0,children:e.jsx(o,{title:"Orders trend",subtitle:"Ready region",metric:"1,433",state:"ready",children:e.jsx(d,{data:r.map((i,l)=>({...i,orders:120+l*18})),format:"number",series:[{id:"orders",label:"Orders",data:[],color:"#5c6ac4"}],xKey:"date"})})})]})},t={render:()=>e.jsx(s,{ariaLabel:"Revenue dashboard loading",children:e.jsx(n,{label:"Revenue chart",minHeight:320,mode:"overlay",ready:!1,children:e.jsx(o,{title:"Revenue trend",subtitle:"Chart remains mounted behind skeleton",metric:"$117.3K",state:"ready",children:e.jsx(d,{data:r,format:"currency",series:[{id:"revenue",label:"Revenue",data:r,color:"#008060"}],xKey:"date"})})})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  render: () => <ChartSkeletonLayout ariaLabel="Revenue dashboard loading" columns={2} gap={20}>
      <ChartRevealRegion label="Revenue chart" minHeight={300} ready={false} skeleton="Loading revenue API">
        <ChartCard title="Revenue trend" subtitle="Loading region" metric="$117.3K" state="ready">
          <TrendChart data={revenueData} format="currency" series={[{
          id: 'revenue',
          label: 'Revenue',
          data: revenueData,
          color: '#008060'
        }]} xKey="date" />
        </ChartCard>
      </ChartRevealRegion>
      <ChartRevealRegion label="Orders chart" ready>
        <ChartCard title="Orders trend" subtitle="Ready region" metric="1,433" state="ready">
          <TrendChart data={revenueData.map((item, index) => ({
          ...item,
          orders: 120 + index * 18
        }))} format="number" series={[{
          id: 'orders',
          label: 'Orders',
          data: [],
          color: '#5c6ac4'
        }]} xKey="date" />
        </ChartCard>
      </ChartRevealRegion>
    </ChartSkeletonLayout>
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <ChartSkeletonLayout ariaLabel="Revenue dashboard loading">
      <ChartRevealRegion label="Revenue chart" minHeight={320} mode="overlay" ready={false}>
        <ChartCard title="Revenue trend" subtitle="Chart remains mounted behind skeleton" metric="$117.3K" state="ready">
          <TrendChart data={revenueData} format="currency" series={[{
          id: 'revenue',
          label: 'Revenue',
          data: revenueData,
          color: '#008060'
        }]} xKey="date" />
        </ChartCard>
      </ChartRevealRegion>
    </ChartSkeletonLayout>
}`,...t.parameters?.docs?.source}}};const K=["TwoColumnDashboard","OverlayRevealKeepsChartMounted"];export{t as OverlayRevealKeepsChartMounted,a as TwoColumnDashboard,K as __namedExportsOrder,j as default};
