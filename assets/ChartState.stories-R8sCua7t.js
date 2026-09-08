import{j as r}from"./jsx-runtime-CvIp3Bc9.js";import{C as c}from"./ChartState-sAfNnfiz.js";import"./iframe-CGgJigSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./ChartLocalization-Dk0sEoCu.js";const e=()=>r.jsx("div",{style:{background:"#f1f2f4",minHeight:220,padding:24},children:"Chart content"}),u={title:"Components/ChartStateRegion",component:c},a={args:{children:r.jsx(e,{}),state:"loading"}},t={args:{children:r.jsx(e,{}),state:"empty"}},s={args:{children:r.jsx(e,{}),errorMessage:"Revenue API unavailable",onRetry:()=>{},state:"error"}},o={args:{children:r.jsx(e,{}),errorMessage:"Revenue API unavailable",retryAction:r.jsx("a",{href:"#support",children:"Contact support"}),state:"error"}},n={args:{children:r.jsx(e,{}),reveal:{active:!0,label:"Preparing chart"}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Placeholder />,
    state: 'loading'
  }
}`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Placeholder />,
    state: 'empty'
  }
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Placeholder />,
    errorMessage: 'Revenue API unavailable',
    onRetry: () => undefined,
    state: 'error'
  }
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Placeholder />,
    errorMessage: 'Revenue API unavailable',
    retryAction: <a href="#support">Contact support</a>,
    state: 'error'
  }
}`,...o.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  args: {
    children: <Placeholder />,
    reveal: {
      active: true,
      label: 'Preparing chart'
    }
  }
}`,...n.parameters?.docs?.source}}};const g=["Loading","Empty","ErrorWithRetry","ErrorWithCustomRetryAction","Reveal"];export{t as Empty,o as ErrorWithCustomRetryAction,s as ErrorWithRetry,a as Loading,n as Reveal,g as __namedExportsOrder,u as default};
