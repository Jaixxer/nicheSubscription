import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { RemoveBoxItemCommand } from '../command/remove-box-item.command';
import { BoxItemQueryRepository } from '../repositories/box-item.query.repository';
import { BoxItemCommandRepository } from '../repositories/box-item.command.repository';
import { errorCodes } from 'fastify';
import { HttpException, NotFoundException, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@CommandHandler(RemoveBoxItemCommand)
export class RemoveBoxItemHandler implements ICommandHandler<RemoveBoxItemCommand> {
    private readonly logger = new Logger(RemoveBoxItemHandler.name);

    constructor(
        private readonly boxItemQueryRepository: BoxItemQueryRepository,
        private readonly boxItemCommandRepository: BoxItemCommandRepository,
        @Inject('BILLING_SERVICE') private readonly billingClient: ClientProxy
    ) {}
    
    async execute(command: RemoveBoxItemCommand): Promise<object> {
        const { userId ,boxItemId } = command;
        const product = await this.boxItemQueryRepository.findById(boxItemId);
        if(!product){
            throw new NotFoundException(`Box item with ID ${boxItemId} not found`);
            throw new Error('Invalid box item ID');
        }
        const curatorId = product.product.curatorId
        if (curatorId !== userId) {
        throw new Error('You do not have permission to remove this box item');
        }
        // Check if the box item exists and belongs to the user
    
        // Remove the box item
        const result =await this.boxItemCommandRepository.remove(boxItemId);

        // Emit event to billing service
        try {
            this.billingClient.emit('box-item.removed', {
                boxItemId: boxItemId,
                productId: product.product.id,
                curatorId: curatorId,
                name: product.name,
                removedAt: new Date()
            });
        } catch (error) {
            this.logger.error('Failed to emit box-item.removed event:', error);
        }

        return {result}

    }
    }