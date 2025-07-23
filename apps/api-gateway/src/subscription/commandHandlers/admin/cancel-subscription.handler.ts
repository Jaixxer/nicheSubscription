import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CancelSubscriptionAdminCommand } from "../../command/admin/cancel-subscription.command";
import { SubscriptionCommandRepository } from "../../repositories/subscription.command.repository";
import { Logger } from "@nestjs/common";

@CommandHandler(CancelSubscriptionAdminCommand)
export class CancelSubscriptionAdminCommandHandler implements ICommandHandler<CancelSubscriptionAdminCommand> {
    private readonly logger = new Logger(CancelSubscriptionAdminCommandHandler.name);

    constructor(
        private readonly subscriptionCommandRepository: SubscriptionCommandRepository
    ) {}

    async execute(command: CancelSubscriptionAdminCommand): Promise<any> {
        try {
            this.logger.log(`Subscription cancellation was initiated for subscriptionId: ${command.subscriptionId} by userId: ${command.userId}`);
            const result = await this.subscriptionCommandRepository.cancelSubscription(command.subscriptionId);
            this.logger.log(`Subscription cancelled successfully by userId: ${command.userId}`);
            return result;
        } catch (error) {
            this.logger.error(`Failed to cancel subscription by userId: ${command.userId}`, error);
            throw error;
        }
    }
}