import { Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { StripePricesService } from '../../stripe/prices/stripe-prices.service';
import {
  PriceCreatedEvent,
  PriceRetrievedEvent,
  PriceUpdatedEvent,
  PriceDeletedEvent,
} from '../dto/incoming-events.dto';

@Injectable()
export class PriceEventsConsumer {
  private readonly logger = new Logger(PriceEventsConsumer.name);

  constructor(
    private readonly stripePricesService: StripePricesService,
  ) {}

  @EventPattern('price.created')
  async handlePriceCreated(data: PriceCreatedEvent) {
    try {
      this.logger.log(`Processing PriceCreated event for priceId: ${data.priceId}`);

      const priceCreateParams = {
        product: data.stripeProductId,
        unit_amount: data.unitAmount,
        currency: data.currency,
        recurring: data.recurring ? {
          interval: data.recurring.interval as any,
          interval_count: data.recurring.intervalCount,
        } : undefined,
        metadata: data.metadata || {},
      };

      const priceResult = await this.stripePricesService.createPrices([priceCreateParams]);

      if (!priceResult || !priceResult.success || !priceResult.prices || priceResult.prices.length === 0) {
        throw new Error(`Failed to create Stripe price: ${priceResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed PriceCreated event for priceId: ${data.priceId}`);
      return {
        success: true,
        priceId: data.priceId,
        stripePriceId: priceResult.prices[0].id,
      };

    } catch (error) {
      this.logger.error(`Error processing PriceCreated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('price.retrieved')
  async handlePriceRetrieved(data: PriceRetrievedEvent) {
    try {
      this.logger.log(`Processing PriceRetrieved event for priceId: ${data.priceId}`);

      const priceResult = await this.stripePricesService.getPrice(data.stripePriceId);

      if (!priceResult || !priceResult.success) {
        throw new Error(`Failed to retrieve Stripe price: ${priceResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed PriceRetrieved event for priceId: ${data.priceId}`);
      return {
        success: true,
        priceId: data.priceId,
        stripePriceId: data.stripePriceId,
        price: priceResult.price,
      };

    } catch (error) {
      this.logger.error(`Error processing PriceRetrieved event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('price.updated')
  async handlePriceUpdated(data: PriceUpdatedEvent) {
    try {
      this.logger.log(`Processing PriceUpdated event for priceId: ${data.priceId}`);

      const updateData: any = {};
      if (data.active !== undefined) updateData.active = data.active;
      if (data.metadata) updateData.metadata = data.metadata;

      const priceResult = await this.stripePricesService.updatePrice(data.stripePriceId, updateData);

      if (!priceResult || !priceResult.success) {
        throw new Error(`Failed to update Stripe price: ${priceResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed PriceUpdated event for priceId: ${data.priceId}`);
      return {
        success: true,
        priceId: data.priceId,
        stripePriceId: data.stripePriceId,
      };

    } catch (error) {
      this.logger.error(`Error processing PriceUpdated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('price.deleted')
  async handlePriceDeleted(data: PriceDeletedEvent) {
    try {
      this.logger.log(`Processing PriceDeleted event for priceId: ${data.priceId}`);

      // Note: Stripe doesn't allow deleting prices, only deactivating them
      const priceResult = await this.stripePricesService.deletePrice(data.stripePriceId);

      if (!priceResult || !priceResult.success) {
        throw new Error(`Failed to delete Stripe price: ${priceResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed PriceDeleted event for priceId: ${data.priceId}`);
      return {
        success: true,
        priceId: data.priceId,
        stripePriceId: data.stripePriceId,
        message: 'Price deactivated (Stripe does not allow permanent deletion)',
      };

    } catch (error) {
      this.logger.error(`Error processing PriceDeleted event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
