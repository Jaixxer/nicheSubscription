import { Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { StripeSubscriptionsService } from '../../stripe/subscriptions/stripe-subscriptions.service';
import { SubscriptionCreatedEvent, SubscriptionCancelledEvent } from '../dto/incoming-events.dto';

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

      // Note: You'll need to implement a way to get the stripe customer ID and price ID
      // This assumes you have a mapping service or the IDs are stored somewhere
      
      // Create Stripe Subscription using existing service
      const subscriptionResult = await this.stripeSubscriptionsService.createSubscription(
        data.curatorId, // stripeCuratorId parameter for platform fees
        {
          customer: 'cus_placeholder', // You'll need to map subscriberId to stripeCustomerId
          items: [
            {
              price: 'price_placeholder', // You'll need to map productId + chosenPlan to stripePriceId
              quantity: data.quantity,
            },
          ],
          metadata: {
            subscriptionId: data.subscriptionId,
            subscriberId: data.subscriberId,
            productId: data.productId,
            curatorId: data.curatorId,
            chosenPlan: data.chosenPlan,
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
        message: 'Note: Implement customer and price ID mapping',
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

      // Note: You'll need to implement cancelSubscription method in StripeSubscriptionsService
      // For now, we'll retrieve the subscription to verify it exists
      const subscriptionResult = await this.stripeSubscriptionsService.getSubscription(data.subscriptionId);

      if (!subscriptionResult || !subscriptionResult.success) {
        this.logger.warn(`Stripe subscription not found for subscriptionId: ${data.subscriptionId}`);
        // This might be okay if the subscription was already cancelled or never created in Stripe
      }

      this.logger.log(`Successfully processed SubscriptionCancelled event for subscriptionId: ${data.subscriptionId}`);
      
      return {
        success: true,
        subscriptionId: data.subscriptionId,
        message: 'Subscription cancellation processed (implement cancelSubscription method in StripeSubscriptionsService)',
        reason: data.reason,
        cancelledAt: data.cancelledAt,
      };

    } catch (error) {
      this.logger.error(`Error processing SubscriptionCancelled event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('subscription.status.changed')
  async handleSubscriptionStatusChanged(data: SubscriptionCreatedEvent) {
    try {
      this.logger.log(`Processing SubscriptionStatusChanged event for subscriptionId: ${data.subscriptionId}`);

      // Handle different status changes
      switch (data.status) {
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
        case 'expired':
          this.logger.log(`Subscription ${data.subscriptionId} expired`);
          // Handle expiration logic
          break;
        case 'payment_failed':
          this.logger.log(`Subscription ${data.subscriptionId} payment failed`);
          // Handle payment failure logic
          break;
        default:
          this.logger.log(`Subscription ${data.subscriptionId} status changed to ${data.status}`);
      }

      return {
        success: true,
        subscriptionId: data.subscriptionId,
        status: data.status,
      };

    } catch (error) {
      this.logger.error(`Error processing SubscriptionStatusChanged event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
