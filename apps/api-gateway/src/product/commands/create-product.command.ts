import { RenewalPlan } from "../../../../../libs/common/dtos/dto.product";
import { BaseCommand } from "../../common/cqrs/base.command";

export class CreateProductCommand extends BaseCommand {
  constructor(
    public readonly curatorId: string,
    public readonly curatorStripeId: Promise<string | null>,
    public readonly name: string,
    public readonly stock: number,
    public readonly pricingTiers: {plan:RenewalPlan,minQuantity:number,pricePerUnit:number,maxQuantity?:number,isActive?:boolean}[],
    public readonly availablePlans : RenewalPlan[],
    public readonly allowBackorder?: boolean,
    public readonly maxSubscribers?: number,
    public readonly description?: string,
    public readonly category?: string
  ) {
    super();
  }
}
