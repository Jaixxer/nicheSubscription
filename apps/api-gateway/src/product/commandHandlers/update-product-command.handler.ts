import { CommandHandler , ICommandHandler} from "@nestjs/cqrs";
import { UpdateProductCommand } from "../commands/update-product.command";
import { ProductRepository } from "../repository/repository.product";
import { UpdateProductDto } from "libs/common/dtos/dto.product";
@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler implements ICommandHandler<UpdateProductCommand> {
    constructor(private productRepo:ProductRepository) {}
    async execute(command: UpdateProductCommand): Promise<{message: string, product: any}> {
        const { productId, userId,curatorId, updateData } = command;
        if(userId!==curatorId){
            throw new Error("You do not have permission to update this product.");
        }
        const result = await this.productRepo.updateProductDetails(productId, userId, updateData);
        
        return result;



    }
}
