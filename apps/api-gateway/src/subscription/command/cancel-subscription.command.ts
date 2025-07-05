import { BaseCommand } from "apps/api-gateway/src/common/cqrs/base.command";

export class CancelSubscriptionCommand extends BaseCommand {
    constructor(
        public readonly subscriptionId: string,
        public readonly userId:string //Only to make sure the correct user is cancelling the subscription
        
    ) {
        super();
    }
}