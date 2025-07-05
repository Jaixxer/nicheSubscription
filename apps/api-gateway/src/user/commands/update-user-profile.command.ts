import { BaseCommand } from "../../common/cqrs/base.command";

export class UpdateUserProfileCommand extends BaseCommand{
    constructor(
        public readonly id: string,
        public readonly phone?: string,
        public readonly firstName?: string,
        public readonly lastName?: string
    ) {
        super();
    }
}