import { BaseCommand } from "../../common/cqrs/base.command";

export class VerifyEmailCommand extends BaseCommand {
    constructor(
        public readonly userId: string,
        public readonly email: string,
        public readonly emailToken: string,
        public readonly firstName: string
    ) {
        super();
    }
}