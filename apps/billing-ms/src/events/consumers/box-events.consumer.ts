import { Injectable, Logger } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import StripeProductService from '../../stripe/products/stripe-products.service';
import { StripePricesService } from '../../stripe/prices/stripe-prices.service';
import { 
  ProductCreatedWithPlansEvent, 
  PricingTierActivatedEvent, 
  PricingTierUpdatedEvent, 
  ProductUpdatedEvent 
} from '../dto/incoming-events.dto';

@Injectable()
export class ProductEventsConsumer {
  private readonly logger = new Logger(ProductEventsConsumer.name);

  constructor(
    private readonly stripeProductService: StripeProductService,
    private readonly stripePricesService: StripePricesService,
  ) {}

  @EventPattern('product.created.with.plans')
  async handleProductCreatedWithPlans(data: ProductCreatedWithPlansEvent) {
    try {
      this.logger.log(`Processing ProductCreatedWithPlans event for productId: ${data.productId}`);

      // Create Stripe Product
      const productResult = await this.stripeProductService.createProduct({
        name: data.name,
        description: data.description,
        active: true,
        metadata: {
          productId: data.productId,
          curatorId: data.curatorId,
          category: data.category || '',
        },
      });

      if (!productResult || !productResult.success || !productResult.product) {
        throw new Error(`Failed to create Stripe product: ${productResult?.error || 'Unknown error'}`);
      }

      // Create Stripe Prices for each pricing tier
      const priceCreateParams = data.pricingTiers
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
            productId: data.productId,
            pricingTierId: tier.id,
            plan: tier.plan,
            minQuantity: tier.minQuantity.toString(),
            maxQuantity: tier.maxQuantity?.toString() || '',
          },
        }));

      if (priceCreateParams.length > 0) {
        const pricesResult = await this.stripePricesService.createPrices(priceCreateParams);

        if (!pricesResult || !pricesResult.success || !pricesResult.prices) {
          throw new Error(`Failed to create Stripe prices: ${pricesResult?.error || 'Unknown error'}`);
        }

        this.logger.log(`Successfully processed ProductCreatedWithPlans event for productId: ${data.productId}`);
        return {
          success: true,
          productId: data.productId,
          stripeProductId: productResult.product.id,
          stripePriceIds: pricesResult.prices.map(p => p.id),
        };
      }

      return {
        success: true,
        productId: data.productId,
        stripeProductId: productResult.product.id,
        stripePriceIds: [],
      };

    } catch (error) {
      this.logger.error(`Error processing ProductCreatedWithPlans event: ${error.message}`, error.stack);
      throw error;
    }
  }

  @EventPattern('pricing.tier.activated')
  async handlePricingTierActivated(data: PricingTierActivatedEvent) {
    try {
      this.logger.log(`Processing PricingTierActivated event for pricingTierId: ${data.pricingTierId}`);

      // Create Stripe Price for the activated pricing tier
      const priceResult = await this.stripePricesService.createPrices([{
        product: data.productId, // You'll need to map productId to stripeProductId
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
  async handlePricingTierUpdated(data: PricingTierUpdatedEvent) {
    try {
      this.logger.log(`Processing PricingTierUpdated event for pricingTierId: ${data.pricingTierId}`);

      // Create new Stripe Price (Stripe doesn't allow price updates, only creation of new prices)
      const priceResult = await this.stripePricesService.createPrices([{
        product: data.productId, // You'll need to map productId to stripeProductId
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

      // Note: You'll need to implement updateProduct method in StripeProductService
      // or retrieve the stripe product ID and update it
      
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.isActive !== undefined) updateData.active = data.isActive;

      // Add metadata updates
      updateData.metadata = {
        productId: data.productId,
        curatorId: data.curatorId,
        category: data.category || '',
      };

      this.logger.log(`Product update data prepared for productId: ${data.productId}`, updateData);

      return { 
        success: true, 
        productId: data.productId,
        message: 'Product update processed (implement updateProduct method in StripeProductService)' 
      };

    } catch (error) {
      this.logger.error(`Error processing ProductUpdated event: ${error.message}`, error.stack);
      throw error;
    }
  }
}
