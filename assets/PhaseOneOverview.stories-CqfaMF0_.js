import{j as e}from"./jsx-runtime-CvIp3Bc9.js";import{a as p,b as o,t as h,f as i,c as d,d as n}from"./sampleData-DT7KqFPL.js";import{M as m}from"./MetricCard-IszI80qw.js";import{C as s}from"./ChartCard-BdSuyNeK.js";import{T as u}from"./TrendChart-BKnWocs8.js";import{D as y}from"./DonutChart-6tYkjMTi.js";import{S as c}from"./StackedBarChart-BLSLMlf8.js";import{C as f}from"./ComboChart-K4X9TJJo.js";import"./iframe-CGgJigSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./ChartLocalization-Dk0sEoCu.js";import"./ChartState-sAfNnfiz.js";import"./smoothCurvePath-Cy0qokdl.js";import"./cartesianRechartsProps-ZNMOvQKd.js";import"./index-DxrsGA-o.js";import"./index-Bd3QtUB_.js";import"./CartesianChart-BmisDhzu.js";import"./ChartAccessibility-C4aVgj8s.js";import"./tooltipContext-xhmzweCf.js";import"./Bar-CcURs5tM.js";const t={actionButton:{background:"#ffffff",border:"1px solid #babfc3",borderRadius:6,color:"#202223",font:"inherit",fontSize:13,fontWeight:600,lineHeight:1,padding:"8px 12px"},badge:{background:"#f1f2f4",border:"1px solid #dcdfe4",borderRadius:6,color:"#3b3f44",display:"inline-flex",fontSize:12,fontWeight:650,lineHeight:1,padding:"6px 8px"},chartGrid:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 360px), 1fr))"},dashboard:{background:"#f6f6f7",color:"#202223",fontFamily:'-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',minHeight:"100vh",padding:24},filterPill:{background:"#f6f6f7",border:"1px solid #dcdfe4",borderRadius:6,color:"#3b3f44",fontSize:12,fontWeight:600,lineHeight:1,padding:"7px 10px"},header:{alignItems:"flex-start",display:"flex",gap:16,justifyContent:"space-between",margin:"0 0 16px"},kicker:{color:"#6d7175",fontSize:13,lineHeight:1.4,margin:0},metricGrid:{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 180px), 1fr))",marginBottom:16},pageTitle:{fontSize:20,fontWeight:650,letterSpacing:0,lineHeight:1.3,margin:"4px 0"},shell:{margin:"0 auto",maxWidth:1180},wide:{gridColumn:"1 / -1"}},W={title:"Examples/Phase One Overview",parameters:{layout:"fullscreen"}};function a(){return e.jsx("main",{style:t.dashboard,children:e.jsxs("div",{style:t.shell,children:[e.jsxs("header",{style:t.header,children:[e.jsxs("div",{children:[e.jsx("p",{style:t.kicker,children:"Shopify App dashboard sample"}),e.jsx("h1",{style:t.pageTitle,children:"Phase one chart overview"}),e.jsx("p",{style:t.kicker,children:"Last 8 days, compared with previous period"})]}),e.jsx("button",{style:t.actionButton,type:"button",children:"Export"})]}),e.jsx("section",{"aria-label":"Dashboard metrics",style:t.metricGrid,children:p.map(r=>e.jsx(m,{comparison:"Compared with previous period",title:r.label,trend:{direction:r.delta.startsWith("-")?"down":"up",value:r.delta},value:r.value},r.label))}),e.jsxs("section",{"aria-label":"Phase one chart components",style:t.chartGrid,children:[e.jsx("div",{style:t.wide,children:e.jsx(s,{actions:e.jsx("span",{style:t.badge,children:"TrendChart"}),filters:e.jsx("span",{style:t.filterPill,children:"Daily"}),metric:"$176.5K",state:"ready",subtitle:"Gross sales and net sales",title:"Revenue trend",trendLabel:"+13.8%",children:e.jsx(u,{data:o,format:"currency",height:300,mode:"area",series:[{id:"grossSales",label:"Gross sales",data:o,color:"#2c6ecb"},{id:"netSales",label:"Net sales",data:o,color:"#008060"}],xFormat:"date",xKey:"date"})})}),e.jsx(s,{actions:e.jsx("span",{style:t.badge,children:"DonutChart"}),metric:"49.5K sessions",state:"ready",subtitle:"Sessions by acquisition source",title:"Traffic source mix",children:e.jsx(y,{centerLabel:"49.5K",categoryKey:"source",data:h,format:"compact",height:280,valueKey:"sessions"})}),e.jsx(s,{actions:e.jsx("span",{style:t.badge,children:"StackedBarChart"}),filters:e.jsx("span",{style:t.filterPill,children:"By channel"}),metric:"1,863 orders",state:"ready",subtitle:"Fulfilled, pending, and returned orders",title:"Fulfillment status",trendLabel:"+7.4%",children:e.jsx(c,{data:i,format:"number",height:280,series:[{id:"fulfilled",label:"Fulfilled",data:i,color:"#008060"},{id:"pending",label:"Pending",data:i,color:"#b98900"},{id:"returned",label:"Returned",data:i,color:"#d72c0d"}],xKey:"channel"})}),e.jsx("div",{style:t.wide,children:e.jsx(s,{actions:e.jsx("span",{style:t.badge,children:"ComboChart"}),metric:"2,758 orders",state:"ready",subtitle:"Order volume with conversion rate",title:"Orders and conversion",trendLabel:"+9.6%",children:e.jsx(f,{data:d,height:300,series:[{id:"orders",label:"Orders",data:d,type:"bar",format:"number",color:"#2c6ecb"},{id:"conversionRate",label:"Conversion rate",data:d,type:"line",format:"percent",color:"#008060"}],xFormat:"date",xKey:"date"})})}),e.jsx(s,{actions:e.jsx("span",{style:t.badge,children:"ChartCard"}),metric:"$55.7K",state:"ready",subtitle:"Card shell with header, metric, controls, and content",title:"Top products",trendLabel:"+5.2%",children:e.jsx(c,{data:n,format:"currency",height:260,series:[{id:"revenue",label:"Revenue",data:n,color:"#5c6ac4"}],xKey:"product"})})]})]})})}const l={render:()=>e.jsx(a,{})};a.__docgenInfo={description:"",methods:[],displayName:"PhaseOneOverview"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`function PhaseOneOverview() {
  return <main style={styles.dashboard}>
      <div style={styles.shell}>
        <header style={styles.header}>
          <div>
            <p style={styles.kicker}>Shopify App dashboard sample</p>
            <h1 style={styles.pageTitle}>Phase one chart overview</h1>
            <p style={styles.kicker}>Last 8 days, compared with previous period</p>
          </div>
          <button style={styles.actionButton} type="button">
            Export
          </button>
        </header>

        <section aria-label="Dashboard metrics" style={styles.metricGrid}>
          {overviewMetrics.map(metric => <MetricCard comparison="Compared with previous period" key={metric.label} title={metric.label} trend={{
          direction: metric.delta.startsWith('-') ? 'down' : 'up',
          value: metric.delta
        }} value={metric.value} />)}
        </section>

        <section aria-label="Phase one chart components" style={styles.chartGrid}>
          <div style={styles.wide}>
            <ChartCard actions={<span style={styles.badge}>TrendChart</span>} filters={<span style={styles.filterPill}>Daily</span>} metric="$176.5K" state="ready" subtitle="Gross sales and net sales" title="Revenue trend" trendLabel="+13.8%">
              <TrendChart data={revenueTrendData} format="currency" height={300} mode="area" series={[{
              id: 'grossSales',
              label: 'Gross sales',
              data: revenueTrendData,
              color: '#2c6ecb'
            }, {
              id: 'netSales',
              label: 'Net sales',
              data: revenueTrendData,
              color: '#008060'
            }]} xFormat="date" xKey="date" />
            </ChartCard>
          </div>

          <ChartCard actions={<span style={styles.badge}>DonutChart</span>} metric="49.5K sessions" state="ready" subtitle="Sessions by acquisition source" title="Traffic source mix">
            <DonutChart centerLabel="49.5K" categoryKey="source" data={trafficSourceData} format="compact" height={280} valueKey="sessions" />
          </ChartCard>

          <ChartCard actions={<span style={styles.badge}>StackedBarChart</span>} filters={<span style={styles.filterPill}>By channel</span>} metric="1,863 orders" state="ready" subtitle="Fulfilled, pending, and returned orders" title="Fulfillment status" trendLabel="+7.4%">
            <StackedBarChart data={fulfillmentByChannelData} format="number" height={280} series={[{
            id: 'fulfilled',
            label: 'Fulfilled',
            data: fulfillmentByChannelData,
            color: '#008060'
          }, {
            id: 'pending',
            label: 'Pending',
            data: fulfillmentByChannelData,
            color: '#b98900'
          }, {
            id: 'returned',
            label: 'Returned',
            data: fulfillmentByChannelData,
            color: '#d72c0d'
          }]} xKey="channel" />
          </ChartCard>

          <div style={styles.wide}>
            <ChartCard actions={<span style={styles.badge}>ComboChart</span>} metric="2,758 orders" state="ready" subtitle="Order volume with conversion rate" title="Orders and conversion" trendLabel="+9.6%">
              <ComboChart data={ordersAndConversionData} height={300} series={[{
              id: 'orders',
              label: 'Orders',
              data: ordersAndConversionData,
              type: 'bar',
              format: 'number',
              color: '#2c6ecb'
            }, {
              id: 'conversionRate',
              label: 'Conversion rate',
              data: ordersAndConversionData,
              type: 'line',
              format: 'percent',
              color: '#008060'
            }]} xFormat="date" xKey="date" />
            </ChartCard>
          </div>

          <ChartCard actions={<span style={styles.badge}>ChartCard</span>} metric="$55.7K" state="ready" subtitle="Card shell with header, metric, controls, and content" title="Top products" trendLabel="+5.2%">
            <StackedBarChart data={topProductsData} format="currency" height={260} series={[{
            id: 'revenue',
            label: 'Revenue',
            data: topProductsData,
            color: '#5c6ac4'
          }]} xKey="product" />
          </ChartCard>
        </section>
      </div>
    </main>;
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: () => <PhaseOneOverview />
}`,...l.parameters?.docs?.source}}};const A=["PhaseOneOverview","Overview"];export{l as Overview,a as PhaseOneOverview,A as __namedExportsOrder,W as default};
