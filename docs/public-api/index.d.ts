import * as react from 'react';
import { ReactNode, ComponentProps, CSSProperties } from 'react';
import { LineChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar, Line, Area } from 'recharts';

type ChartValue = string | number | Date | null | undefined;
interface ChartDatum {
    label?: string;
    value?: ChartValue;
    date?: string | number | Date;
}
interface ChartAccessibilityOptions {
    label: string;
    description?: ReactNode;
    dataTable?: ReactNode;
}
interface ChartGapConnectorOptions {
    strokeDasharray?: string | number;
    color?: string;
    strokeWidth?: number;
    opacity?: number;
}
interface ChartSeries<TDatum extends object = ChartDatum> {
    id: string;
    label: string;
    data: TDatum[];
    color?: string;
    opacity?: number;
    strokeDasharray?: string | number;
    strokeWidth?: number;
    connectGaps?: boolean | ChartGapConnectorOptions;
}
type ChartFormat = 'number' | 'currency' | 'percent' | 'compact' | 'date';
type ChartCardState = 'loading' | 'empty' | 'error' | 'no-permission' | 'stale' | 'ready';
/** @deprecated Use ChartCardState. */
type ChartState = ChartCardState;
type ChartContentState = 'loading' | 'empty' | 'error' | 'ready';
/** @deprecated Use ChartContentState. */
type ChartInlineState = ChartContentState;
interface ChartSkeletonOptions {
    label?: ReactNode;
    lineCount?: number;
}
/** @deprecated Use ChartSkeletonOptions. */
type TrendChartSkeletonOptions = ChartSkeletonOptions;
interface ChartRevealOptions {
    active?: boolean;
    delayMs?: number;
    durationMs?: number;
    label?: ReactNode;
}
/** @deprecated Use ChartRevealOptions. */
type TrendChartRevealOptions = ChartRevealOptions;
interface ChartMargin {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
}
interface CartesianAxisOptions {
    domain?: [number | 'auto', number | 'auto'];
    ticks?: Array<number | string>;
    tickColor?: string;
    tickFontSize?: number;
    axisLine?: boolean;
    tickLine?: boolean;
    minTickGap?: number;
    interval?: number | 'preserveStart' | 'preserveEnd' | 'preserveStartEnd';
    width?: number;
}
interface ChartGridOptions {
    horizontal?: boolean;
    vertical?: boolean;
    stroke?: string;
    strokeDasharray?: string;
}
interface ChartTooltipPayloadItem<TDatum extends object = ChartDatum, TSeries extends ChartSeries<TDatum> = ChartSeries<TDatum>> {
    color?: string;
    data?: TDatum;
    dataKey?: string;
    name?: string;
    series?: TSeries;
    value?: ChartValue;
}
interface ChartTooltipContentProps<TDatum extends object = ChartDatum, TSeries extends ChartSeries<TDatum> = ChartSeries<TDatum>> {
    active?: boolean;
    label?: ChartValue;
    payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>;
    series: Array<TSeries>;
    format: ChartFormat;
    formatOptions: ChartValueFormatOptions;
    xFormat?: ChartFormat;
    xFormatOptions: ChartValueFormatOptions;
    formatLabel: (label: ChartValue, payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>) => ReactNode;
    formatValue: (value: ChartValue, series?: TSeries) => ReactNode;
}
type ChartTooltipContentRenderer<TDatum extends object = ChartDatum, TSeries extends ChartSeries<TDatum> = ChartSeries<TDatum>> = (props: ChartTooltipContentProps<TDatum, TSeries>) => ReactNode;
interface ChartTooltipOptions<TDatum extends object = ChartDatum, TSeries extends ChartSeries<TDatum> = ChartSeries<TDatum>> {
    cursor?: false | ChartTooltipCursorOptions;
    content?: ChartTooltipContentRenderer<TDatum, TSeries>;
    labelFormatter?: (label: ChartValue, payload?: Array<ChartTooltipPayloadItem<TDatum, TSeries>>) => ReactNode;
    valueFormatter?: (value: ChartValue, series?: TSeries) => ReactNode;
    minWidth?: number;
    className?: string;
}
interface ChartTooltipCursorOptions {
    stroke?: string;
    strokeDasharray?: string;
    strokeWidth?: number;
    fill?: string;
}
interface ChartDotOptions {
    className?: string;
    cx?: number;
    cy?: number;
    r?: number | string | 'auto';
    clipDot?: boolean;
    show?: 'all' | 'isolated' | 'none';
}
interface ChartActiveDotOptions extends Omit<ChartDotOptions, 'show' | 'r'> {
    r?: number | string;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
}
interface ChartLineOptions {
    dot?: boolean | ChartDotOptions;
    activeDot?: boolean | ChartActiveDotOptions;
}

