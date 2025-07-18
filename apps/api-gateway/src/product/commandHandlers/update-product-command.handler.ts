import { CommandHandler , ICommandHandler} from "@nestjs/cqrs";
import { UpdateProductCommand } from "../commands/update-product.command";
import { ProductRepository } from "../repository/repository.product";
import { UpdateProductDto } from "libs/common/dtos/dto.product";
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler implements ICommandHandler<UpdateProductCommand> {
    private readonly logger = new Logger(UpdateProductCommandHandler.name);
    
    constructor(
        private productRepo:ProductRepository,
        @Inject('BILLING_SERVICE') private readonly billingService: ClientProxy
    ) {}
    async execute(command: UpdateProductCommand): Promise<{message: string, product: any}> {
        const { productId, userId,curatorId, updateData } = command;
        if(userId!==curatorId){
            throw new Error("You do not have permission to update this product.");
        }
        
        // Execute database operation first
        const result = await this.productRepo.updateProductDetails(productId, userId, updateData);
        
        // Emit event to billing service after successful update
        try {
            const productUpdatedEvent = {
                productId,
                curatorId,
                name: updateData.name,
                description: updateData.description,
                category: updateData.category,
                maxSubscribers: updateData.maxSubscribers
            };

            this.billingService.emit('product.updated', productUpdatedEvent);
            this.logger.log(`Product update event emitted for productId: ${productId}`);
        } catch (error) {
            this.logger.error(`Failed to emit product update event: ${error.message}`, error.stack);
            // Continue with the operation - billing service integration failure shouldn't break main functionality
        }

        return result;
    }
}
