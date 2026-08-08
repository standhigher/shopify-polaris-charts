import type { ChartFormat } from '../types';

export interface ChartNumberFormatOptions {
  locale?: string;
  notation?: 'standard' | 'compact';
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export interface ChartCurrencyFormatOptions {
  locale?: string;
  currency?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export interface ChartPercentFormatOptions {
  locale?: string;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
}

export interface ChartDateFormatOptions {
  locale?: string;
  timeZone?: string;
}

export interface ChartValueFormatOptions
  extends ChartNumberFormatOptions,
    ChartCurrencyFormatOptions,
    ChartPercentFormatOptions,
    ChartDateFormatOptions {}

type NullableChartValue = string | number | Date | null | undefined;

const DEFAULT_LOCALE = 'en-US';

const isNullish = (value: NullableChartValue): value is null | undefined =>
  value === null || value === undefined;

export function formatChartNumber(
  value: number | null | undefined,
  options: ChartNumberFormatOptions = {}
): string {
  if (isNullish(value)) {
    return '';
  }

  return new Intl.NumberFormat(options.locale ?? DEFAULT_LOCALE, {
    maximumFractionDigits: options.maximumFractionDigits ?? (options.notation === 'compact' ? 1 : 2),
    minimumFractionDigits: options.minimumFractionDigits,
    notation: options.notation
  }).format(value);
}

export function formatChartCurrency(
  value: number | null | undefined,
  options: ChartCurrencyFormatOptions = {}
): string {
  if (isNullish(value)) {
    return '';
  }

  return new Intl.NumberFormat(options.locale ?? DEFAULT_LOCALE, {
    currency: options.currency ?? 'USD',
    maximumFractionDigits: options.maximumFractionDigits,
    minimumFractionDigits: options.minimumFractionDigits,
    style: 'currency'
  }).format(value);
}

export function formatChartPercent(
  value: number | null | undefined,
  options: ChartPercentFormatOptions = {}
): string {
  if (isNullish(value)) {
    return '';
  }

  return new Intl.NumberFormat(options.locale ?? DEFAULT_LOCALE, {
    maximumFractionDigits: options.maximumFractionDigits ?? 1,
    minimumFractionDigits: options.minimumFractionDigits,
    style: 'percent'
  }).format(value);
}

export function formatChartDate(
  value: string | number | Date | null | undefined,
  options: ChartDateFormatOptions = {}
): string {
  if (isNullish(value)) {
    return '';
  }

  return new Intl.DateTimeFormat(options.locale ?? DEFAULT_LOCALE, {
    day: 'numeric',
    month: 'short',
    timeZone: options.timeZone,
    year: 'numeric'
  }).format(new Date(value));
}

export function formatChartValue(
  value: NullableChartValue,
  format: ChartFormat = 'number',
  options: ChartValueFormatOptions = {}
): string {
  if (isNullish(value)) {
    return '';
  }

  if (format === 'date') {
    return formatChartDate(value, options);
  }

  const numericValue = typeof value === 'number' ? value : Number(value);

  if (Number.isNaN(numericValue)) {
    return '';
  }

  if (format === 'currency') {
    return formatChartCurrency(numericValue, options);
  }

  if (format === 'percent') {
    return formatChartPercent(numericValue, options);
  }

  return formatChartNumber(numericValue, {
    ...options,
    notation: format === 'compact' ? 'compact' : options.notation
  });
}

export const chartFormatters = {
  currency: formatChartCurrency,
  date: formatChartDate,
  number: formatChartNumber,
  percent: formatChartPercent,
  value: formatChartValue
};