type ControlledCartesianChartProps = Omit<ComponentProps<typeof LineChart>, 'accessibilityLayer' | 'children' | 'data' | 'dataKey' | 'layout'>;
type ControlledXAxisProps = Omit<ComponentProps<typeof XAxis>, 'children' | 'dataKey' | 'tickFormatter' | 'type' | 'xAxisId' | 'yAxisId'>;
type ControlledYAxisProps = Omit<ComponentProps<typeof YAxis>, 'children' | 'dataKey' | 'tickFormatter' | 'type' | 'xAxisId' | 'yAxisId'>;
type ControlledCartesianGridProps = Omit<ComponentProps<typeof CartesianGrid>, 'children' | 'xAxisId' | 'yAxisId'>;
type ControlledTooltipProps = Omit<ComponentProps<typeof Tooltip>, 'axisId' | 'content' | 'formatter' | 'labelFormatter'>;
type ControlledLineProps = Omit<ComponentProps<typeof Line>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stroke' | 'type' | 'xAxisId' | 'yAxisId'>;
type ControlledAreaProps = Omit<ComponentProps<typeof Area>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stackId' | 'stroke' | 'type' | 'xAxisId' | 'yAxisId'>;
type ControlledBarProps = Omit<ComponentProps<typeof Bar>, 'children' | 'data' | 'dataKey' | 'fill' | 'formatter' | 'name' | 'stroke' | 'stackId' | 'xAxisId' | 'yAxisId'>;
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
interface TrendChartRechartsProps extends CartesianRechartsProps {
    line?: ControlledLineProps;
    area?: ControlledAreaProps;
}
/**
 * Controlled Recharts props accepted by `StackedBarChart`.
 *
 * Chart data, stack identity, series binding, and tooltip content/formatters
 * remain owned by `StackedBarChart`.
 */
interface StackedBarChartRechartsProps extends CartesianRechartsProps {
    bar?: ControlledBarProps;
}
/**
 * Controlled Recharts props accepted by `ComboChart`.
 *
 * Chart data, axis identity, series type, series binding, and tooltip content/
 * formatters remain owned by `ComboChart`.
 */
interface ComboChartRechartsProps extends CartesianRechartsProps {
    bar?: ControlledBarProps;
    line?: ControlledLineProps;
}

