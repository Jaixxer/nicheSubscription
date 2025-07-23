import { CommandHandler,ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductAdminCommand } from '../../commands/admin/delete-product-by-admin.command';
import { ProductRepository } from '../../repository/repository.product';
import { Logger } from '@nestjs/common';

@CommandHandler(DeleteProductAdminCommand)
export class DeleteProductByAdminCommandHandler implements ICommandHandler<DeleteProductAdminCommand>{
    private readonly logger = new Logger(DeleteProductByAdminCommandHandler.name)
    constructor(private readonly productRepo: ProductRepository){}
    async execute(command: DeleteProductAdminCommand): Promise<any> {
        this.logger.log(`Product ${command.productId} is being deleted by userId ${command.userId}`)
        try {
            const deletion = await this.productRepo.deleteProduct(command.productId)
            if (deletion){
                this.logger.log(`Product with productId ${command.productId} has been deleted`)
                return {
                    success: true,
                    message: `Product with productId ${command.productId} has been deleted successfully`
                };
                
            }
        } catch (error) {
            this.logger.debug(error)
            return {
                success: false,
                message: `Failed to delete product with productId ${command.productId}. Error: ${error.message}`
            };
            
        }
    }
}