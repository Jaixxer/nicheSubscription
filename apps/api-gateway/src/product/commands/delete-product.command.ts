import { BaseCommand } from "../../common/cqrs/base.command";

export class DeleteProductCommand extends BaseCommand {
    constructor(
        public readonly productId: string,
        public readonly userId: string,
        public readonly curatorId:string // For validating the user is a curator
    ) {
        super();
    }
    }