interface ChartNumberFormatOptions {
    locale?: string;
    notation?: 'standard' | 'compact';
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
}
interface ChartCurrencyFormatOptions {
    locale?: string;
    currency?: string;
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
}
interface ChartPercentFormatOptions {
    locale?: string;
    maximumFractionDigits?: number;
    minimumFractionDigits?: number;
}
interface ChartDateFormatOptions {
    locale?: string;
    timeZone?: string;
}
type FormatNumberOptions = Omit<ChartNumberFormatOptions, 'notation'>;
type FormatCompactNumberOptions = Omit<ChartNumberFormatOptions, 'notation'>;
type FormatMoneyOptions = ChartCurrencyFormatOptions;
type FormatDateOptions = ChartDateFormatOptions;
interface FormatPercentageOptions extends ChartPercentFormatOptions {
    /** Whether the input is a ratio (0.042) or a percentage value (4.2). */
    input?: 'percent' | 'ratio';
}
interface ChartValueFormatOptions extends ChartNumberFormatOptions, ChartCurrencyFormatOptions, ChartPercentFormatOptions, ChartDateFormatOptions {
}
type NullableChartValue = string | number | Date | null | undefined;
/** @deprecated Use formatNumber or formatCompactNumber. */
declare function formatChartNumber(value: number | null | undefined, options?: ChartNumberFormatOptions): string;
/** @deprecated Use formatMoney. */
declare function formatChartCurrency(value: number | null | undefined, options?: ChartCurrencyFormatOptions): string;
/** @deprecated Use formatPercentage. */
declare function formatChartPercent(value: number | null | undefined, options?: ChartPercentFormatOptions): string;
/** @deprecated Use formatDate. */
declare function formatChartDate(value: string | number | Date | null | undefined, options?: ChartDateFormatOptions): string;
/** @deprecated Use a specific display formatter. */
declare function formatChartValue(value: NullableChartValue, format?: ChartFormat, options?: ChartValueFormatOptions): string;
declare function formatNumber(value: number | null | undefined, options?: FormatNumberOptions): string;
declare function formatCompactNumber(value: number | null | undefined, options?: FormatCompactNumberOptions): string;
declare function formatMoney(value: number | null | undefined, options?: FormatMoneyOptions): string;
declare function formatPercentage(value: number | null | undefined, options?: FormatPercentageOptions): string;
declare function formatDate(value: string | number | Date | null | undefined, options?: FormatDateOptions): string;
/** @deprecated Use the named display formatter functions. */
declare const chartFormatters: {
    currency: typeof formatChartCurrency;
    date: typeof formatChartDate;
    number: typeof formatChartNumber;
    percent: typeof formatChartPercent;
    value: typeof formatChartValue;
};

interface AnalyticsSeries<TDatum extends object> {
    dataKey: keyof TDatum & string;
    label: string;
    color?: string;
    opacity?: number;
    strokeDasharray?: string | number;
    strokeWidth?: number;
}
type PercentageInput = 'percent' | 'ratio';
declare function createAnalyticsSeries<TDatum extends object>(data: TDatum[], definition: AnalyticsSeries<TDatum>): ChartSeries<TDatum>;
declare function normalizePercentageData<TDatum extends object>(data: TDatum[], dataKeys: ReadonlyArray<keyof TDatum & string>, input: PercentageInput): TDatum[];

interface FunnelDatum {
    id: string;
    label: ReactNode;
    value: number;
    conversion?: number;
    dropOff?: number;
}
type FunnelPercentageInput = PercentageInput;
declare function normalizeFunnelData<TDatum extends FunnelDatum>(data: TDatum[], percentageInput: FunnelPercentageInput): TDatum[];

interface FunnelChartProps {
    accessibility?: ChartAccessibilityOptions;
    colors?: readonly string[];
    data: FunnelDatum[];
    emptyMessage?: ReactNode;
    errorMessage?: ReactNode;
    format?: ChartFormat;
    formatOptions?: ChartValueFormatOptions;
    height?: number;
    loadingLabel?: ReactNode;
    onRetry?: () => void;
    percentageInput?: FunnelPercentageInput;
    retryAction?: ReactNode;
    retryLabel?: ReactNode;
    reveal?: boolean | ChartRevealOptions;
    skeleton?: boolean | ChartSkeletonOptions;
    state?: ChartContentState;
    title?: ReactNode;
}
declare function FunnelChart({ accessibility, colors, data, emptyMessage, errorMessage, format, formatOptions: suppliedFormatOptions, height, loadingLabel, onRetry, percentageInput, retryAction, retryLabel, reveal, skeleton, state, title }: FunnelChartProps): react.JSX.Element;

interface AnalyticsSeriesPreset {
    readonly color: string;
    readonly label: string;
    readonly opacity?: number;
    readonly strokeDasharray?: string | number;
    readonly strokeWidth?: number;
}
interface AnalyticsAxisPreset {
    readonly format: ChartFormat;
    readonly formatOptions?: Readonly<ChartValueFormatOptions>;
}
interface AnalyticsTrendPreset {
    readonly axis: AnalyticsAxisPreset;
    readonly comparisonSeries?: AnalyticsSeriesPreset;
    readonly currentSeries: AnalyticsSeriesPreset;
    readonly format: ChartFormat;
    readonly formatOptions?: Readonly<ChartValueFormatOptions>;
}
interface AnalyticsFunnelPreset {
    readonly colors: readonly string[];
    readonly format: ChartFormat;
    readonly percentageInput: FunnelPercentageInput;
}

