import{j as e}from"./jsx-runtime-DnvfWPe3.js";import{C as r}from"./ChartCard-BLdy_HVq.js";import{T as p}from"./TrendChart-oc9KR7o2.js";import{D as h}from"./DonutChart-R3YbifHh.js";import{S as d}from"./StackedBarChart-76jHouON.js";import{C as u}from"./ComboChart-BSc9juVn.js";import"./iframe-MpPk-H-V.js";import"./preload-helper-PPVm8Dsz.js";import"./formatters-DrRghmWY.js";import"./index-hWR1rVbd.js";import"./index-CBUtDgrM.js";import"./CartesianChart-DRfPDS8-.js";import"./Line-B_vUCrGM.js";import"./tooltipContext-SeZHajY1.js";import"./Bar-D3MYRt7B.js";const n=[{date:"2026-07-20",grossSales:18342.8,netSales:16920.4},{date:"2026-07-21",grossSales:19218.1,netSales:17804.5},{date:"2026-07-22",grossSales:20142.35,netSales:18666.2},{date:"2026-07-23",grossSales:21680.9,netSales:19970.7},{date:"2026-07-24",grossSales:23442.2,netSales:21488.8},{date:"2026-07-25",grossSales:22808.6,netSales:20724.3},{date:"2026-07-26",grossSales:24974.4,netSales:22918.5},{date:"2026-07-27",grossSales:25840.7,netSales:23720.1}],m=[{source:"Direct",sessions:18420},{source:"Search",sessions:14280},{source:"Email",sessions:7240},{source:"Social",sessions:6120},{source:"Referrals",sessions:3480}],l=[{channel:"Online store",fulfilled:812,pending:74,returned:29},{channel:"Shop app",fulfilled:344,pending:41,returned:12},{channel:"Point of sale",fulfilled:288,pending:18,returned:7},{channel:"Social",fulfilled:196,pending:32,returned:10}],o=[{date:"2026-07-20",orders:286,conversionRate:.034},{date:"2026-07-21",orders:302,conversionRate:.036},{date:"2026-07-22",orders:318,conversionRate:.037},{date:"2026-07-23",orders:341,conversionRate:.039},{date:"2026-07-24",orders:366,conversionRate:.041},{date:"2026-07-25",orders:352,conversionRate:.04},{date:"2026-07-26",orders:389,conversionRate:.043},{date:"2026-07-27",orders:404,conversionRate:.045}],c=[{product:"Everyday canvas tote",revenue:18420},{product:"Ribbed travel mug",revenue:15180},{product:"Desk organizer set",revenue:12840},{product:"Minimal gift wrap",revenue:9240}],y=[{label:"Gross sales",value:"$176.5K",delta:"+13.8%"},{label:"Orders",value:"2,758",delta:"+9.6%"},{label:"Conversion rate",value:"4.0%",delta:"+0.4 pts"},{label:"Returning customers",value:"31.7%",delta:"+2.1 pts"}],t={actionButton:{background:"#ffffff",border:"1px solid #babfc3",borderRadius:6,color:"#202223",font:"inherit",fontSize:13,fontWeight:600,lineHeight:1,padding:"8px 12px"},badge:{background:"#f1f2f4",border:"1px solid #dcdfe4",borderRadius:6,color:"#3b3f44",display:"inline-flex",fontSize:12,fontWeight:650,lineHeight:1,padding:"6px 8px"},chartGrid:{display:"grid",gap:16,gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 360px), 1fr))"},dashboard:{background:"#f6f6f7",color:"#202223",fontFamily:'-apple-system, BlinkMacSystemFont, "San Francisco", "Segoe UI", Roboto, "Helvetica Neue", sans-serif',minHeight:"100vh",padding:24},filterPill:{background:"#f6f6f7",border:"1px solid #dcdfe4",borderRadius:6,color:"#3b3f44",fontSize:12,fontWeight:600,lineHeight:1,padding:"7px 10px"},header:{alignItems:"flex-start",display:"flex",gap:16,justifyContent:"space-between",margin:"0 0 16px"},kicker:{color:"#6d7175",fontSize:13,lineHeight:1.4,margin:0},metricGrid:{display:"grid",gap:12,gridTemplateColumns:"repeat(auto-fit, minmax(min(100%, 180px), 1fr))",marginBottom:16},metricLabel:{color:"#6d7175",fontSize:12,lineHeight:1.35,margin:0},metricTile:{background:"#ffffff",border:"1px solid #dcdfe4",borderRadius:8,boxShadow:"0 1px 0 rgba(0, 0, 0, 0.05)",padding:16},metricTrend:{color:"#008060",fontSize:12,fontWeight:650,lineHeight:1.35},metricValue:{color:"#202223",fontSize:22,fontWeight:650,lineHeight:1.2,margin:"6px 0 0"},pageTitle:{fontSize:20,fontWeight:650,letterSpacing:0,lineHeight:1.3,margin:"4px 0"},shell:{margin:"0 auto",maxWidth:1180},wide:{gridColumn:"1 / -1"}},P={title:"Examples/Phase One Overview",parameters:{layout:"fullscreen"}};function a(){return e.jsx("main",{style:t.dashboard,children:e.jsxs("div",{style:t.shell,children:[e.jsxs("header",{style:t.header,children:[e.jsxs("div",{children:[e.jsx("p",{style:t.kicker,children:"Shopify App dashboard sample"}),e.jsx("h1",{style:t.pageTitle,children:"Phase one chart overview"}),e.jsx("p",{style:t.kicker,children:"Last 8 days, compared with previous period"})]}),e.jsx("button",{style:t.actionButton,type:"button",children:"Export"})]}),e.jsx("section",{"aria-label":"Dashboard metrics",style:t.metricGrid,children:y.map(s=>e.jsxs("div",{style:t.metricTile,children:[e.jsx("p",{style:t.metricLabel,children:s.label}),e.jsx("p",{style:t.metricValue,children:s.value}),e.jsx("span",{style:t.metricTrend,children:s.delta})]},s.label))}),e.jsxs("section",{"aria-label":"Phase one chart components",style:t.chartGrid,children:[e.jsx("div",{style:t.wide,children:e.jsx(r,{actions:e.jsx("span",{style:t.badge,children:"TrendChart"}),filters:e.jsx("span",{style:t.filterPill,children:"Daily"}),metric:"$176.5K",state:"ready",subtitle:"Gross sales and net sales",title:"Revenue trend",trendLabel:"+13.8%",children:e.jsx(p,{data:n,format:"currency",height:300,mode:"area",series:[{id:"grossSales",label:"Gross sales",data:n,color:"#2c6ecb"},{id:"netSales",label:"Net sales",data:n,color:"#008060"}],xFormat:"date",xKey:"date"})})}),e.jsx(r,{actions:e.jsx("span",{style:t.badge,children:"DonutChart"}),metric:"49.5K sessions",state:"ready",subtitle:"Sessions by acquisition source",title:"Traffic source mix",children:e.jsx(h,{centerLabel:"49.5K",categoryKey:"source",data:m,format:"compact",height:280,valueKey:"sessions"})}),e.jsx(r,{actions:e.jsx("span",{style:t.badge,children:"StackedBarChart"}),filters:e.jsx("span",{style:t.filterPill,children:"By channel"}),metric:"1,863 orders",state:"ready",subtitle:"Fulfilled, pending, and returned orders",title:"Fulfillment status",trendLabel:"+7.4%",children:e.jsx(d,{data:l,format:"number",height:280,series:[{id:"fulfilled",label:"Fulfilled",data:l,color:"#008060"},{id:"pending",label:"Pending",data:l,color:"#b98900"},{id:"returned",label:"Returned",data:l,color:"#d72c0d"}],xKey:"channel"})}),e.jsx("div",{style:t.wide,children:e.jsx(r,{actions:e.jsx("span",{style:t.badge,children:"ComboChart"}),metric:"2,758 orders",state:"ready",subtitle:"Order volume with conversion rate",title:"Orders and conversion",trendLabel:"+9.6%",children:e.jsx(u,{data:o,height:300,series:[{id:"orders",label:"Orders",data:o,type:"bar",format:"number",color:"#2c6ecb"},{id:"conversionRate",label:"Conversion rate",data:o,type:"line",format:"percent",color:"#008060"}],xFormat:"date",xKey:"date"})})}),e.jsx(r,{actions:e.jsx("span",{style:t.badge,children:"ChartCard"}),metric:"$55.7K",state:"ready",subtitle:"Card shell with header, metric, controls, and content",title:"Top products",trendLabel:"+5.2%",children:e.jsx(d,{data:c,format:"currency",height:260,series:[{id:"revenue",label:"Revenue",data:c,color:"#5c6ac4"}],xKey:"product"})})]})]})})}const i={render:()=>e.jsx(a,{})};a.__docgenInfo={description:"",methods:[],displayName:"PhaseOneOverview"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`function PhaseOneOverview() {
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
          {overviewMetrics.map(metric => <div key={metric.label} style={styles.metricTile}>
              <p style={styles.metricLabel}>{metric.label}</p>
              <p style={styles.metricValue}>{metric.value}</p>
              <span style={styles.metricTrend}>{metric.delta}</span>
            </div>)}
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
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <PhaseOneOverview />
}`,...i.parameters?.docs?.source}}};const B=["PhaseOneOverview","Overview"];export{i as Overview,a as PhaseOneOverview,B as __namedExportsOrder,P as default};
