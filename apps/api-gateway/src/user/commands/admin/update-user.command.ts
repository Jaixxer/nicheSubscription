import { BaseCommand } from "apps/api-gateway/src/common/cqrs/base.command";

export class UpdateUserCommand extends BaseCommand {
    constructor(
        public readonly id: string,
        public readonly email?: string,
        public readonly firstName?: string,
        public readonly lastName?: string,
        public readonly phone?: string,
        public readonly role?: string[],
        public readonly isActive?: boolean
    ) {
        super();
    }
}