declare const revenueTrendPreset: AnalyticsTrendPreset;
declare const orderTrendPreset: AnalyticsTrendPreset;
declare const conversionTrendPreset: AnalyticsTrendPreset;
declare const customerTrendPreset: AnalyticsTrendPreset;
declare const upsellConversionPreset: AnalyticsTrendPreset;
declare const funnelPreset: AnalyticsFunnelPreset;

interface ChartAccessibilityRegionProps {
    accessibility?: ChartAccessibilityOptions;
    children: ReactNode;
}
declare function ChartAccessibilityRegion({ accessibility, children }: ChartAccessibilityRegionProps): react.JSX.Element;

interface ChartCardProps {
    title: ReactNode;
    subtitle?: ReactNode;
    metric?: ReactNode;
    trendLabel?: ReactNode;
    actions?: ReactNode;
    filters?: ReactNode;
    state: ChartCardState;
    errorMessage?: ReactNode;
    children?: ReactNode;
}
declare function ChartCard({ actions, children, errorMessage, filters, metric, state, subtitle, title, trendLabel }: ChartCardProps): react.JSX.Element;

interface ChartMessages {
    chartEmpty: ReactNode;
    chartError: ReactNode;
    chartLoading: ReactNode;
    chartLegend: string;
    chartNoPermission: ReactNode;
    chartPreparing: ReactNode;
    chartStale: ReactNode;
    funnelConversion: ReactNode;
    funnelDropOff: ReactNode;
    funnelStage: ReactNode;
    funnelStages: ReactNode;
    funnelValue: ReactNode;
    metricLoading: ReactNode;
    retry: ReactNode;
}
interface ChartLocalizationValue {
    currency: string;
    locale: string;
    messages: ChartMessages;
    timeZone?: string;
}
interface ChartLocalizationProviderProps {
    children: ReactNode;
    currency?: string;
    locale?: string;
    messages?: Partial<ChartMessages>;
    timeZone?: string;
}
declare const defaultChartMessages: ChartMessages;
declare function ChartLocalizationProvider({ children, currency, locale, messages, timeZone }: ChartLocalizationProviderProps): react.JSX.Element;
declare function useChartLocalization(): ChartLocalizationValue;

interface ChartSkeletonLayoutProps {
    ariaLabel?: string;
    children: ReactNode;
    className?: string;
    columns?: number | string;
    gap?: number | string;
    style?: CSSProperties;
}
interface ChartRevealRegionProps {
    children: ReactNode;
    className?: string;
    label: string;
    minHeight?: number;
    mode?: 'overlay' | 'replace';
    ready: boolean;
    skeleton?: ReactNode;
    style?: CSSProperties;
}
declare function ChartSkeletonLayout({ ariaLabel, children, className, columns, gap, style }: ChartSkeletonLayoutProps): react.JSX.Element;
declare function ChartRevealRegion({ children, className, label, minHeight, mode, ready, skeleton, style }: ChartRevealRegionProps): react.JSX.Element;

interface ChartStateRegionProps {
    children: ReactNode;
    emptyMessage?: ReactNode;
    errorMessage?: ReactNode;
    loadingLabel?: ReactNode;
    minHeight?: number;
    onRetry?: () => void;
    reveal?: boolean | ChartRevealOptions;
    retryAction?: ReactNode;
    retryLabel?: ReactNode;
    skeleton?: boolean | ChartSkeletonOptions;
    state?: ChartContentState;
}
declare function ChartStateRegion({ children, emptyMessage, errorMessage, loadingLabel, minHeight, onRetry, reveal, retryAction, retryLabel, skeleton, state }: ChartStateRegionProps): react.JSX.Element;

