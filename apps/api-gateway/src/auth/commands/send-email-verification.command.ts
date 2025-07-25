import { BaseCommand } from "../../common/cqrs/base.command";

export class SendEmailVerificationCommand extends BaseCommand {
    constructor(
        public readonly userId: string,
        public readonly name: string,
        public readonly email: string,
    ) {
        super();
    }
}