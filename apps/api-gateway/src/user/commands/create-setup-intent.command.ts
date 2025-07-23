import { BaseCommand } from "../../common/cqrs/base.command";

export class CreateSetupIntentCommand extends BaseCommand {
    constructor(
        public readonly customerId: string,
        public readonly paymentMethodTypes: string[] = ['card']
    ) {
        super();
    }
}