type ComboChartSeriesType = 'bar' | 'line';
interface ComboChartSeries<TDatum extends object = ChartDatum> extends ChartSeries<TDatum> {
    type: ComboChartSeriesType;
    format?: ChartFormat;
    formatOptions?: ChartValueFormatOptions;
}
interface ComboChartProps<TDatum extends object = ChartDatum> {
    accessibility?: ChartAccessibilityOptions;
    title?: ReactNode;
    data: TDatum[];
    xKey: keyof TDatum & string;
    series: Array<ComboChartSeries<TDatum>>;
    showLegend?: boolean;
    margin?: ChartMargin;
    xAxis?: CartesianAxisOptions;
    yAxis?: CartesianAxisOptions;
    grid?: ChartGridOptions;
    tooltip?: ChartTooltipOptions<TDatum, ComboChartSeries<TDatum>>;
    line?: ChartLineOptions;
    rechartsProps?: ComboChartRechartsProps;
    height?: number;
    format?: ChartFormat;
    formatOptions?: ChartValueFormatOptions;
    xFormat?: ChartFormat;
    xFormatOptions?: ChartValueFormatOptions;
    emptyMessage?: ReactNode;
    errorMessage?: ReactNode;
    loadingLabel?: ReactNode;
    onRetry?: () => void;
    retryAction?: ReactNode;
    retryLabel?: ReactNode;
    reveal?: boolean | ChartRevealOptions;
    skeleton?: boolean | ChartSkeletonOptions;
    state?: ChartContentState;
}
declare function ComboChart<TDatum extends object = ChartDatum>({ accessibility, data, emptyMessage, errorMessage, format, formatOptions: suppliedFormatOptions, grid, height, line, loadingLabel, margin, onRetry, rechartsProps, reveal, retryAction, retryLabel, series, showLegend, skeleton, state, title, tooltip, xFormat, xFormatOptions: suppliedXFormatOptions, xAxis, yAxis, xKey }: ComboChartProps<TDatum>): react.JSX.Element;

type TrendMode = 'line' | 'area';
interface TrendChartProps<TDatum extends object = ChartDatum> {
    accessibility?: ChartAccessibilityOptions;
    title?: ReactNode;
    data: TDatum[];
    xKey: keyof TDatum & string;
    series: Array<ChartSeries<TDatum>>;
    showLegend?: boolean;
    margin?: ChartMargin;
    xAxis?: CartesianAxisOptions;
    yAxis?: CartesianAxisOptions;
    grid?: ChartGridOptions;
    tooltip?: ChartTooltipOptions<TDatum>;
    line?: ChartLineOptions;
    rechartsProps?: TrendChartRechartsProps;
    mode?: TrendMode;
    height?: number;
    format?: ChartFormat;
    formatOptions?: ChartValueFormatOptions;
    xFormat?: ChartFormat;
    xFormatOptions?: ChartValueFormatOptions;
    emptyMessage?: ReactNode;
    errorMessage?: ReactNode;
    loadingLabel?: ReactNode;
    onRetry?: () => void;
    retryLabel?: ReactNode;
    reveal?: boolean | TrendChartRevealOptions;
    retryAction?: ReactNode;
    skeleton?: boolean | TrendChartSkeletonOptions;
    state?: ChartContentState;
}
declare function TrendChart<TDatum extends object = ChartDatum>({ accessibility, data, emptyMessage, errorMessage, format, formatOptions: suppliedFormatOptions, grid, height, line, loadingLabel, margin, mode, onRetry, rechartsProps, retryLabel, retryAction, reveal, series, showLegend, skeleton, state, title, tooltip, xFormat, xFormatOptions: suppliedXFormatOptions, xAxis, yAxis, xKey }: TrendChartProps<TDatum>): react.JSX.Element;

interface ComparisonChartProps<TDatum extends object = ChartDatum> extends Omit<TrendChartProps<TDatum>, 'series'> {
    currentSeries: AnalyticsSeries<TDatum>;
    comparisonSeries: AnalyticsSeries<TDatum>;
}
declare function ComparisonChart<TDatum extends object = ChartDatum>({ comparisonSeries, currentSeries, data, ...trendChartProps }: ComparisonChartProps<TDatum>): react.JSX.Element;

