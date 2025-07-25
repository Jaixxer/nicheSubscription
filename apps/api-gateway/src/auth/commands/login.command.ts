import { BaseCommand } from "../../common/cqrs/base.command";

export class LoginCommand extends BaseCommand {
    constructor(
        public readonly id: string,
        public readonly password: string,
        public readonly hashPassword: string,
    ) {
        super();
    }
}