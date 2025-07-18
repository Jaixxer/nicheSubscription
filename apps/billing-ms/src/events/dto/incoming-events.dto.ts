import { RenewalPlan, Status } from '@prisma/client';

// Product/Box Events
export interface ProductCreatedWithPlansEvent {
  productId: string;
  curatorId: string;
  name: string;
  description?: string;
  category?: string;
  maxSubscribers?: number;
  availablePlans: RenewalPlan[];
  pricingTiers: Array<{
    id: string;
    plan: RenewalPlan;
    minQuantity: number;
    maxQuantity?: number;
    pricePerUnit: number;
    isActive: boolean;
  }>;
}

export interface PricingTierActivatedEvent {
  pricingTierId: string;
  productId: string;
  stripeProductId: string;
  curatorId: string;
  plan: RenewalPlan;
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
  isActive: boolean;
}

export interface PricingTierUpdatedEvent {
  pricingTierId: string;
  productId: string;
  stripeProductId: string;
  curatorId: string;
  plan: RenewalPlan;
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
  isActive: boolean;
}

export interface ProductUpdatedEvent {
  productId: string;
  stripeProductId: string;
  curatorId: string;
  name?: string;
  description?: string;
  category?: string;
  maxSubscribers?: number;
  isActive?: boolean;
}

// Subscription Events
export interface SubscriptionCreatedEvent {
  subscriptionId: string;
  subscriberId: string;
  stripeCustomerId: string;
  productId: string;
  stripePriceId: string;
  curatorId: string;
  status: Status;
  chosenPlan: RenewalPlan;
  quantity: number;
  autoRenew: boolean;
  startDate: Date;
  nextBillingDate: Date;
}

export interface SubscriptionCancelledEvent {
  subscriptionId: string;
  subscriberId: string;
  productId: string;
  curatorId: string;
  reason?: string;
  cancelledAt: Date;
}

export interface SubscriptionStatusChangedEvent {
  subscriptionId: string;
  subscriberId: string;
  productId: string;
  curatorId: string;
  oldStatus: Status;
  newStatus: Status;
  changedAt: Date;
}

// Box Item Events
export interface BoxItemAddedEvent {
  boxItemId: string;
  productId: string;
  curatorId: string;
  name: string;
  description?: string;
  quantity: number;
}

// Customer Events
export interface CustomerCreatedEvent {
  customerId: string;
  email: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  shipping?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export interface CustomerUpdatedEvent {
  customerId: string;
  stripeCustomerId: string;
  email?: string;
  name?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
  };
  shipping?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
}

export interface CustomerRetrievedEvent {
  customerId: string;
  stripeCustomerId: string;
}

export interface ConnectedAccountCreatedEvent {
  curatorId: string;
  email: string;
  accountType: string;
  country: string;
  capabilities: string[];
  refreshUrl: string;
  returnUrl: string;
}

// Product Events (Additional)
export interface ProductRetrievedEvent {
  productId: string;
  stripeProductId: string;
}

export interface ProductDeletedEvent {
  productId: string;
  stripeProductId: string;
}

// Price Events
export interface PriceCreatedEvent {
  priceId: string;
  productId: string;
  stripeProductId: string;
  unitAmount: number;
  currency: string;
  recurring?: {
    interval: string;
    intervalCount: number;
  };
  metadata?: Record<string, string>;
}

export interface PriceRetrievedEvent {
  priceId: string;
  stripePriceId: string;
}

export interface PriceUpdatedEvent {
  priceId: string;
  stripePriceId: string;
  active?: boolean;
  metadata?: Record<string, string>;
}

export interface PriceDeletedEvent {
  priceId: string;
  stripePriceId: string;
}

// Subscription Events (Additional)
export interface SubscriptionRetrievedEvent {
  subscriptionId: string;
  stripeSubscriptionId: string;
}

export interface SubscriptionUpdatedEvent {
  subscriptionId: string;
  stripeSubscriptionId: string;
  items?: Array<{
    id?: string;
    price?: string;
    quantity?: number;
  }>;
  metadata?: Record<string, string>;
}

// Payment Method Events
export interface SetupIntentCreatedEvent {
  customerId: string;
  stripeCustomerId: string;
  paymentMethodTypes: string[];
}

export interface DefaultPaymentMethodSetEvent {
  customerId: string;
  stripeCustomerId: string;
  paymentMethodId: string;
  stripePaymentMethodId: string;
}
