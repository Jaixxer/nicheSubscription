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
  curatorId: string;
  plan: RenewalPlan;
  minQuantity: number;
  maxQuantity?: number;
  pricePerUnit: number;
  isActive: boolean;
}

export interface ProductUpdatedEvent {
  productId: string;
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
  productId: string;
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
