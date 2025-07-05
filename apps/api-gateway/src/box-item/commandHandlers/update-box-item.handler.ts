import { CommandHandler , ICommandHandler} from "@nestjs/cqrs";
import { UpdateBoxItemCommand } from "../command/index";
import { BoxItemCommandRepository } from "../repositories/box-item.command.repository";
import { BoxItemQueryRepository } from "../repositories/box-item.query.repository";
import { ForbiddenException } from "@nestjs/common";

@CommandHandler(UpdateBoxItemCommand)
export class UpdateBoxItemHandler implements ICommandHandler<UpdateBoxItemCommand> {
  constructor(
    private readonly boxItemCommandRepo: BoxItemCommandRepository,
    private readonly boxItemQueryRepo: BoxItemQueryRepository
  ) {}

  async execute(command: UpdateBoxItemCommand): Promise<void> {
    const { userId, boxItemId, name, quantity, description } = command;

    // Validate box item existence
    const boxItem = await this.boxItemQueryRepo.findById(boxItemId);
    if (!boxItem) {
      throw new Error('Box item not found.');
    }

    // Check if the user is authorized to update the box item
    if (boxItem.product.curatorId !== userId) {
      throw new ForbiddenException('You are not authorized to update this box item.');
    }

    // Update box item
    await this.boxItemCommandRepo.updateBoxItem({
      id: boxItemId,
      name,
      quantity,
      description
    });
  }
}