import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { ProductRepository } from '../repository/repository.product';
import { Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  private readonly logger = new Logger(DeleteProductHandler.name);

  constructor(
    private readonly productRepository: ProductRepository,
    @Inject('BILLING_SERVICE') private readonly billingService: ClientProxy
  ) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const { productId,userId,curatorId } = command;
    if (userId !== curatorId) {
        throw new Error('You are not authorized to delete this product');
        }
    
    // Execute database operation first
    await this.productRepository.deleteProduct(productId);

    // Emit event to billing service after successful deletion
    try {
      const productDeletedEvent = {
        productId,
        curatorId,
        deletedAt: new Date()
      };

      this.billingService.emit('product.deleted', productDeletedEvent);
      this.logger.log(`Product deletion event emitted for productId: ${productId}`);
    } catch (error) {
      this.logger.error(`Failed to emit product deletion event: ${error.message}`, error.stack);
      // Continue with the operation - billing service integration failure shouldn't break main functionality
    }
  }
}
