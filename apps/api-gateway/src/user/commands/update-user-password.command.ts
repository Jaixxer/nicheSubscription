import { BaseCommand } from "../../common/cqrs/base.command";

export class UpdateUserPasswordCommand extends BaseCommand {
    constructor(
        public readonly id: string,
        public readonly oldPassword: string,
        public readonly newPassword: string
    ) {
        super();
    }
}