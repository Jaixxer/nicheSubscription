import { BaseCommand } from "apps/api-gateway/src/common/cqrs/base.command";

export class CancelSubscriptionAdminCommand extends BaseCommand {
    constructor(
        public readonly subscriptionId: string,
        public readonly userId: string
    ) {
        super();
    }
}