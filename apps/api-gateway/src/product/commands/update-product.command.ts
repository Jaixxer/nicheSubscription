import { BaseCommand } from "../../common/cqrs/base.command";
import { UpdateProductDto } from "libs/common/dtos/dto.product";

export class UpdateProductCommand extends BaseCommand{
    constructor(
        public readonly productId: string,
        public readonly userId: string,
        public readonly curatorId: string, 
        public readonly updateData: UpdateProductDto
    ) {
        super();
    }
}