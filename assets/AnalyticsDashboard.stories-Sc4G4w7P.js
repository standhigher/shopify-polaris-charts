import{j as e}from"./jsx-runtime-CvIp3Bc9.js";import{r as y,o as h,s as v}from"./sampleData-DT7KqFPL.js";import{M as l}from"./MetricCard-IszI80qw.js";import{C as p}from"./ChartCard-BdSuyNeK.js";import{C as m}from"./ComparisonChart-DzS6ih2M.js";import{C as g}from"./ConversionChart-D0Egtzg-.js";import"./iframe-CGgJigSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./ChartLocalization-Dk0sEoCu.js";import"./analytics-Bf0DabMZ.js";import"./TrendChart-BKnWocs8.js";import"./ChartState-sAfNnfiz.js";import"./smoothCurvePath-Cy0qokdl.js";import"./cartesianRechartsProps-ZNMOvQKd.js";import"./index-DxrsGA-o.js";import"./index-Bd3QtUB_.js";import"./CartesianChart-BmisDhzu.js";import"./ChartAccessibility-C4aVgj8s.js";const r={chartGrid:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 360px), 1fr))"},dashboard:{background:"#f6f6f7",boxSizing:"border-box",color:"#202223",fontFamily:'-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',minHeight:"100vh",padding:16,width:"100%"},header:{marginBottom:16},kicker:{color:"#6d7175",fontSize:13,lineHeight:1.4,margin:0},metricGrid:{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 220px), 1fr))",marginBottom:16},pageTitle:{fontSize:22,fontWeight:650,lineHeight:1.3,margin:"4px 0"},visuallyHidden:{clip:"rect(0 0 0 0)",clipPath:"inset(50%)",height:1,margin:-1,overflow:"hidden",position:"absolute",whiteSpace:"nowrap",width:1}};function t({onRetry:u,state:a="ready"}){const d=a==="loading"?"loading":"ready",c=a==="error"?"ready":a;return e.jsxs("main",{style:r.dashboard,children:[e.jsxs("header",{style:r.header,children:[e.jsx("p",{style:r.kicker,children:"Shopify App analytics"}),e.jsx("h1",{style:r.pageTitle,children:"Store performance"}),e.jsx("p",{style:r.kicker,children:"Last 7 days, compared with previous period"})]}),e.jsxs("section",{"aria-labelledby":"store-metrics-heading",style:r.metricGrid,children:[e.jsx("h2",{id:"store-metrics-heading",style:r.visuallyHidden,children:"Store metrics"}),e.jsx(l,{comparison:"Compared with previous period",state:d,title:"Gross sales",trend:{direction:"up",value:"+12.4%"},value:"$173.3K"}),e.jsx(l,{comparison:"Compared with previous period",state:d,title:"Orders",trend:{direction:"up",value:"+10.1%"},value:"2,539"}),e.jsx(l,{comparison:"Compared with previous period",state:d,title:"Conversion rate",trend:{direction:"up",value:"+0.5 pts"},value:"4.1%"})]}),e.jsxs("section",{"aria-labelledby":"store-analytics-charts-heading",style:r.chartGrid,children:[e.jsx("h2",{id:"store-analytics-charts-heading",style:r.visuallyHidden,children:"Store analytics charts"}),e.jsx(p,{metric:"$173.3K",state:"ready",subtitle:"Gross sales compared with the previous period",title:"Revenue trend",trendLabel:"+12.4%",children:e.jsx(m,{comparisonSeries:{dataKey:"previousRevenue",label:"Previous period"},currentSeries:{dataKey:"currentRevenue",label:"Current period",color:"#202223"},data:y,emptyMessage:"No revenue data for this period",format:"currency",height:260,mode:"area",state:c,xFormat:"date",xKey:"date"})}),e.jsx(p,{metric:"2,539",state:"ready",subtitle:"Order volume against the previous period",title:"Orders compared with previous period",trendLabel:"+10.1%",children:e.jsx(m,{comparisonSeries:{dataKey:"previousOrders",label:"Previous period"},currentSeries:{dataKey:"currentOrders",label:"Current period",color:"#202223"},data:h,emptyMessage:"No order data for this period",errorMessage:"Orders comparison could not be loaded",format:"number",height:260,onRetry:u??(()=>{}),retryLabel:"Retry orders comparison",state:a,xFormat:"date",xKey:"date"})}),e.jsx(p,{metric:"4.1%",state:"ready",subtitle:"Online store sessions that became orders",title:"Store conversion",trendLabel:"+0.5 pts",children:e.jsx(g,{data:v,emptyMessage:"No conversion data for this period",height:260,series:[{dataKey:"conversionRate",label:"Conversion rate",color:"#202223"}],state:c,target:{label:"Goal",value:.05},xFormat:"date",xKey:"date"})})]})]})}const A={title:"Examples/Analytics Dashboard",component:t,parameters:{layout:"fullscreen"}},s={},o={args:{state:"loading"}},i={args:{state:"empty"}},n={name:"Partial error with retry",args:{state:"error"}};t.__docgenInfo={description:"",methods:[],displayName:"AnalyticsDashboard",props:{onRetry:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},state:{required:!1,tsType:{name:"Extract",elements:[{name:"union",raw:"'loading' | 'empty' | 'error' | 'ready'",elements:[{name:"literal",value:"'loading'"},{name:"literal",value:"'empty'"},{name:"literal",value:"'error'"},{name:"literal",value:"'ready'"}]},{name:"union",raw:"'empty' | 'error' | 'loading' | 'ready'",elements:[{name:"literal",value:"'empty'"},{name:"literal",value:"'error'"},{name:"literal",value:"'loading'"},{name:"literal",value:"'ready'"}]}],raw:"Extract<ChartContentState, 'empty' | 'error' | 'loading' | 'ready'>"},description:"",defaultValue:{value:"'ready'",computed:!1}}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`function AnalyticsDashboard({
  onRetry,
  state = 'ready'
}: AnalyticsDashboardProps) {
  const metricState = state === 'loading' ? 'loading' : 'ready';
  const unaffectedChartState = state === 'error' ? 'ready' : state;
  return <main style={styles.dashboard}>
      <header style={styles.header}>
        <p style={styles.kicker}>Shopify App analytics</p>
        <h1 style={styles.pageTitle}>Store performance</h1>
        <p style={styles.kicker}>Last 7 days, compared with previous period</p>
      </header>

      <section aria-labelledby="store-metrics-heading" style={styles.metricGrid}>
        <h2 id="store-metrics-heading" style={styles.visuallyHidden}>Store metrics</h2>
        <MetricCard comparison="Compared with previous period" state={metricState} title="Gross sales" trend={{
        direction: 'up',
        value: '+12.4%'
      }} value="$173.3K" />
        <MetricCard comparison="Compared with previous period" state={metricState} title="Orders" trend={{
        direction: 'up',
        value: '+10.1%'
      }} value="2,539" />
        <MetricCard comparison="Compared with previous period" state={metricState} title="Conversion rate" trend={{
        direction: 'up',
        value: '+0.5 pts'
      }} value="4.1%" />
      </section>

      <section aria-labelledby="store-analytics-charts-heading" style={styles.chartGrid}>
        <h2 id="store-analytics-charts-heading" style={styles.visuallyHidden}>Store analytics charts</h2>
        <ChartCard metric="$173.3K" state="ready" subtitle="Gross sales compared with the previous period" title="Revenue trend" trendLabel="+12.4%">
          <ComparisonChart comparisonSeries={{
          dataKey: 'previousRevenue',
          label: 'Previous period'
        }} currentSeries={{
          dataKey: 'currentRevenue',
          label: 'Current period',
          color: '#202223'
        }} data={revenueComparisonData} emptyMessage="No revenue data for this period" format="currency" height={260} mode="area" state={unaffectedChartState} xFormat="date" xKey="date" />
        </ChartCard>

        <ChartCard metric="2,539" state="ready" subtitle="Order volume against the previous period" title="Orders compared with previous period" trendLabel="+10.1%">
          <ComparisonChart comparisonSeries={{
          dataKey: 'previousOrders',
          label: 'Previous period'
        }} currentSeries={{
          dataKey: 'currentOrders',
          label: 'Current period',
          color: '#202223'
        }} data={orderComparisonData} emptyMessage="No order data for this period" errorMessage="Orders comparison could not be loaded" format="number" height={260} onRetry={onRetry ?? (() => undefined)} retryLabel="Retry orders comparison" state={state} xFormat="date" xKey="date" />
        </ChartCard>

        <ChartCard metric="4.1%" state="ready" subtitle="Online store sessions that became orders" title="Store conversion" trendLabel="+0.5 pts">
          <ConversionChart data={storeConversionData} emptyMessage="No conversion data for this period" height={260} series={[{
          dataKey: 'conversionRate',
          label: 'Conversion rate',
          color: '#202223'
        }]} state={unaffectedChartState} target={{
          label: 'Goal',
          value: 0.05
        }} xFormat="date" xKey="date" />
        </ChartCard>
      </section>
    </main>;
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:"{}",...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'loading'
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'empty'
  }
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  name: 'Partial error with retry',
  args: {
    state: 'error'
  }
}`,...n.parameters?.docs?.source}}};const N=["AnalyticsDashboard","Ready","Loading","Empty","Error"];export{t as AnalyticsDashboard,i as Empty,n as Error,o as Loading,s as Ready,N as __namedExportsOrder,A as default};
