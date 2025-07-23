import { BaseCommand } from "../../common/cqrs/base.command";

export class AddShippingAddressCommand extends BaseCommand {
    constructor(
        public readonly userId: string,
        public readonly address: {
            firstName: string,
            lastName: string,
            company?: string,
            address1: string,
            city: string,
            state: string,
            postalCode: string,
            phone?: string,
            isDefault?: boolean
        }
    ) {
        super();
    }
}