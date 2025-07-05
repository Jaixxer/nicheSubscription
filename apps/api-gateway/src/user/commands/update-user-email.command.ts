import { BaseCommand } from '../../common/cqrs/base.command';

export class UpdateUserEmailCommand extends BaseCommand {
    constructor(
        public readonly id: string,
        public readonly newEmail: string,
        public readonly password: string
    ) {
        super();
    }
}