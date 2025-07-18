import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateSubscriptionCommand } from '../command/index';
import { SubscriptionCommandRepository } from './../repositories/subscription.command.repository';
import { ProductRepository } from 'apps/api-gateway/src/product/repository/repository.product';
import { SubscriptionQueryRepository } from '../repositories/subscription.query.repository';
import { calculateNextBillingDate } from 'libs/common/utils/calculate-billing-date.util';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionCommandHandler implements ICommandHandler<CreateSubscriptionCommand> {
    private readonly logger = new Logger(CreateSubscriptionCommandHandler.name);
    
    constructor(
        private readonly subscriptionCommandRepo: SubscriptionCommandRepository,
        private productRepo: ProductRepository, 
        private subscriptionQueryRepo:SubscriptionQueryRepository,
        @Inject('BILLING_SERVICE') private readonly billingService: ClientProxy
    ) {}

    async execute(command: CreateSubscriptionCommand): Promise<{ message: string; subscription: any }> {
        const { subscriberId, productId, status,autoRenew,chosenPlan,quantity } = command;
        const product = await this.productRepo.findById(productId);
        if (!product) {
            throw new Error('Product not found.');
        }
        if(!product.allowBackorder){
            const bookedStock = await this.subscriptionQueryRepo.getBookedStockForProduct(productId);
            if (bookedStock + quantity > product.stock) {
                throw new Error('Insufficient stock available for this product.');
            }
        }
        const nextBillingDate= calculateNextBillingDate(chosenPlan,new Date())
        

        // Execute database operation first
        const subscription = await this.subscriptionCommandRepo.createSubscription(subscriberId, {productId, status, autoRenew, chosenPlan, quantity,nextBillingDate});

        // Emit event to billing service after successful creation
        try {
            const subscriptionCreatedEvent = {
                subscriptionId: subscription.id,
                subscriberId,
                productId,
                curatorId: product.curatorId,
                status,
                chosenPlan,
                quantity,
                autoRenew,
                startDate: new Date(),
                nextBillingDate
            };

            this.billingService.emit('subscription.created', subscriptionCreatedEvent);
            this.logger.log(`Subscription creation event emitted for subscriptionId: ${subscription.id}`);
        } catch (error) {
            this.logger.error(`Failed to emit subscription creation event: ${error.message}`, error.stack);
            // Continue with the operation - billing service integration failure shouldn't break main functionality
        }

        return {
            message: 'Subscription created successfully.',
            subscription,
        };
    }
}