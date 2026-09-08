import{j as r}from"./jsx-runtime-CvIp3Bc9.js";import{F as i}from"./FunnelChart-CxeAGpnk.js";import{C as p}from"./ChartCard-BdSuyNeK.js";import"./iframe-CGgJigSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./ChartState-sAfNnfiz.js";import"./ChartLocalization-Dk0sEoCu.js";import"./analytics-Bf0DabMZ.js";import"./ChartAccessibility-C4aVgj8s.js";const e=[{id:"view",label:"Product view",value:12480},{conversion:.34,dropOff:.66,id:"cart",label:"Add to cart",value:4243},{conversion:.46,dropOff:.54,id:"checkout",label:"Checkout",value:1952},{conversion:.58,dropOff:.42,id:"purchase",label:"Purchase",value:1132}],m=[{id:"shown",label:"Offer shown",value:8420},{conversion:.073,dropOff:.927,id:"accepted",label:"Offer accepted",value:615}],x={component:i,title:"Components/FunnelChart"},a={args:{data:e,title:"Online store funnel"}},n={args:{data:m,title:"Post-purchase upsell"}},t={args:{data:[...e.slice(0,3),{conversion:0,dropOff:1,id:"purchase",label:"Purchase",value:0}]}},o={args:{data:[{id:"first",label:"Checkout started from an intentionally long translated storefront campaign label",value:82},{conversion:.5,dropOff:.5,id:"second",label:"Checkout",value:41},{conversion:.5,dropOff:.5,id:"third",label:"Checkout",value:20}]}},f={maxWidth:320},s={args:{data:e},render:()=>r.jsx("div",{style:f,children:r.jsx(i,{data:e})})},c={args:{data:e,state:"loading"}},d={args:{data:[],emptyMessage:"No funnel activity for this period"}},l={args:{data:e,errorMessage:"Funnel data could not be loaded",onRetry:()=>{},state:"error"}},u={args:{data:e},render:()=>r.jsx(p,{state:"ready",title:"Online store funnel",children:r.jsx(i,{data:e,retryAction:r.jsx("a",{href:"#support",children:"Contact support"}),state:"error"})})};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    data: productFunnel,
    title: 'Online store funnel'
  }
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    data: upsellFunnel,
    title: 'Post-purchase upsell'
  }
}`,...n.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    data: [...productFunnel.slice(0, 3), {
      conversion: 0,
      dropOff: 1,
      id: 'purchase',
      label: 'Purchase',
      value: 0
    }]
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    data: [{
      id: 'first',
      label: 'Checkout started from an intentionally long translated storefront campaign label',
      value: 82
    }, {
      conversion: 0.5,
      dropOff: 0.5,
      id: 'second',
      label: 'Checkout',
      value: 41
    }, {
      conversion: 0.5,
      dropOff: 0.5,
      id: 'third',
      label: 'Checkout',
      value: 20
    }]
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    data: productFunnel
  },
  render: () => <div style={narrowStyle}><FunnelChart data={productFunnel} /></div>
}`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    data: productFunnel,
    state: 'loading'
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    data: [],
    emptyMessage: 'No funnel activity for this period'
  }
}`,...d.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    data: productFunnel,
    errorMessage: 'Funnel data could not be loaded',
    onRetry: () => undefined,
    state: 'error'
  }
}`,...l.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    data: productFunnel
  },
  render: () => <ChartCard state="ready" title="Online store funnel">
      <FunnelChart data={productFunnel} retryAction={<a href="#support">Contact support</a>} state="error" />
    </ChartCard>
}`,...u.parameters?.docs?.source}}};const P=["ProductPurchase","UpsellConversion","ZeroStage","LongAndDuplicateLabels","NarrowContainer","Loading","Empty","ErrorWithRetry","CustomRetryAction"];export{u as CustomRetryAction,d as Empty,l as ErrorWithRetry,c as Loading,o as LongAndDuplicateLabels,s as NarrowContainer,a as ProductPurchase,n as UpsellConversion,t as ZeroStage,P as __namedExportsOrder,x as default};