interface ConversionTarget {
    color?: string;
    label: string;
    value: number;
}
interface ConversionChartProps<TDatum extends object = ChartDatum> extends Omit<TrendChartProps<TDatum>, 'data' | 'format' | 'series'> {
    data: TDatum[];
    input?: PercentageInput;
    series: Array<AnalyticsSeries<TDatum>>;
    target?: ConversionTarget;
}
declare function ConversionChart<TDatum extends object = ChartDatum>({ data, input, series, target, ...trendChartProps }: ConversionChartProps<TDatum>): react.JSX.Element;

interface DonutChartProps<TDatum extends object = ChartDatum> {
    accessibility?: ChartAccessibilityOptions;
    title?: ReactNode;
    data: TDatum[];
    categoryKey: keyof TDatum & string;
    valueKey: keyof TDatum & string;
    centerLabel?: ReactNode;
    showLegend?: boolean;
    height?: number;
    format?: ChartFormat;
    formatOptions?: ChartValueFormatOptions;
    emptyMessage?: ReactNode;
    errorMessage?: ReactNode;
    loadingLabel?: ReactNode;
    onRetry?: () => void;
    retryAction?: ReactNode;
    retryLabel?: ReactNode;
    reveal?: boolean | ChartRevealOptions;
    skeleton?: boolean | ChartSkeletonOptions;
    state?: ChartContentState;
}
declare function DonutChart<TDatum extends object = ChartDatum>({ accessibility, categoryKey, centerLabel, data, emptyMessage, errorMessage, format, formatOptions: suppliedFormatOptions, height, loadingLabel, onRetry, reveal, retryAction, retryLabel, showLegend, skeleton, state, title, valueKey }: DonutChartProps<TDatum>): react.JSX.Element;

type MetricCardState = 'loading' | 'ready';
type MetricTrendDirection = 'down' | 'neutral' | 'up';
type MetricTrendTone = 'negative' | 'neutral' | 'positive';
interface MetricCardTrend {
    accessibilityLabel?: string;
    direction: MetricTrendDirection;
    tone?: MetricTrendTone;
    value: ReactNode;
}
interface MetricCardProps {
    comparison?: ReactNode;
    loadingLabel?: ReactNode;
    state?: MetricCardState;
    title: ReactNode;
    trend?: MetricCardTrend;
    value: ReactNode;
}
declare function MetricCard({ comparison, loadingLabel, state, title, trend, value }: MetricCardProps): react.JSX.Element;

interface StackedBarChartProps<TDatum extends object = ChartDatum> {
    accessibility?: ChartAccessibilityOptions;
    title?: ReactNode;
    data: TDatum[];
    xKey: keyof TDatum & string;
    series: Array<ChartSeries<TDatum>>;
    showLegend?: boolean;
    margin?: ChartMargin;
    xAxis?: CartesianAxisOptions;
    yAxis?: CartesianAxisOptions;
    grid?: ChartGridOptions;
    tooltip?: ChartTooltipOptions<TDatum>;
    rechartsProps?: StackedBarChartRechartsProps;
    height?: number;
    format?: ChartFormat;
    formatOptions?: ChartValueFormatOptions;
    xFormat?: ChartFormat;
    xFormatOptions?: ChartValueFormatOptions;
    emptyMessage?: ReactNode;
    errorMessage?: ReactNode;
    loadingLabel?: ReactNode;
    onRetry?: () => void;
    retryAction?: ReactNode;
    retryLabel?: ReactNode;
    reveal?: boolean | ChartRevealOptions;
    skeleton?: boolean | ChartSkeletonOptions;
    state?: ChartContentState;
}
declare function StackedBarChart<TDatum extends object = ChartDatum>({ accessibility, data, emptyMessage, errorMessage, format, formatOptions: suppliedFormatOptions, grid, height, loadingLabel, margin, onRetry, rechartsProps, reveal, retryAction, retryLabel, series, showLegend, skeleton, state, title, tooltip, xFormat, xFormatOptions: suppliedXFormatOptions, xAxis, yAxis, xKey }: StackedBarChartProps<TDatum>): react.JSX.Element;

