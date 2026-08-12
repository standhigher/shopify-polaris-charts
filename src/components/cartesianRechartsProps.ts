const chartBindingProps = ['children', 'data', 'dataKey', 'layout'];
const axisBindingProps = ['children', 'dataKey', 'tickFormatter', 'type', 'xAxisId', 'yAxisId'];
const gridBindingProps = ['children', 'xAxisId', 'yAxisId'];
const tooltipBindingProps = ['axisId', 'content', 'formatter', 'labelFormatter'];
const lineBindingProps = [
  'children',
  'data',
  'dataKey',
  'fill',
  'formatter',
  'name',
  'stackId',
  'stroke',
  'type',
  'xAxisId',
  'yAxisId'
];
const areaBindingProps = lineBindingProps;
const barBindingProps = [
  'children',
  'data',
  'dataKey',
  'fill',
  'formatter',
  'name',
  'stroke',
  'stackId',
  'xAxisId',
  'yAxisId'
];

function omitBindingProps<TProps extends object>(props: TProps | undefined, blockedProps: readonly string[]) {
  if (!props) {
    return undefined;
  }

  const safeProps = { ...props } as Record<string, unknown>;

  for (const propName of blockedProps) {
    delete safeProps[propName];
  }

  return safeProps as TProps;
}

export const getChartRechartsProps = <TProps extends object>(props: TProps | undefined) =>
  omitBindingProps(props, chartBindingProps);

export const getXAxisRechartsProps = <TProps extends object>(props: TProps | undefined) =>
  omitBindingProps(props, axisBindingProps);

export const getYAxisRechartsProps = <TProps extends object>(props: TProps | undefined) =>
  omitBindingProps(props, axisBindingProps);

export const getCartesianGridRechartsProps = <TProps extends object>(props: TProps | undefined) =>
  omitBindingProps(props, gridBindingProps);

export const getTooltipRechartsProps = <TProps extends object>(props: TProps | undefined) =>
  omitBindingProps(props, tooltipBindingProps);

export const getLineRechartsProps = <TProps extends object>(props: TProps | undefined) =>
  omitBindingProps(props, lineBindingProps);

export const getAreaRechartsProps = <TProps extends object>(props: TProps | undefined) =>
  omitBindingProps(props, areaBindingProps);

export const getBarRechartsProps = <TProps extends object>(props: TProps | undefined) =>
  omitBindingProps(props, barBindingProps);
