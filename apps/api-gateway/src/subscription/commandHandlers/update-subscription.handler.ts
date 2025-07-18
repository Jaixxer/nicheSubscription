import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateSubscriptionCommand } from "../command/update-subscription.command";
import { SubscriptionCommandRepository } from "../repositories/subscription.command.repository";
import { SubscriptionQueryRepository } from "../repositories/subscription.query.repository";
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ProductRepository } from "../../product/repository/repository.product";

@CommandHandler(UpdateSubscriptionCommand)
export class UpdateSubscriptionCommandHandler implements ICommandHandler<UpdateSubscriptionCommand> {
    private readonly logger = new Logger(UpdateSubscriptionCommandHandler.name);
    
    constructor(
        private readonly subscriptionCommandRepo: SubscriptionCommandRepository,
        private readonly subscriptionQueryRepo: SubscriptionQueryRepository,
        private readonly productRepo: ProductRepository,
        @Inject('BILLING_SERVICE') private readonly billingService: ClientProxy
    ) {}

    async execute(command: UpdateSubscriptionCommand): Promise<{ message: string;  }> {
        const { user,subscriptionId, autoRenew, status, chosenPlan, quantity } = command;

        const existingSubscription = await this.subscriptionQueryRepo.getSubscriptionById(subscriptionId);
        if (!existingSubscription) {
            throw new Error('Subscription not found.');
        }

        // Execute database operation first
        const updatedSubscription = await this.subscriptionCommandRepo.updateSubscription(subscriptionId, {
            autoRenew,
            status,
            chosenPlan,
            quantity
        });
        if (!updatedSubscription) {
            throw new Error('Failed to update subscription.');
        }

        // Emit event to billing service after successful update
        try {
            // Get product details for curatorId
            const product = await this.productRepo.findById(existingSubscription.productId);
            
            const subscriptionStatusChangedEvent = {
                subscriptionId,
                subscriberId: existingSubscription.subscriberId,
                productId: existingSubscription.productId,
                curatorId: product?.curatorId || '',
                oldStatus: existingSubscription.status,
                newStatus: status || existingSubscription.status,
                changedAt: new Date()
            };

            this.billingService.emit('subscription.status.changed', subscriptionStatusChangedEvent);
            this.logger.log(`Subscription status changed event emitted for subscriptionId: ${subscriptionId}`);
        } catch (error) {
            this.logger.error(`Failed to emit subscription status changed event: ${error.message}`, error.stack);
            // Continue with the operation - billing service integration failure shouldn't break main functionality
        }

        return {
            message: 'Subscription updated successfully.'
        };
    }
}
