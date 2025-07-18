import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelSubscriptionCommand } from "../command/cancel-subscription.command";
import { SubscriptionCommandRepository } from "../repositories/subscription.command.repository";
import { SubscriptionQueryRepository } from "../repositories/subscription.query.repository";
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ProductRepository } from "../../product/repository/repository.product";

@CommandHandler(CancelSubscriptionCommand)
export class CancelSubscriptionCommandHandler implements ICommandHandler<CancelSubscriptionCommand> {
    private readonly logger = new Logger(CancelSubscriptionCommandHandler.name);
    
    constructor(
        private readonly subscriptionCommandRepo: SubscriptionCommandRepository,
        private readonly subscriptionQueryRepo: SubscriptionQueryRepository,
        private readonly productRepo: ProductRepository,
        @Inject('BILLING_SERVICE') private readonly billingService: ClientProxy
    ) {}

    async execute(command: CancelSubscriptionCommand): Promise<{ message: string }> {
        const { subscriptionId ,userId} = command;
        const existingSubscription = await this.subscriptionQueryRepo.getSubscriptionById(subscriptionId);
        if (!existingSubscription) {
            throw new Error('Subscription not found.');
        }
        if (existingSubscription.subscriberId !== userId) {
            throw new Error('You do not have permission to cancel this subscription.');
        }

        // Execute database operation first
        const cancelledSubscription = await this.subscriptionCommandRepo.cancelSubscription(subscriptionId);
        if (!cancelledSubscription) {
            throw new Error('Failed to cancel subscription.');
        }

        // Emit event to billing service after successful cancellation
        try {
            // Get product details for curatorId
            const product = await this.productRepo.findById(existingSubscription.productId);
            
            const subscriptionCancelledEvent = {
                subscriptionId,
                subscriberId: existingSubscription.subscriberId,
                productId: existingSubscription.productId,
                curatorId: product?.curatorId || '',
                reason: 'User cancelled subscription',
                cancelledAt: new Date()
            };

            this.billingService.emit('subscription.cancelled', subscriptionCancelledEvent);
            this.logger.log(`Subscription cancelled event emitted for subscriptionId: ${subscriptionId}`);
        } catch (error) {
            this.logger.error(`Failed to emit subscription cancelled event: ${error.message}`, error.stack);
            // Continue with the operation - billing service integration failure shouldn't break main functionality
        }

        return {
            message: 'Subscription cancelled successfully.'
        };
    }
}