interface ChartTheme {
    readonly surface: {
        readonly background: string;
        readonly border: string;
        readonly subtleBackground: string;
    };
    readonly text: {
        readonly primary: string;
        readonly secondary: string;
    };
    readonly status: {
        readonly negative: string;
        readonly neutral: string;
        readonly positive: string;
    };
    readonly palette: readonly string[];
    readonly axis: {
        readonly fontSize: number;
        readonly lineColor: string;
        readonly tickColor: string;
    };
    readonly grid: {
        readonly stroke: string;
        readonly strokeDasharray: string;
    };
    readonly tooltip: {
        readonly background: string;
        readonly border: string;
        readonly borderRadius: number;
        readonly boxShadow: string;
        readonly textColor: string;
    };
    readonly legend: {
        readonly fontSize: number;
        readonly markerSize: number;
        readonly textColor: string;
    };
}
declare const chartTheme: ChartTheme;

declare const packageName = "@standhigher/charts";
declare const packageVersion = "1.0.0";

export { type AnalyticsAxisPreset, type AnalyticsFunnelPreset, type AnalyticsSeries, type AnalyticsSeriesPreset, type AnalyticsTrendPreset, type CartesianAxisOptions, type ChartAccessibilityOptions, ChartAccessibilityRegion, type ChartAccessibilityRegionProps, type ChartActiveDotOptions, ChartCard, type ChartCardProps, type ChartCardState, type ChartContentState, type ChartCurrencyFormatOptions, type ChartDateFormatOptions, type ChartDatum, type ChartDotOptions, type ChartFormat, type ChartGapConnectorOptions, type ChartGridOptions, type ChartInlineState, type ChartLineOptions, ChartLocalizationProvider, type ChartLocalizationProviderProps, type ChartLocalizationValue, type ChartMargin, type ChartMessages, type ChartNumberFormatOptions, type ChartPercentFormatOptions, type ChartRevealOptions, ChartRevealRegion, type ChartRevealRegionProps, type ChartSeries, ChartSkeletonLayout, type ChartSkeletonLayoutProps, type ChartSkeletonOptions, type ChartState, ChartStateRegion, type ChartStateRegionProps, type ChartTheme, type ChartTooltipContentProps, type ChartTooltipContentRenderer, type ChartTooltipCursorOptions, type ChartTooltipOptions, type ChartTooltipPayloadItem, type ChartValue, type ChartValueFormatOptions, ComboChart, type ComboChartProps, type ComboChartRechartsProps, type ComboChartSeries, type ComboChartSeriesType, ComparisonChart, type ComparisonChartProps, ConversionChart, type ConversionChartProps, type ConversionTarget, DonutChart, type DonutChartProps, type FormatCompactNumberOptions, type FormatDateOptions, type FormatMoneyOptions, type FormatNumberOptions, type FormatPercentageOptions, FunnelChart, type FunnelChartProps, type FunnelDatum, type FunnelPercentageInput, MetricCard, type MetricCardProps, type MetricCardState, type MetricCardTrend, type MetricTrendDirection, type MetricTrendTone, type PercentageInput, StackedBarChart, type StackedBarChartProps, type StackedBarChartRechartsProps, TrendChart, type TrendChartProps, type TrendChartRechartsProps, type TrendChartRevealOptions, type TrendChartSkeletonOptions, chartFormatters, chartTheme, conversionTrendPreset, createAnalyticsSeries, customerTrendPreset, defaultChartMessages, formatChartCurrency, formatChartDate, formatChartNumber, formatChartPercent, formatChartValue, formatCompactNumber, formatDate, formatMoney, formatNumber, formatPercentage, funnelPreset, normalizeFunnelData, normalizePercentageData, orderTrendPreset, packageName, packageVersion, revenueTrendPreset, upsellConversionPreset, useChartLocalization };
