import { BaseCommand } from "../../common/cqrs/base.command";

export class AddPhoneNumberCommand extends BaseCommand {
    constructor(
        public readonly userId: string,
        public readonly phoneNumber: string,
    ) {
        super();
    }
}