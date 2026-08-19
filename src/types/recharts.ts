import type { ComponentProps } from 'react';
import type {
  Area,
  Bar,
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

type ControlledCartesianChartProps = Omit<
  ComponentProps<typeof LineChart>,
  'accessibilityLayer' | 'children' | 'data' | 'dataKey' | 'layout'
>;

type ControlledXAxisProps = Omit<
  ComponentProps<typeof XAxis>,
  'children' | 'dataKey' | 'tickFormatter' | 'type' | 'xAxisId' | 'yAxisId'
>;

type ControlledYAxisProps = Omit<
  ComponentProps<typeof YAxis>,
  'children' | 'dataKey' | 'tickFormatter' | 'type' | 'xAxisId' | 'yAxisId'
>;

type ControlledCartesianGridProps = Omit<ComponentProps<typeof CartesianGrid>, 'children' | 'xAxisId' | 'yAxisId'>;

type ControlledTooltipProps = Omit<
  ComponentProps<typeof Tooltip>,
  'axisId' | 'content' | 'formatter' | 'labelFormatter'
>;

type ControlledLineProps = Omit<
  ComponentProps<typeof Line>,
  | 'children'
  | 'data'
  | 'dataKey'
  | 'fill'
  | 'formatter'
  | 'name'
  | 'stroke'
  | 'type'
  | 'xAxisId'
  | 'yAxisId'
>;

type ControlledAreaProps = Omit<
  ComponentProps<typeof Area>,
  | 'children'
  | 'data'
  | 'dataKey'
  | 'fill'
  | 'formatter'
  | 'name'
  | 'stackId'
  | 'stroke'
  | 'type'
  | 'xAxisId'
  | 'yAxisId'
>;

type ControlledBarProps = Omit<
  ComponentProps<typeof Bar>,
  | 'children'
  | 'data'
  | 'dataKey'
  | 'fill'
  | 'formatter'
  | 'name'
  | 'stroke'
  | 'stackId'
  | 'xAxisId'
  | 'yAxisId'
>;

interface CartesianRechartsProps {
  /** Props for the underlying Cartesian chart. `margin` here takes precedence over the top-level `margin` prop. */
  chart?: ControlledCartesianChartProps;
  xAxis?: ControlledXAxisProps;
  yAxis?: ControlledYAxisProps;
  tooltip?: ControlledTooltipProps;
  cartesianGrid?: ControlledCartesianGridProps;
}

/**
 * Controlled Recharts props accepted by `TrendChart`.
 *
 * Series binding, chart data, and tooltip content/formatters remain owned by
 * `TrendChart` so this escape hatch cannot alter data identity or formatting.
 */
export interface TrendChartRechartsProps extends CartesianRechartsProps {
  line?: ControlledLineProps;
  area?: ControlledAreaProps;
}

/**
 * Controlled Recharts props accepted by `StackedBarChart`.
 *
 * Chart data, stack identity, series binding, and tooltip content/formatters
 * remain owned by `StackedBarChart`.
 */
export interface StackedBarChartRechartsProps extends CartesianRechartsProps {
  bar?: ControlledBarProps;
}

/**
 * Controlled Recharts props accepted by `ComboChart`.
 *
 * Chart data, axis identity, series type, series binding, and tooltip content/
 * formatters remain owned by `ComboChart`.
 */
export interface ComboChartRechartsProps extends CartesianRechartsProps {
  bar?: ControlledBarProps;
  line?: ControlledLineProps;
}
