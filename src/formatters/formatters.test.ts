import {
  formatChartDate,
  formatChartNumber,
  formatChartPercent,
  formatChartCurrency,
  formatChartValue
} from './formatters';
import { chartFormatters } from '../index';

describe('chart formatters', () => {
  it('uses en-US as the default locale for deterministic output', () => {
    expect(formatChartNumber(1200)).toBe('1,200');
    expect(formatChartCurrency(1234.5, { currency: 'USD' })).toBe('$1,234.50');
    expect(formatChartPercent(0.42)).toBe('42%');
  });

  it('formats zero without treating it as empty', () => {
    expect(formatChartNumber(0)).toBe('0');
    expect(formatChartCurrency(0, { currency: 'USD' })).toBe('$0.00');
    expect(formatChartPercent(0)).toBe('0%');
  });

  it('abbreviates large numbers with compact notation', () => {
    expect(formatChartNumber(1_250_000, { notation: 'compact' })).toBe('1.3M');
    expect(formatChartValue(9_876_543_210, 'compact')).toBe('9.9B');
  });

  it('formats decimal percentages as percentage values', () => {
    expect(formatChartPercent(0.1234)).toBe('12.3%');
    expect(formatChartValue(0.005, 'percent')).toBe('0.5%');
  });

  it('formats currency with different currency codes', () => {
    expect(formatChartCurrency(1234.5, { currency: 'USD' })).toBe('$1,234.50');
    expect(formatChartCurrency(1234.5, { currency: 'EUR' })).toBe('€1,234.50');
    expect(formatChartCurrency(1234, { currency: 'JPY' })).toBe('¥1,234');
  });

  it('formats dates in a requested timezone', () => {
    const date = new Date('2026-08-08T16:30:00.000Z');

    expect(formatChartDate(date, { timeZone: 'UTC' })).toBe('Aug 8, 2026');
    expect(formatChartDate(date, { timeZone: 'Asia/Shanghai' })).toBe('Aug 9, 2026');
  });

  it('returns an empty string for nullish values', () => {
    expect(formatChartValue(null, 'number')).toBe('');
    expect(formatChartValue(undefined, 'currency')).toBe('');
    expect(formatChartDate(null)).toBe('');
  });

  it('exports the formatter helpers from the package entry', () => {
    expect(chartFormatters.number(1200)).toBe('1,200');
    expect(chartFormatters.percent(0.42)).toBe('42%');
  });
});
