import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelSubscriptionCommand } from "../command/cancel-subscription.command";
import { SubscriptionCommandRepository } from "../repositories/subscription.command.repository";
import { SubscriptionQueryRepository } from "../repositories/subscription.query.repository";
@CommandHandler(CancelSubscriptionCommand)
export class CancelSubscriptionCommandHandler implements ICommandHandler<CancelSubscriptionCommand> {
    constructor(
        private readonly subscriptionCommandRepo: SubscriptionCommandRepository,
        private readonly subscriptionQueryRepo: SubscriptionQueryRepository
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

        const cancelledSubscription = await this.subscriptionCommandRepo.cancelSubscription(subscriptionId);
        if (!cancelledSubscription) {
            throw new Error('Failed to cancel subscription.');
        }
        return {
            message: 'Subscription cancelled successfully.'
        };
    }
}
