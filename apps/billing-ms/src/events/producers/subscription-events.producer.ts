import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { 
  SubscriptionStatusChangedEvent, 
  SubscriptionActivatedEvent, 
  SubscriptionSuspendedEvent,
  SubscriptionExpiredEvent 
} from '../dto/outgoing-events.dto';

@Injectable()
export class SubscriptionEventsProducer {
  private readonly logger = new Logger(SubscriptionEventsProducer.name);

  constructor(
    @Inject('EVENT_SERVICE') private readonly eventClient: ClientProxy,
  ) {}

  async emitSubscriptionStatusChanged(event: SubscriptionStatusChangedEvent): Promise<void> {
    try {
      this.logger.log(`Emitting SubscriptionStatusChanged event for subscriptionId: ${event.subscriptionId}`);
      
      this.eventClient.emit('subscription.status.changed', event);

      this.logger.log(`SubscriptionStatusChanged event emitted successfully for subscriptionId: ${event.subscriptionId}`);
    } catch (error) {
      this.logger.error(`Failed to emit SubscriptionStatusChanged event: ${error.message}`, error.stack);
      throw error;
    }
  }

  async emitSubscriptionActivated(event: SubscriptionActivatedEvent): Promise<void> {
    try {
      this.logger.log(`Emitting SubscriptionActivated event for subscriptionId: ${event.subscriptionId}`);
      
      this.eventClient.emit('subscription.activated', event);

      this.logger.log(`SubscriptionActivated event emitted successfully for subscriptionId: ${event.subscriptionId}`);
    } catch (error) {
      this.logger.error(`Failed to emit SubscriptionActivated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  async emitSubscriptionSuspended(event: SubscriptionSuspendedEvent): Promise<void> {
    try {
      this.logger.log(`Emitting SubscriptionSuspended event for subscriptionId: ${event.subscriptionId}`);
      
      this.eventClient.emit('subscription.suspended', event);

      this.logger.log(`SubscriptionSuspended event emitted successfully for subscriptionId: ${event.subscriptionId}`);
    } catch (error) {
      this.logger.error(`Failed to emit SubscriptionSuspended event: ${error.message}`, error.stack);
      throw error;
    }
  }

  async emitSubscriptionExpired(event: SubscriptionExpiredEvent): Promise<void> {
    try {
      this.logger.log(`Emitting SubscriptionExpired event for subscriptionId: ${event.subscriptionId}`);
      
      this.eventClient.emit('subscription.expired', event);

      this.logger.log(`SubscriptionExpired event emitted successfully for subscriptionId: ${event.subscriptionId}`);
    } catch (error) {
      this.logger.error(`Failed to emit SubscriptionExpired event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
