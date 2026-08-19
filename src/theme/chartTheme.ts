export interface ChartTheme {
  surface: {
    background: string;
    border: string;
    subtleBackground: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  status: {
    negative: string;
    neutral: string;
    positive: string;
  };
  palette: string[];
  axis: {
    fontSize: number;
    lineColor: string;
    tickColor: string;
  };
  grid: {
    stroke: string;
    strokeDasharray: string;
  };
  tooltip: {
    background: string;
    border: string;
    borderRadius: number;
    boxShadow: string;
    textColor: string;
  };
  legend: {
    fontSize: number;
    markerSize: number;
    textColor: string;
  };
}

export const chartTheme: ChartTheme = {
  axis: {
    fontSize: 12,
    lineColor: '#dcdfe4',
    tickColor: '#6d7175'
  },
  grid: {
    stroke: '#ebeef2',
    strokeDasharray: '3 3'
  },
  legend: {
    fontSize: 12,
    markerSize: 10,
    textColor: '#6d7175'
  },
  palette: [
    '#2c6ecb',
    '#008060',
    '#b98900',
    '#d72c0d',
    '#5c6ac4',
    '#007ace',
    '#409c32',
    '#9c6ade'
  ],
  surface: {
    background: '#ffffff',
    border: '#dcdfe4',
    subtleBackground: '#f6f6f7'
  },
  status: {
    negative: '#d72c0d',
    neutral: '#6d7175',
    positive: '#008060'
  },
  text: {
    primary: '#202223',
    secondary: '#6d7175'
  },
  tooltip: {
    background: '#ffffff',
    border: '#dcdfe4',
    borderRadius: 8,
    boxShadow: '0 1px 0 rgba(0, 0, 0, 0.05), 0 4px 12px rgba(0, 0, 0, 0.08)',
    textColor: '#202223'
  }
};
