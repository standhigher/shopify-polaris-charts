import{j as e}from"./jsx-runtime-CvIp3Bc9.js";import{r as x}from"./iframe-CGgJigSQ.js";import{e as K}from"./sampleData-DT7KqFPL.js";import{M as o}from"./MetricCard-IszI80qw.js";import{C as c}from"./ChartCard-BdSuyNeK.js";import{T as E}from"./TrendChart-BKnWocs8.js";import{C as I}from"./ComparisonChart-DzS6ih2M.js";import{C as k}from"./ConversionChart-D0Egtzg-.js";import{F as N}from"./FunnelChart-CxeAGpnk.js";import"./preload-helper-PPVm8Dsz.js";import"./ChartLocalization-Dk0sEoCu.js";import"./ChartState-sAfNnfiz.js";import"./smoothCurvePath-Cy0qokdl.js";import"./cartesianRechartsProps-ZNMOvQKd.js";import"./index-DxrsGA-o.js";import"./index-Bd3QtUB_.js";import"./CartesianChart-BmisDhzu.js";import"./ChartAccessibility-C4aVgj8s.js";import"./analytics-Bf0DabMZ.js";const w="#202223",W="#6d7175",D="#2c6ecb",P="#008060",q="#b98900",A=a=>Object.freeze({...a}),j=a=>Object.freeze({...a,axis:Object.freeze({...a.axis}),comparisonSeries:a.comparisonSeries?A(a.comparisonSeries):void 0,currentSeries:A(a.currentSeries),formatOptions:a.formatOptions?Object.freeze({...a.formatOptions}):void 0}),F={color:W,label:"Previous period",opacity:.64,strokeDasharray:"6 4",strokeWidth:2},O=j({axis:{format:"currency"},comparisonSeries:F,currentSeries:{color:w,label:"Current period",strokeWidth:2},format:"currency"}),C=j({axis:{format:"number"},comparisonSeries:F,currentSeries:{color:D,label:"Current period",strokeWidth:2},format:"number"}),H=j({axis:{format:"percent"},currentSeries:{color:P,label:"Conversion rate",strokeWidth:2},format:"percent"}),S=Object.freeze({colors:Object.freeze([w,D,P,q]),format:"compact",percentageInput:"ratio"}),r={chartGrid:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 420px), 1fr))"},dashboard:{background:"#f6f6f7",boxSizing:"border-box",color:"#202223",fontFamily:'-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',minHeight:"100vh",padding:16,width:"100%"},header:{alignItems:"flex-end",display:"flex",flexWrap:"wrap",gap:16,justifyContent:"space-between",marginBottom:16},label:{color:"#6d7175",display:"flex",flexDirection:"column",fontSize:12,fontWeight:600,gap:4},metricGrid:{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 190px), 1fr))"},pageTitle:{fontSize:24,lineHeight:1.25,margin:"4px 0"},section:{marginTop:20},sectionTitle:{fontSize:16,lineHeight:1.35,margin:"0 0 10px"},select:{background:"#ffffff",border:"1px solid #8c9196",borderRadius:6,color:"#202223",font:"inherit",minHeight:36,padding:"6px 30px 6px 10px"},subtitle:{color:"#6d7175",fontSize:13,margin:0}},V=()=>{};function n({initialRange:a="7d",onRetry:M,progressiveReveal:f=!1,state:s="ready"}){const[R,G]=x.useState(a),[g,T]=x.useState(f),t=K[R],d=s==="loading"?"loading":"ready",L=s==="error"?"error":s==="partial-empty"?"empty":d,z=s==="partial-empty"?"empty":d,i=s==="loading"?"loading":"ready",l=f&&s==="ready"?{active:g}:!1;return x.useEffect(()=>{if(!g)return;const b=requestAnimationFrame(()=>T(!1));return()=>cancelAnimationFrame(b)},[g]),e.jsxs("main",{style:r.dashboard,children:[e.jsxs("header",{style:r.header,children:[e.jsxs("div",{children:[e.jsx("p",{style:r.subtitle,children:"Shopify App analytics"}),e.jsx("h1",{style:r.pageTitle,children:"Store performance"}),e.jsx("p",{style:r.subtitle,children:"App-owned commerce and conversion data"})]}),e.jsxs("label",{style:r.label,children:["Date range",e.jsxs("select",{"aria-label":"Date range",onChange:b=>{G(b.target.value),f&&T(!0)},style:r.select,value:R,children:[e.jsx("option",{value:"7d",children:"Last 7 days"}),e.jsx("option",{value:"30d",children:"Last 30 days"})]})]})]}),e.jsxs("section",{"aria-labelledby":"dashboard-metrics-heading",style:r.section,children:[e.jsx("h2",{id:"dashboard-metrics-heading",style:r.sectionTitle,children:"Metric Cards"}),e.jsxs("div",{style:r.metricGrid,children:[e.jsx(o,{comparison:"Compared with previous period",state:i,title:"Revenue",trend:{direction:"up",value:"+12.4%"},value:t.metrics.revenue}),e.jsx(o,{comparison:"Compared with previous period",state:i,title:"Orders",trend:{direction:"up",value:"+10.1%"},value:t.metrics.orders}),e.jsx(o,{comparison:"Compared with previous period",state:i,title:"Conversion Rate",trend:{direction:"up",value:"+0.5 pts"},value:t.metrics.conversion}),e.jsx(o,{comparison:"Compared with previous period",state:i,title:"AOV",trend:{direction:"up",value:"+1.8%"},value:t.metrics.aov}),e.jsx(o,{comparison:s==="partial-empty"?"No customer data":"Compared with previous period",state:i,title:"Customers",trend:s==="partial-empty"?void 0:{direction:"up",value:"+8.6%"},value:s==="partial-empty"?"—":t.metrics.customers}),e.jsx(o,{comparison:"Accepted offers divided by shown offers",state:i,title:"Upsell Conversion",trend:{direction:"neutral",value:"0.0 pts"},value:t.metrics.upsellConversion})]})]}),e.jsxs("section",{"aria-labelledby":"dashboard-trend-heading",style:r.section,children:[e.jsx("h2",{id:"dashboard-trend-heading",style:r.sectionTitle,children:"Trend"}),e.jsx("div",{style:r.chartGrid,children:e.jsx(c,{metric:t.metrics.revenue,state:"ready",subtitle:"Gross sales over the selected range",title:"Revenue trend",trendLabel:"+12.4%",children:e.jsx(E,{data:[...t.revenue],format:O.format,height:260,reveal:l,series:[{data:[...t.revenue],id:"currentRevenue",...O.currentSeries}],state:d,xFormat:"date",xKey:"date"})})})]}),e.jsxs("section",{"aria-labelledby":"dashboard-comparison-heading",style:r.section,children:[e.jsx("h2",{id:"dashboard-comparison-heading",style:r.sectionTitle,children:"Comparison"}),e.jsx("div",{style:r.chartGrid,children:e.jsx(c,{metric:t.metrics.orders,state:"ready",subtitle:"Orders against the previous period",title:"Order comparison",trendLabel:"+10.1%",children:e.jsx(I,{comparisonSeries:{dataKey:"previousOrders",...C.comparisonSeries},currentSeries:{dataKey:"currentOrders",...C.currentSeries},data:[...t.orders],emptyMessage:"No order comparison for this period",errorMessage:"Orders comparison could not be loaded",format:C.format,height:260,onRetry:M??V,retryLabel:"Retry orders comparison",reveal:l,state:L,xFormat:"date",xKey:"date"})})})]}),e.jsxs("section",{"aria-labelledby":"dashboard-conversion-heading",style:r.section,children:[e.jsx("h2",{id:"dashboard-conversion-heading",style:r.sectionTitle,children:"Conversion"}),e.jsx("div",{style:r.chartGrid,children:e.jsx(c,{metric:t.metrics.conversion,state:"ready",subtitle:"Sessions that became orders",title:"Store conversion",trendLabel:"+0.5 pts",children:e.jsx(k,{data:[...t.conversion],height:260,reveal:l,series:[{dataKey:"conversionRate",...H.currentSeries}],state:d,target:{label:"Goal",value:.05},xFormat:"date",xKey:"date"})})})]}),e.jsxs("section",{"aria-labelledby":"dashboard-funnel-heading",style:r.section,children:[e.jsx("h2",{id:"dashboard-funnel-heading",style:r.sectionTitle,children:"Funnel"}),e.jsx("div",{style:r.chartGrid,children:e.jsx(c,{metric:"1,132 purchases",state:"ready",subtitle:"Prepared funnel metrics from app-owned data",title:"Online store funnel",children:e.jsx(N,{colors:S.colors,data:[...t.funnel],emptyMessage:"No funnel activity for this period",format:S.format,percentageInput:S.percentageInput,reveal:l,state:z})})})]})]})}const ce={component:n,parameters:{layout:"fullscreen"},title:"Examples/Shopify Analytics Dashboard"},p={},m={args:{initialRange:"30d"}},u={args:{state:"loading"}},h={args:{state:"partial-empty"}},y={args:{state:"error"}},v={args:{progressiveReveal:!0}};n.__docgenInfo={description:"",methods:[],displayName:"ShopifyAnalyticsDashboard",props:{initialRange:{required:!1,tsType:{name:"union",raw:"keyof typeof shopifyAnalyticsDashboardData",elements:[{name:"literal",value:"'7d'"},{name:"literal",value:"'30d'"}]},description:"",defaultValue:{value:"'7d'",computed:!1}},onRetry:{required:!1,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},progressiveReveal:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},state:{required:!1,tsType:{name:"union",raw:"'error' | 'loading' | 'partial-empty' | 'ready'",elements:[{name:"literal",value:"'error'"},{name:"literal",value:"'loading'"},{name:"literal",value:"'partial-empty'"},{name:"literal",value:"'ready'"}]},description:"",defaultValue:{value:"'ready'",computed:!1}}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`function ShopifyAnalyticsDashboard({
  initialRange = '7d',
  onRetry,
  progressiveReveal = false,
  state = 'ready'
}: ShopifyAnalyticsDashboardProps) {
  const [range, setRange] = useState<DashboardRange>(initialRange);
  const [revealActive, setRevealActive] = useState(progressiveReveal);
  const scenario = shopifyAnalyticsDashboardData[range];
  const baseChartState = state === 'loading' ? 'loading' : 'ready';
  const orderState = state === 'error' ? 'error' : state === 'partial-empty' ? 'empty' : baseChartState;
  const funnelState = state === 'partial-empty' ? 'empty' : baseChartState;
  const metricState = state === 'loading' ? 'loading' : 'ready';
  const reveal = progressiveReveal && state === 'ready' ? {
    active: revealActive
  } : false;
  useEffect(() => {
    if (!revealActive) {
      return undefined;
    }
    const frame = requestAnimationFrame(() => setRevealActive(false));
    return () => cancelAnimationFrame(frame);
  }, [revealActive]);
  return <main style={styles.dashboard}>
      <header style={styles.header}>
        <div>
          <p style={styles.subtitle}>Shopify App analytics</p>
          <h1 style={styles.pageTitle}>Store performance</h1>
          <p style={styles.subtitle}>App-owned commerce and conversion data</p>
        </div>
        <label style={styles.label}>
          Date range
          <select aria-label="Date range" onChange={event => {
          setRange(event.target.value as DashboardRange);
          if (progressiveReveal) {
            setRevealActive(true);
          }
        }} style={styles.select} value={range}>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
        </label>
      </header>

      <section aria-labelledby="dashboard-metrics-heading" style={styles.section}>
        <h2 id="dashboard-metrics-heading" style={styles.sectionTitle}>Metric Cards</h2>
        <div style={styles.metricGrid}>
          <MetricCard comparison="Compared with previous period" state={metricState} title="Revenue" trend={{
          direction: 'up',
          value: '+12.4%'
        }} value={scenario.metrics.revenue} />
          <MetricCard comparison="Compared with previous period" state={metricState} title="Orders" trend={{
          direction: 'up',
          value: '+10.1%'
        }} value={scenario.metrics.orders} />
          <MetricCard comparison="Compared with previous period" state={metricState} title="Conversion Rate" trend={{
          direction: 'up',
          value: '+0.5 pts'
        }} value={scenario.metrics.conversion} />
          <MetricCard comparison="Compared with previous period" state={metricState} title="AOV" trend={{
          direction: 'up',
          value: '+1.8%'
        }} value={scenario.metrics.aov} />
          <MetricCard comparison={state === 'partial-empty' ? 'No customer data' : 'Compared with previous period'} state={metricState} title="Customers" trend={state === 'partial-empty' ? undefined : {
          direction: 'up',
          value: '+8.6%'
        }} value={state === 'partial-empty' ? '—' : scenario.metrics.customers} />
          <MetricCard comparison="Accepted offers divided by shown offers" state={metricState} title="Upsell Conversion" trend={{
          direction: 'neutral',
          value: '0.0 pts'
        }} value={scenario.metrics.upsellConversion} />
        </div>
      </section>

      <section aria-labelledby="dashboard-trend-heading" style={styles.section}>
        <h2 id="dashboard-trend-heading" style={styles.sectionTitle}>Trend</h2>
        <div style={styles.chartGrid}>
          <ChartCard metric={scenario.metrics.revenue} state="ready" subtitle="Gross sales over the selected range" title="Revenue trend" trendLabel="+12.4%">
            <TrendChart data={[...scenario.revenue]} format={revenueTrendPreset.format} height={260} reveal={reveal} series={[{
            data: [...scenario.revenue],
            id: 'currentRevenue',
            ...revenueTrendPreset.currentSeries
          }]} state={baseChartState} xFormat="date" xKey="date" />
          </ChartCard>
        </div>
      </section>

      <section aria-labelledby="dashboard-comparison-heading" style={styles.section}>
        <h2 id="dashboard-comparison-heading" style={styles.sectionTitle}>Comparison</h2>
        <div style={styles.chartGrid}>
          <ChartCard metric={scenario.metrics.orders} state="ready" subtitle="Orders against the previous period" title="Order comparison" trendLabel="+10.1%">
            <ComparisonChart comparisonSeries={{
            dataKey: 'previousOrders',
            ...orderTrendPreset.comparisonSeries!
          }} currentSeries={{
            dataKey: 'currentOrders',
            ...orderTrendPreset.currentSeries
          }} data={[...scenario.orders]} emptyMessage="No order comparison for this period" errorMessage="Orders comparison could not be loaded" format={orderTrendPreset.format} height={260} onRetry={onRetry ?? noOp} retryLabel="Retry orders comparison" reveal={reveal} state={orderState} xFormat="date" xKey="date" />
          </ChartCard>
        </div>
      </section>

      <section aria-labelledby="dashboard-conversion-heading" style={styles.section}>
        <h2 id="dashboard-conversion-heading" style={styles.sectionTitle}>Conversion</h2>
        <div style={styles.chartGrid}>
          <ChartCard metric={scenario.metrics.conversion} state="ready" subtitle="Sessions that became orders" title="Store conversion" trendLabel="+0.5 pts">
            <ConversionChart data={[...scenario.conversion]} height={260} reveal={reveal} series={[{
            dataKey: 'conversionRate',
            ...conversionTrendPreset.currentSeries
          }]} state={baseChartState} target={{
            label: 'Goal',
            value: 0.05
          }} xFormat="date" xKey="date" />
          </ChartCard>
        </div>
      </section>

      <section aria-labelledby="dashboard-funnel-heading" style={styles.section}>
        <h2 id="dashboard-funnel-heading" style={styles.sectionTitle}>Funnel</h2>
        <div style={styles.chartGrid}>
          <ChartCard metric="1,132 purchases" state="ready" subtitle="Prepared funnel metrics from app-owned data" title="Online store funnel">
            <FunnelChart colors={funnelPreset.colors} data={[...scenario.funnel]} emptyMessage="No funnel activity for this period" format={funnelPreset.format} percentageInput={funnelPreset.percentageInput} reveal={reveal} state={funnelState} />
          </ChartCard>
        </div>
      </section>
    </main>;
}`,...n.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:"{}",...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    initialRange: '30d'
  }
}`,...m.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'loading'
  }
}`,...u.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'partial-empty'
  }
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'error'
  }
}`,...y.parameters?.docs?.source}}};v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  args: {
    progressiveReveal: true
  }
}`,...v.parameters?.docs?.source}}};const pe=["ShopifyAnalyticsDashboard","Ready","DateRangeInteraction","Loading","PartialEmpty","LocalizedErrorWithRetry","ProgressiveReveal"];export{m as DateRangeInteraction,u as Loading,y as LocalizedErrorWithRetry,h as PartialEmpty,v as ProgressiveReveal,p as Ready,n as ShopifyAnalyticsDashboard,pe as __namedExportsOrder,ce as default};
