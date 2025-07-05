import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { CreateSubscriptionCommand } from '../command/index';
import { SubscriptionCommandRepository } from './../repositories/subscription.command.repository';
import { ProductRepository } from 'apps/api-gateway/src/product/repository/repository.product';
import { SubscriptionQueryRepository } from '../repositories/subscription.query.repository';
import { calculateNextBillingDate } from 'libs/common/utils/calculate-billing-date.util';

@CommandHandler(CreateSubscriptionCommand)
export class CreateSubscriptionCommandHandler implements ICommandHandler<CreateSubscriptionCommand> {
    constructor(private readonly subscriptionCommandRepo: SubscriptionCommandRepository,private productRepo: ProductRepository, private subscriptionQueryRepo:SubscriptionQueryRepository) {}

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
        

        const subscription = await this.subscriptionCommandRepo.createSubscription(subscriberId, {productId, status, autoRenew, chosenPlan, quantity,nextBillingDate});

        return {
            message: 'Subscription created successfully.',
            subscription,
        };
    }
}