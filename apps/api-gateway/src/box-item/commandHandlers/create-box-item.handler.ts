import { CommandHandler,ICommandHandler } from "@nestjs/cqrs";
import { CreateBoxItemCommand } from "../command/index";
import { BoxItemCommandRepository } from "../repositories/box-item.command.repository";
import { BoxItemDto } from "libs/common/dtos/dto.box-item";
import { ProductRepository } from "../../product/repository/repository.product";

@CommandHandler(CreateBoxItemCommand)
export class CreateBoxItemHandler implements ICommandHandler<CreateBoxItemCommand> {
  constructor(
    private readonly boxItemCommandRepo: BoxItemCommandRepository,
    private readonly productRepo: ProductRepository
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
    
    // Create box item
    const boxItem = await this.boxItemCommandRepo.createBoxItem({
      productId,
      name,
      quantity,
      description
    });

    return new BoxItemDto(boxItem);
  }
}
