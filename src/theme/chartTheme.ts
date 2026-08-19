export interface ChartTheme {
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

export const chartTheme: ChartTheme = Object.freeze({
  axis: Object.freeze({
    fontSize: 12,
    lineColor: '#dcdfe4',
    tickColor: '#6d7175'
  }),
  grid: Object.freeze({
    stroke: '#ebeef2',
    strokeDasharray: '3 3'
  }),
  legend: Object.freeze({
    fontSize: 12,
    markerSize: 10,
    textColor: '#6d7175'
  }),
  palette: Object.freeze([
    '#2c6ecb',
    '#008060',
    '#b98900',
    '#d72c0d',
    '#5c6ac4',
    '#007ace',
    '#409c32',
    '#9c6ade'
  ]),
  surface: Object.freeze({
    background: '#ffffff',
    border: '#dcdfe4',
    subtleBackground: '#f6f6f7'
  }),
  status: Object.freeze({
    negative: '#d72c0d',
    neutral: '#6d7175',
    positive: '#008060'
  }),
  text: Object.freeze({
    primary: '#202223',
    secondary: '#6d7175'
  }),
  tooltip: Object.freeze({
    background: '#ffffff',
    border: '#dcdfe4',
    borderRadius: 8,
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.08)',
    textColor: '#202223'
  })
});
