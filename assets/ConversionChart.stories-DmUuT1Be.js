import{j as e}from"./jsx-runtime-CvIp3Bc9.js";import{C as r}from"./ConversionChart-D0Egtzg-.js";import"./iframe-CGgJigSQ.js";import"./preload-helper-PPVm8Dsz.js";import"./analytics-Bf0DabMZ.js";import"./ChartLocalization-Dk0sEoCu.js";import"./TrendChart-BKnWocs8.js";import"./ChartState-sAfNnfiz.js";import"./smoothCurvePath-Cy0qokdl.js";import"./cartesianRechartsProps-ZNMOvQKd.js";import"./index-DxrsGA-o.js";import"./index-Bd3QtUB_.js";import"./CartesianChart-BmisDhzu.js";import"./ChartAccessibility-C4aVgj8s.js";const a=[{date:"Aug 14",store:.036,email:.051,social:.028},{date:"Aug 15",store:.041,email:.055,social:.032},{date:"Aug 16",store:.042,email:.059,social:.034},{date:"Aug 17",store:.047,email:.062,social:.038}],t=[{dataKey:"store",label:"Store conversion",color:"#008060"}],E={title:"Components/ConversionChart",component:r},o={render:()=>e.jsx(r,{data:a,series:t,title:"Store conversion",xKey:"date"})},s={render:()=>e.jsx(r,{data:a,series:[...t,{dataKey:"email",label:"Email",color:"#2c6ecb"},{dataKey:"social",label:"Social",color:"#9c6ade"}],title:"Conversion by channel",xKey:"date"})},n={render:()=>e.jsx(r,{data:a.map(l=>({...l,store:l.store*100})),input:"percent",series:t,title:"Percentage-valued source data",xKey:"date"})},i={render:()=>e.jsx(r,{data:a,series:t,target:{label:"Goal",value:.05},title:"Store conversion goal",xKey:"date"})},c={render:()=>e.jsx(r,{data:a,series:t,state:"loading",xKey:"date"})},d={render:()=>e.jsx(r,{data:a,errorMessage:"Conversion data is temporarily unavailable.",retryAction:e.jsx("button",{type:"button",children:"Try again"}),series:t,state:"error",xKey:"date"})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  render: () => <ConversionChart data={data} series={storeSeries} title="Store conversion" xKey="date" />
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  render: () => <ConversionChart data={data} series={[...storeSeries, {
    dataKey: 'email',
    label: 'Email',
    color: '#2c6ecb'
  }, {
    dataKey: 'social',
    label: 'Social',
    color: '#9c6ade'
  }]} title="Conversion by channel" xKey="date" />
}`,...s.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <ConversionChart data={data.map(datum => ({
    ...datum,
    store: datum.store * 100
  }))} input="percent" series={storeSeries} title="Percentage-valued source data" xKey="date" />
}`,...n.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  render: () => <ConversionChart data={data} series={storeSeries} target={{
    label: 'Goal',
    value: 0.05
  }} title="Store conversion goal" xKey="date" />
}`,...i.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  render: () => <ConversionChart data={data} series={storeSeries} state="loading" xKey="date" />
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  render: () => <ConversionChart data={data} errorMessage="Conversion data is temporarily unavailable." retryAction={<button type="button">Try again</button>} series={storeSeries} state="error" xKey="date" />
}`,...d.parameters?.docs?.source}}};const M=["StoreConversion","MultiChannel","PercentInput","WithTarget","Loading","Error"];export{d as Error,c as Loading,s as MultiChannel,n as PercentInput,o as StoreConversion,i as WithTarget,M as __namedExportsOrder,E as default};
