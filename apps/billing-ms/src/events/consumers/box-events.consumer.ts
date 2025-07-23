import { Controller, Injectable, Logger } from '@nestjs/common';
import { EventPattern, MessagePattern } from '@nestjs/microservices';
import StripeProductService from '../../stripe/products/stripe-products.service';
import { StripePricesService } from '../../stripe/prices/stripe-prices.service';
import { 
  ProductCreatedWithPlansEvent, 
  PricingTierActivatedEvent, 
  PricingTierUpdatedEvent, 
  ProductUpdatedEvent,
  ProductRetrievedEvent,
  ProductDeletedEvent
} from '../dto/incoming-events.dto';

@Controller()
export class ProductEventsConsumer {
  private readonly logger = new Logger(ProductEventsConsumer.name);

  constructor(
    private readonly stripeProductService: StripeProductService,
    private readonly stripePricesService: StripePricesService,
  ) {}

  @MessagePattern('product.created.with.plans')
  async handleProductCreatedWithPlans(data: any) {
    try {
      this.logger.log(`Processing ProductCreatedWithPlans event for productId: ${data.productId}`);

      // Create Stripe Product in platform account (no stripeAccount parameter)
      const productResult = await this.stripeProductService.createProduct({
        name: data.productCreatedEvent.name,
        description: data.productCreatedEvent.description,
        active: true,
        metadata: {
          productId: data.productCreatedEvent.productId,
          curatorId: data.productCreatedEvent.curatorId,
          category: data.productCreatedEvent.category || '',
        },});

      if (!productResult || !productResult.success || !productResult.product) {
        throw new Error(`Failed to create Stripe product: ${productResult?.error || 'Unknown error'}`);
      }

      // Create Stripe Prices for each pricing tier
      const priceCreateParams = data.productCreatedEvent.pricingTiers
        .filter(tier => tier.isActive)
        .map(tier => ({
          product: productResult.product.id,
          unit_amount: Math.round(tier.pricePerUnit * 100), // Convert to cents
          currency: 'usd', // Default currency
          recurring: {
            interval: tier.plan === 'monthly' ? 'month' as const : 
                     tier.plan === 'weekly' ? 'week' as const : 
                     'month' as const, // biweekly maps to month with interval_count
            interval_count: tier.plan === 'biweekly' ? 2 : 1,
          },
          

          metadata: {
            productId: data.productCreatedEvent.productId,
            pricingTierId: tier.id,
            plan: tier.plan,
            minQuantity: tier.minQuantity.toString(),
            maxQuantity: tier.maxQuantity?.toString() || '',
          },
        }));

      if (priceCreateParams.length > 0) {
        // Create prices in platform account (no stripeAccount parameter)
        const pricesResult = await this.stripePricesService.createPrices(priceCreateParams);

        if (!pricesResult || !pricesResult.success || !pricesResult.prices) {
          throw new Error(`Failed to create Stripe prices: ${pricesResult?.error || 'Unknown error'}`);
        }

        this.logger.log(`Successfully processed ProductCreatedWithPlans event for productId: ${data.productId}`);
        return {
          success: true,
          productId: data.productCreatedEvent.productId,
          stripeProductId: productResult.product.id,
          pricingTiers: pricesResult.prices.map((price, idx) => ({
            pricingTierId: data.productCreatedEvent.pricingTiers
              .filter(tier => tier.isActive)[idx].id,
            stripePriceId: price.id,
          })),
        };
      }

      return {
        success: true,
        productId: data.productCreatedEvent.productId,
        stripeProductId: productResult.product.id,
        stripePriceIds: [],
      };

    } catch (error) {
      this.logger.error(`Error processing ProductCreatedWithPlans event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('pricing.tier.activated')
  async handlePricingTierActivated(data: any) {
    try {
      this.logger.log(`Processing PricingTierActivated event for pricingTierId: ${data.pricingTierId}`);

      // Create Stripe Price for the activated pricing tier in platform account
      const priceResult = await this.stripePricesService.createPrices([{
        product: data.stripeProductId, // Stripe product ID from event data
        unit_amount: Math.round(data.pricePerUnit * 100),
        currency: 'usd',
        recurring: {
          interval: data.plan === 'monthly' ? 'month' as const : 
                   data.plan === 'weekly' ? 'week' as const : 
                   'month' as const,
          interval_count: data.plan === 'biweekly' ? 2 : 1,
        },
        active: data.isActive,
        metadata: {
          productId: data.productId,
          pricingTierId: data.pricingTierId,
          curatorId: data.curatorId,
          plan: data.plan,
          minQuantity: data.minQuantity.toString(),
          maxQuantity: data.maxQuantity?.toString() || '',
        },
      }]);

      if (!priceResult || !priceResult.success || !priceResult.prices || priceResult.prices.length === 0) {
        throw new Error(`Failed to create Stripe price for activated pricing tier: ${priceResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed PricingTierActivated event for pricingTierId: ${data.pricingTierId}`);
      return { 
        success: true, 
        pricingTierId: data.pricingTierId,
        stripePriceId: priceResult.prices[0].id 
      };

    } catch (error) {
      this.logger.error(`Error processing PricingTierActivated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('pricing.tier.updated')
  async handlePricingTierUpdated(data: any) {
    try {
      this.logger.log(`Processing PricingTierUpdated event for pricingTierId: ${data.pricingTierId}`);

      // Create new Stripe Price in platform account (Stripe doesn't allow price updates, only creation of new prices)
      const priceResult = await this.stripePricesService.createPrices([{
        product: data.stripeProductId, // Stripe product ID from event data
        unit_amount: Math.round(data.pricePerUnit * 100),
        currency: 'usd',
        recurring: {
          interval: data.plan === 'monthly' ? 'month' as const : 
                   data.plan === 'weekly' ? 'week' as const : 
                   'month' as const,
          interval_count: data.plan === 'biweekly' ? 2 : 1,
        },
        active: data.isActive,
        metadata: {
          productId: data.productId,
          pricingTierId: data.pricingTierId,
          curatorId: data.curatorId,
          plan: data.plan,
          minQuantity: data.minQuantity.toString(),
          maxQuantity: data.maxQuantity?.toString() || '',
        },
      }]);

      if (!priceResult || !priceResult.success || !priceResult.prices || priceResult.prices.length === 0) {
        throw new Error(`Failed to create updated Stripe price: ${priceResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed PricingTierUpdated event for pricingTierId: ${data.pricingTierId}`);
      return { 
        success: true, 
        pricingTierId: data.pricingTierId,
        stripePriceId: priceResult.prices[0].id 
      };

    } catch (error) {
      this.logger.error(`Error processing PricingTierUpdated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('product.updated')
  async handleProductUpdated(data: ProductUpdatedEvent) {
    try {
      this.logger.log(`Processing ProductUpdated event for productId: ${data.productId}`);

      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.isActive !== undefined) updateData.active = data.isActive;

      // Add metadata updates
      updateData.metadata = {
        productId: data.productId,
        curatorId: data.curatorId,
        category: data.category || '',
        maxSubscribers: data.maxSubscribers?.toString() || '',
      };

      // Use the updateProduct method from StripeProductService
      const productResult = await this.stripeProductService.updateProduct(data.stripeProductId, updateData);

      if (!productResult || !productResult.success) {
        throw new Error(`Failed to update Stripe product: ${productResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed ProductUpdated event for productId: ${data.productId}`);
      return { 
        success: true, 
        productId: data.productId,
        stripeProductId: data.stripeProductId,
        updatedProduct: productResult.product,
      };

    } catch (error) {
      this.logger.error(`Error processing ProductUpdated event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('product.retrieved')
  async handleProductRetrieved(data: ProductRetrievedEvent) {
    try {
      this.logger.log(`Processing ProductRetrieved event for productId: ${data.productId}`);

      const productResult = await this.stripeProductService.getProduct(data.stripeProductId);

      if (!productResult || !productResult.success) {
        throw new Error(`Failed to retrieve Stripe product: ${productResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed ProductRetrieved event for productId: ${data.productId}`);
      return {
        success: true,
        productId: data.productId,
        stripeProductId: data.stripeProductId,
        product: productResult.product,
      };

    } catch (error) {
      this.logger.error(`Error processing ProductRetrieved event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('product.deleted')
  async handleProductDeleted(data: ProductDeletedEvent) {
    try {
      this.logger.log(`Processing ProductDeleted event for productId: ${data.productId}`);

      const productResult = await this.stripeProductService.deleteProduct(data.stripeProductId);

      if (!productResult || !productResult.success) {
        throw new Error(`Failed to delete Stripe product: ${productResult?.error || 'Unknown error'}`);
      }

      this.logger.log(`Successfully processed ProductDeleted event for productId: ${data.productId}`);
      return {
        success: true,
        productId: data.productId,
        stripeProductId: data.stripeProductId,
        deletedProduct: productResult.product,
      };

    } catch (error) {
      this.logger.error(`Error processing ProductDeleted event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
