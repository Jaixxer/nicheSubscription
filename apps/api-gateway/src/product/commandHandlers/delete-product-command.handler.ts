import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from '../commands/delete-product.command';
import { ProductRepository } from '../repository/repository.product';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler implements ICommandHandler<DeleteProductCommand> {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(command: DeleteProductCommand): Promise<void> {
    const { productId,userId,curatorId } = command;
    if (userId !== curatorId) {
        throw new Error('You are not authorized to delete this product');
        }
    
    await this.productRepository.deleteProduct(productId);
  }
}
