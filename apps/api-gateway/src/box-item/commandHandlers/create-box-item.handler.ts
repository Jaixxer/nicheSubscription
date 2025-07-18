import { CommandHandler,ICommandHandler } from "@nestjs/cqrs";
import { CreateBoxItemCommand } from "../command/index";
import { BoxItemCommandRepository } from "../repositories/box-item.command.repository";
import { BoxItemDto } from "libs/common/dtos/dto.box-item";
import { ProductRepository } from "../../product/repository/repository.product";
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@CommandHandler(CreateBoxItemCommand)
export class CreateBoxItemHandler implements ICommandHandler<CreateBoxItemCommand> {
  private readonly logger = new Logger(CreateBoxItemHandler.name);
  
  constructor(
    private readonly boxItemCommandRepo: BoxItemCommandRepository,
    private readonly productRepo: ProductRepository,
    @Inject('BILLING_SERVICE') private readonly billingService: ClientProxy
  ) {}

  async execute(command: CreateBoxItemCommand): Promise<BoxItemDto> {
    const { userId,productId, name,description,quantity } = command;

    // Validate product existence
    console.log(userId)
    const product = await this.productRepo.findById(productId);
    if (!product) {
      throw new Error('Product not found.');
    }
    if(product.curatorId != userId){
        throw new Error('You are not authorized to create a box item for this product.');
    }
    
    // Execute database operation first
    const boxItem = await this.boxItemCommandRepo.createBoxItem({
      productId,
      name,
      quantity,
      description
    });

    // Emit event to billing service after successful creation
    try {
      const boxItemAddedEvent = {
        boxItemId: boxItem.id,
        productId,
        curatorId: product.curatorId,
        name,
        description,
        quantity
      };

      this.billingService.emit('box-item.added', boxItemAddedEvent);
      this.logger.log(`Box item added event emitted for boxItemId: ${boxItem.id}`);
    } catch (error) {
      this.logger.error(`Failed to emit box item added event: ${error.message}`, error.stack);
      // Continue with the operation - billing service integration failure shouldn't break main functionality
    }

    return new BoxItemDto(boxItem);
  }
}
