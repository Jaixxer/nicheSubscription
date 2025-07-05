import { BaseCommand } from "apps/api-gateway/src/common/cqrs/base.command";
import { RenewalPlan } from "libs/common/dtos/dto.product";
import { Status } from "libs/common/dtos/dto.subscription";

export class CreateSubscriptionCommand extends BaseCommand {
    constructor(
        public readonly subscriberId: string,
        public readonly productId: string,
        public readonly status:Status,
        public readonly chosenPlan: RenewalPlan,
        public readonly quantity: number,
        public readonly autoRenew: boolean ,
        public readonly nextBillingDate? : Date
        ) {
        super();
    }
}