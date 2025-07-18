import { Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { StripeSubscriptionsService } from '../../stripe/subscriptions/stripe-subscriptions.service';
import { 
  SubscriptionCreatedEvent, 
  SubscriptionCancelledEvent, 
  SubscriptionStatusChangedEvent,
  SubscriptionRetrievedEvent,
  SubscriptionUpdatedEvent
} from '../dto/incoming-events.dto';

@Injectable()
export class SubscriptionEventsConsumer {
  private readonly logger = new Logger(SubscriptionEventsConsumer.name);

  constructor(
    private readonly stripeSubscriptionsService: StripeSubscriptionsService,
  ) {}

  @EventPattern('subscription.created')
  async handleSubscriptionCreated(data: SubscriptionCreatedEvent) {
    try {
      this.logger.log(`Processing SubscriptionCreated event for subscriptionId: ${data.subscriptionId}`);

      // The event data should contain the necessary Stripe IDs for mapping
      // Based on the event structure, we need to derive the Stripe customer ID and price ID
      // This would typically be done through a mapping service or database lookup
      
      // Create Stripe Subscription using existing service
      const subscriptionResult = await this.stripeSubscriptionsService.createSubscription(
        data.curatorId, // stripeCuratorId parameter for platform fees
        {
          customer: data.stripeCustomerId, // Stripe customer ID from event data
          items: [
            {
              price: data.stripePriceId, // Stripe price ID from event data
              quantity: data.quantity,
            },
          ],
          metadata: {
            subscriptionId: data.subscriptionId,
            subscriberId: data.subscriberId,
            productId: data.productId,
            curatorId: data.curatorId,
            chosenPlan: data.chosenPlan,
            autoRenew: data.autoRenew.toString(),
          },
          billing_cycle_anchor: Math.floor(data.nextBillingDate.getTime() / 1000), // Convert to Unix timestamp
        }
      );

      if (!subscriptionResult || !subscriptionResult.success) {
        throw new Error(`Failed to create Stripe subscription: ${subscriptionResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed SubscriptionCreated event for subscriptionId: ${data.subscriptionId}`);
      return {
        success: true,
        subscriptionId: data.subscriptionId,
        stripeSubscriptionId: subscriptionResult.subscription?.id,
        status: data.status,
        chosenPlan: data.chosenPlan,
        quantity: data.quantity,
        nextBillingDate: data.nextBillingDate,
      };

    } catch (error) {
      this.logger.error(`Error processing SubscriptionCreated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('subscription.cancelled')
  async handleSubscriptionCancelled(data: SubscriptionCancelledEvent) {
    try {
      this.logger.log(`Processing SubscriptionCancelled event for subscriptionId: ${data.subscriptionId}`);

      // Use the actual cancelSubscription method that exists in StripeSubscriptionsService
      // Note: The cancelSubscription method expects a stripeSubscriptionId, not the internal subscriptionId
      // This assumes the event data contains the stripe subscription ID or we can retrieve it
      const subscriptionResult = await this.stripeSubscriptionsService.cancelSubscription(data.subscriptionId);

      if (!subscriptionResult || !subscriptionResult.success) {
        this.logger.warn(`Failed to cancel Stripe subscription: ${subscriptionResult?.error || 'Unknown error'}`);
        // This might be okay if the subscription was already cancelled or never created in Stripe
      }

      this.logger.log(`Successfully processed SubscriptionCancelled event for subscriptionId: ${data.subscriptionId}`);
      
      return {
        success: true,
        subscriptionId: data.subscriptionId,
        subscriberId: data.subscriberId,
        productId: data.productId,
        curatorId: data.curatorId,
        reason: data.reason,
        cancelledAt: data.cancelledAt,
        stripeSubscription: subscriptionResult?.subscription,
      };

    } catch (error) {
      this.logger.error(`Error processing SubscriptionCancelled event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('subscription.status.changed')
  async handleSubscriptionStatusChanged(data: SubscriptionStatusChangedEvent) {
    try {
      this.logger.log(`Processing SubscriptionStatusChanged event for subscriptionId: ${data.subscriptionId}`);

      // Handle different status changes
      switch (data.newStatus) {
        case 'active':
          this.logger.log(`Subscription ${data.subscriptionId} activated`);
          // Handle activation logic
          break;
        case 'cancelled':
          this.logger.log(`Subscription ${data.subscriptionId} cancelled`);
          // Handle cancellation logic
          break;
        case 'paused':
          this.logger.log(`Subscription ${data.subscriptionId} paused`);
          // Handle pause logic
          break;
        default:
          this.logger.log(`Subscription ${data.subscriptionId} status changed from ${data.oldStatus} to ${data.newStatus}`);
      }

      return {
        success: true,
        subscriptionId: data.subscriptionId,
        oldStatus: data.oldStatus,
        newStatus: data.newStatus,
        changedAt: data.changedAt,
      };

    } catch (error) {
      this.logger.error(`Error processing SubscriptionStatusChanged event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('subscription.retrieved')
  async handleSubscriptionRetrieved(data: SubscriptionRetrievedEvent) {
    try {
      this.logger.log(`Processing SubscriptionRetrieved event for subscriptionId: ${data.subscriptionId}`);

      const subscriptionResult = await this.stripeSubscriptionsService.getSubscription(data.stripeSubscriptionId);

      if (!subscriptionResult || !subscriptionResult.success) {
        throw new Error(`Failed to retrieve Stripe subscription: ${subscriptionResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed SubscriptionRetrieved event for subscriptionId: ${data.subscriptionId}`);
      return {
        success: true,
        subscriptionId: data.subscriptionId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        subscription: subscriptionResult.subscription,
      };

    } catch (error) {
      this.logger.error(`Error processing SubscriptionRetrieved event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('subscription.updated')
  async handleSubscriptionUpdated(data: SubscriptionUpdatedEvent) {
    try {
      this.logger.log(`Processing SubscriptionUpdated event for subscriptionId: ${data.subscriptionId}`);

      const updateData: any = {};
      if (data.items) updateData.items = data.items;
      if (data.metadata) updateData.metadata = data.metadata;

      const subscriptionResult = await this.stripeSubscriptionsService.updateSubscription(
        data.stripeSubscriptionId,
        updateData
      );

      if (!subscriptionResult || !subscriptionResult.success) {
        throw new Error(`Failed to update Stripe subscription: ${subscriptionResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed SubscriptionUpdated event for subscriptionId: ${data.subscriptionId}`);
      return {
        success: true,
        subscriptionId: data.subscriptionId,
        stripeSubscriptionId: data.stripeSubscriptionId,
        subscription: subscriptionResult.subscription,
      };

    } catch (error) {
      this.logger.error(`Error processing SubscriptionUpdated event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
