import { BaseCommand } from "apps/api-gateway/src/common/cqrs/base.command";

export class DeleteProductAdminCommand extends BaseCommand {
    constructor(
        public readonly productId: string,
        public readonly userId : string
    ) {
        super();
    }
}