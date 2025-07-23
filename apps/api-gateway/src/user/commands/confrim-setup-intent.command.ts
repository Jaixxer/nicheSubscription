import { BaseCommand } from "../../common/cqrs/base.command";

export class ConfirmSetupIntentCommand extends BaseCommand {
    constructor(
        public readonly setupIntentId: string,
        public readonly paymentMethodId: string,
        public readonly userId:string
    ) {
        super();
    }
}