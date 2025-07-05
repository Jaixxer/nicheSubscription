import { ICommandHandler, CommandHandler } from '@nestjs/cqrs';
import { RemoveBoxItemCommand } from '../command/remove-box-item.command';
import { BoxItemQueryRepository } from '../repositories/box-item.query.repository';
import { BoxItemCommandRepository } from '../repositories/box-item.command.repository';
import { errorCodes } from 'fastify';
import { HttpException, NotFoundException } from '@nestjs/common';

@CommandHandler(RemoveBoxItemCommand)
export class RemoveBoxItemHandler implements ICommandHandler<RemoveBoxItemCommand> {
    constructor(
        private readonly boxItemQueryRepository: BoxItemQueryRepository,
        private readonly boxItemCommandRepository: BoxItemCommandRepository,
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
        return {result}

    }
    }