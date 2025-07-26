import { BaseCommand } from "../../common/cqrs/base.command";

export class SendPhoneVerificationCommand extends BaseCommand {
    constructor(
        public readonly userId: string,
        public readonly name:string,
        public readonly phoneNumber: string,
    ) {
        super();
    }
}