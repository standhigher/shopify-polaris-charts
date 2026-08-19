import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ChartCard } from '../ChartCard';
import { FunnelChart } from './FunnelChart';
import type { FunnelDatum } from './funnel';

const productFunnel: FunnelDatum[] = [
  { id: 'view', label: 'Product view', value: 12480 },
  { conversion: 0.34, dropOff: 0.66, id: 'cart', label: 'Add to cart', value: 4243 },
  { conversion: 0.46, dropOff: 0.54, id: 'checkout', label: 'Checkout', value: 1952 },
  { conversion: 0.58, dropOff: 0.42, id: 'purchase', label: 'Purchase', value: 1132 }
];

const upsellFunnel: FunnelDatum[] = [
  { id: 'shown', label: 'Offer shown', value: 8420 },
  { conversion: 0.073, dropOff: 0.927, id: 'accepted', label: 'Offer accepted', value: 615 }
];

const meta = {
  component: FunnelChart,
  title: 'Components/FunnelChart'
} satisfies Meta<typeof FunnelChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ProductPurchase: Story = {
  args: { data: productFunnel, title: 'Online store funnel' }
};

export const UpsellConversion: Story = {
  args: { data: upsellFunnel, title: 'Post-purchase upsell' }
};

export const ZeroStage: Story = {
  args: {
    data: [...productFunnel.slice(0, 3), { conversion: 0, dropOff: 1, id: 'purchase', label: 'Purchase', value: 0 }]
  }
};

export const LongAndDuplicateLabels: Story = {
  args: {
    data: [
      { id: 'first', label: 'Checkout started from an intentionally long translated storefront campaign label', value: 82 },
      { conversion: 0.5, dropOff: 0.5, id: 'second', label: 'Checkout', value: 41 },
      { conversion: 0.5, dropOff: 0.5, id: 'third', label: 'Checkout', value: 20 }
    ]
  }
};

const narrowStyle: CSSProperties = { maxWidth: 320 };

export const NarrowContainer: Story = {
  args: { data: productFunnel },
  render: () => <div style={narrowStyle}><FunnelChart data={productFunnel} /></div>
};

export const Loading: Story = {
  args: { data: productFunnel, state: 'loading' }
};

export const Empty: Story = {
  args: { data: [], emptyMessage: 'No funnel activity for this period' }
};

export const ErrorWithRetry: Story = {
  args: { data: productFunnel, errorMessage: 'Funnel data could not be loaded', onRetry: () => undefined, state: 'error' }
};

export const CustomRetryAction: Story = {
  args: { data: productFunnel },
  render: () => (
    <ChartCard state="ready" title="Online store funnel">
      <FunnelChart
        data={productFunnel}
        retryAction={<a href="#support">Contact support</a>}
        state="error"
      />
    </ChartCard>
  )
};
