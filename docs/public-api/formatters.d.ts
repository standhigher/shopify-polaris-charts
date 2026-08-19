type ChartFormat = 'number' | 'currency' | 'percent' | 'compact' | 'date';

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

export { type ChartCurrencyFormatOptions, type ChartDateFormatOptions, type ChartNumberFormatOptions, type ChartPercentFormatOptions, type ChartValueFormatOptions, type FormatCompactNumberOptions, type FormatDateOptions, type FormatMoneyOptions, type FormatNumberOptions, type FormatPercentageOptions, chartFormatters, formatChartCurrency, formatChartDate, formatChartNumber, formatChartPercent, formatChartValue, formatCompactNumber, formatDate, formatMoney, formatNumber, formatPercentage };
