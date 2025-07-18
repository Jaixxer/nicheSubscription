import { CommandHandler , ICommandHandler} from "@nestjs/cqrs";
import { UpdateBoxItemCommand } from "../command/index";
import { BoxItemCommandRepository } from "../repositories/box-item.command.repository";
import { BoxItemQueryRepository } from "../repositories/box-item.query.repository";
import { ForbiddenException, Inject, Logger } from "@nestjs/common";
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(UpdateBoxItemCommand)
export class UpdateBoxItemHandler implements ICommandHandler<UpdateBoxItemCommand> {
  private readonly logger = new Logger(UpdateBoxItemHandler.name);

  constructor(
    private readonly boxItemCommandRepo: BoxItemCommandRepository,
    private readonly boxItemQueryRepo: BoxItemQueryRepository,
    @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy
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
    const updatedBoxItem = await this.boxItemCommandRepo.updateBoxItem({
      id: boxItemId,
      name,
      quantity,
      description
    });

    // Emit event to billing service
    try {
      this.billingClient.emit('box-item.updated', {
        boxItemId: updatedBoxItem.id,
        name: updatedBoxItem.name,
        quantity: updatedBoxItem.quantity,
        description: updatedBoxItem.description,
        productId: updatedBoxItem.productId,
        curatorId: boxItem.product.curatorId,
        updatedAt: updatedBoxItem.updatedAt
      });
    } catch (error) {
      this.logger.error('Failed to emit box-item.updated event:', error);
    }
  }
}