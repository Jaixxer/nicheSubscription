import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UpdateSubscriptionCommand } from "../command/update-subscription.command";
import { SubscriptionCommandRepository } from "../repositories/subscription.command.repository";
import { SubscriptionQueryRepository } from "../repositories/subscription.query.repository";

@CommandHandler(UpdateSubscriptionCommand)
export class UpdateSubscriptionCommandHandler implements ICommandHandler<UpdateSubscriptionCommand> {
    constructor(
        private readonly subscriptionCommandRepo: SubscriptionCommandRepository,
        private readonly subscriptionQueryRepo: SubscriptionQueryRepository
    ) {}

    async execute(command: UpdateSubscriptionCommand): Promise<{ message: string;  }> {
        const { user,subscriptionId, autoRenew, status, chosenPlan, quantity } = command;

        const existingSubscription = await this.subscriptionQueryRepo.getSubscriptionById(subscriptionId);
        if (!existingSubscription) {
            throw new Error('Subscription not found.');
        }

        const updatedSubscription = await this.subscriptionCommandRepo.updateSubscription(subscriptionId, {
            autoRenew,
            status,
            chosenPlan,
            quantity
        });
        if (!updatedSubscription) {
            throw new Error('Failed to update subscription.');
        }
        return {
            message: 'Subscription updated successfully.'
        };
    }
}
