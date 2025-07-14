import { PaymentStatus, Status } from '@prisma/client';

// Payment Events
export interface PaymentSuccessEvent {
  paymentRecordId: string;
  subscriptionId?: string;
  orderId?: string;
  subscriberId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  stripePaymentId?: string;
  processedAt: Date;
}

export interface PaymentFailureEvent {
  paymentRecordId: string;
  subscriptionId?: string;
  orderId?: string;
  subscriberId?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  stripePaymentId?: string;
  error: string;
  failedAt: Date;
}

export interface PaymentRetryRequiredEvent {
  paymentRecordId: string;
  subscriptionId: string;
  subscriberId: string;
  amount: number;
  currency: string;
  attemptNumber: number;
  nextRetryAt: Date;
  maxRetries: number;
}

// Subscription Events
export interface SubscriptionStatusChangedEvent {
  subscriptionId: string;
  subscriberId: string;
  productId: string;
  curatorId: string;
  oldStatus: Status;
  newStatus: Status;
  changedAt: Date;
  reason?: string;
}

export interface SubscriptionActivatedEvent {
  subscriptionId: string;
  subscriberId: string;
  productId: string;
  curatorId: string;
  chosenPlan: string;
  quantity: number;
  nextBillingDate: Date;
  activatedAt: Date;
}

export interface SubscriptionSuspendedEvent {
  subscriptionId: string;
  subscriberId: string;
  productId: string;
  curatorId: string;
  reason: string;
  suspendedAt: Date;
  canReactivate: boolean;
}

export interface SubscriptionExpiredEvent {
  subscriptionId: string;
  subscriberId: string;
  productId: string;
  curatorId: string;
  expiredAt: Date;
  lastBillingDate: Date;
}

// Billing Events
export interface BillingCycleStartedEvent {
  subscriptionId: string;
  subscriberId: string;
  productId: string;
  curatorId: string;
  billingPeriodStart: Date;
  billingPeriodEnd: Date;
  amount: number;
  currency: string;
}

export interface InvoiceGeneratedEvent {
  invoiceId: string;
  subscriptionId: string;
  subscriberId: string;
  productId: string;
  curatorId: string;
  amount: number;
  currency: string;
  dueDate: Date;
  invoiceUrl?: string;
}
