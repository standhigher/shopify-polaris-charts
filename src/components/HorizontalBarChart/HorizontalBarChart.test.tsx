import { render, screen } from '@testing-library/react';

import { HorizontalBarChart } from './HorizontalBarChart';

const deliveryDurationData = [
  { label: '0–3 days', value: 0 },
  { label: '4–7 days', value: 78, color: '#3b82f6' },
  { label: '8–15 days', value: 22, color: '#f59e0b' },
  { label: '16–30 days', value: 0 },
  { label: '31+ days', value: null }
];

describe('HorizontalBarChart', () => {
  it('keeps zero and missing-value categories visible while rendering percentage labels', () => {
    render(
      <HorizontalBarChart
        data={deliveryDurationData}
        format="percent"
        percentageInput="percent"
        xAxis={{ domain: [0, 1], ticks: [0, 0.2, 0.4, 0.6, 0.8] }}
      />
    );

    expect(screen.getByText('0–3 days')).toBeVisible();
    expect(screen.getByText('4–7 days')).toBeVisible();
    expect(screen.getByText('8–15 days')).toBeVisible();
    expect(screen.getByText('16–30 days')).toBeVisible();
    expect(screen.getByText('31+ days')).toBeVisible();
    expect(screen.getByText('20%')).toBeVisible();
    expect(screen.getByText('80%')).toBeVisible();
  });

  it('accepts ratio data without treating zero-value categories as an empty chart', () => {
    render(
      <HorizontalBarChart
        data={[
          { label: '0–3 days', value: 0 },
          { label: '4–7 days', value: 0.78 },
          { label: '8–15 days', value: 0.22 }
        ]}
        format="percent"
        percentageInput="ratio"
        xAxis={{ domain: [0, 1], ticks: [0, 0.2, 0.4, 0.6, 0.8] }}
      />
    );

    expect(screen.queryByText('No data available')).not.toBeInTheDocument();
    expect(screen.getByText('4–7 days')).toBeVisible();
  });

  it('uses the shared error state and keeps the chart title available', () => {
    render(
      <HorizontalBarChart
        data={deliveryDurationData}
        errorMessage="Delivery duration data is unavailable"
        state="error"
        title="Delivery duration distribution"
      />
    );

    expect(screen.getByRole('heading', { name: 'Delivery duration distribution' })).toBeVisible();
    expect(screen.getByRole('alert')).toHaveTextContent('Delivery duration data is unavailable');
  });
});
