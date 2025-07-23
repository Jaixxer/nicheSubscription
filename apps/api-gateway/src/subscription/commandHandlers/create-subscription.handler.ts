import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateSubscriptionCommand } from '../command/index';
import { SubscriptionCommandRepository } from './../repositories/subscription.command.repository';
import { ProductRepository } from 'apps/api-gateway/src/product/repository/repository.product';
import { SubscriptionQueryRepository } from '../repositories/subscription.query.repository';
import { UserRepository } from 'apps/api-gateway/src/user/repositories/user.repository';
import { calculateNextBillingDate } from 'libs/common/utils/calculate-billing-date.util';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionCommandHandler implements ICommandHandler<CreateSubscriptionCommand> {
    private readonly logger = new Logger(CreateSubscriptionCommandHandler.name);
    
    constructor(
        private readonly subscriptionCommandRepo: SubscriptionCommandRepository,
        private productRepo: ProductRepository, 
        private subscriptionQueryRepo:SubscriptionQueryRepository,
        private userRepo: UserRepository,
        @Inject('BILLING_SERVICE') private readonly billingService: ClientProxy
    ) {}

    async execute(command: CreateSubscriptionCommand): Promise<{ message: string; subscription: any }> {
        const { subscriberId, productId, status,autoRenew,chosenPlan,quantity } = command;
        
        // Validate product exists
        const product = await this.productRepo.findById(productId);
        if (!product) {
            throw new Error('Product not found.');
        }
        
        // Check stock availability
        if(!product.allowBackorder){
            const bookedStock = await this.subscriptionQueryRepo.getBookedStockForProduct(productId);
            if (bookedStock + quantity > product.stock) {
                throw new Error('Insufficient stock available for this product.');
            }
        }

        // Get subscriber's stripe information
        const subscriberStripeId = await this.userRepo.checkUserStripeId(subscriberId);
        if (!subscriberStripeId) {
            throw new Error('Subscriber must have a Stripe customer ID. Please complete payment setup first.');
        }

        // Find the appropriate pricing tier for the chosen plan and quantity
        const pricingTier = product.pricingTiers.find(tier => 
            tier.plan === chosenPlan && 
            tier.isActive &&
            quantity >= tier.minQuantity &&
            (tier.maxQuantity === null || quantity <= tier.maxQuantity)
        );

        if (!pricingTier) {
            throw new Error(`No active pricing tier found for plan ${chosenPlan} with quantity ${quantity}`);
        }

        if (!pricingTier.stripeId) {
            throw new Error('Pricing tier must have a Stripe price ID.');
        }
        
        const nextBillingDate = calculateNextBillingDate(chosenPlan, new Date());

        // Execute database operation first
        const subscription = await this.subscriptionCommandRepo.createSubscription(subscriberId, {
            productId, 
            status, 
            autoRenew, 
            chosenPlan, 
            quantity,
            nextBillingDate
        });

        // Send subscription.created message to billing service
        try {
            const subscriptionCreatedData = {
                subscriptionId: subscription.id,
                subscriberId,
                stripeCustomerId: subscriberStripeId,
                productId,
                stripePriceId: pricingTier.stripeId, // Use the pricing tier's Stripe price ID
                curatorId: product.user.stripeId, // Assuming product has a stripeId for the curator
                status,
                chosenPlan,
                quantity,
                autoRenew,
                startDate: new Date(),
                nextBillingDate
            };

            const billingResponse = await lastValueFrom(
                this.billingService.send('subscription.created', subscriptionCreatedData)
            );
            await this.subscriptionCommandRepo.addSubscriptionStripeId(subscription.id, billingResponse.stripeSubscriptionId);
            console.log('Billing service response for subscription.created:', billingResponse);
            this.logger.log(`Subscription created in billing service for subscriptionId: ${subscription.id}`);
        } catch (error) {
            console.error('Failed to create subscription in billing service:', error);
            // For now, continue with the operation but in production you might want to handle this differently
        }

        return {
            message: 'Subscription created successfully.',
            subscription,
        };
    }
}