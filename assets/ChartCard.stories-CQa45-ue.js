import{j as e}from"./jsx-runtime-DnvfWPe3.js";import{C as m}from"./ChartCard-BLdy_HVq.js";import"./iframe-MpPk-H-V.js";import"./preload-helper-PPVm8Dsz.js";const r=()=>e.jsx("div",{style:{alignItems:"end",display:"grid",gap:8,gridTemplateColumns:"repeat(12, minmax(0, 1fr))",minHeight:208,width:"100%"},children:[48,72,58,90,82,116,96,128,112,142,124,156].map((d,i)=>e.jsx("div",{"aria-hidden":"true",style:{background:i%3===0?"#2c6ecb":"#008060",borderRadius:"4px 4px 0 0",height:d}},i))}),h={title:"Components/ChartCard",component:m,args:{title:"Sales over time",subtitle:"Last 30 days",metric:"$12,400",trendLabel:"+8.2%",actions:e.jsx("button",{type:"button",children:"Export"}),filters:e.jsx("button",{type:"button",children:"Last 30 days"})}},a={args:{state:"ready",children:e.jsx(r,{})}},s={args:{state:"loading",children:e.jsx(r,{})}},t={args:{state:"empty",children:e.jsx(r,{})}},o={args:{state:"error",errorMessage:"Revenue API unavailable",children:e.jsx(r,{})}},n={args:{state:"no-permission",children:e.jsx(r,{})}},c={args:{state:"stale",children:e.jsx(r,{})}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'ready',
    children: <DemoChart />
  }
}`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'loading',
    children: <DemoChart />
  }
}`,...s.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'empty',
    children: <DemoChart />
  }
}`,...t.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'error',
    errorMessage: 'Revenue API unavailable',
    children: <DemoChart />
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'no-permission',
    children: <DemoChart />
  }
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    state: 'stale',
    children: <DemoChart />
  }
}`,...c.parameters?.docs?.source}}};const x=["Ready","Loading","Empty","Error","NoPermission","Stale"];export{t as Empty,o as Error,s as Loading,n as NoPermission,a as Ready,c as Stale,x as __namedExportsOrder,h as default};
