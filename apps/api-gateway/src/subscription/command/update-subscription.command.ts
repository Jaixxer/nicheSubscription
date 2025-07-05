import { BaseCommand } from "apps/api-gateway/src/common/cqrs/base.command";
import { RenewalPlan } from "libs/common/dtos/dto.product";
import { Status } from "libs/common/dtos/dto.subscription";

export class UpdateSubscriptionCommand extends BaseCommand  {
    constructor(
        public readonly user:string, //User ID who is updating the subscription)
        public readonly subscriptionId:string,
        public readonly autoRenew?:boolean,
        public readonly status?:Status | undefined,
        public readonly chosenPlan?:RenewalPlan | undefined,
        public readonly quantity?:number
    ){
        super();
    }
}