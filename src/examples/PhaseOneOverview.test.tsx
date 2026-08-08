import { render, screen } from '@testing-library/react';

import { PhaseOneOverview } from './PhaseOneOverview.stories';

describe('PhaseOneOverview', () => {
  it('renders the phase one component names', () => {
    render(<PhaseOneOverview />);

    expect(screen.getByText('ChartCard')).toBeVisible();
    expect(screen.getByText('TrendChart')).toBeVisible();
    expect(screen.getByText('DonutChart')).toBeVisible();
    expect(screen.getByText('StackedBarChart')).toBeVisible();
    expect(screen.getByText('ComboChart')).toBeVisible();
  });
});
