import { Body, Controller, Get,Param,Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetBoxItemsByProductIdQuery } from './queries/index';
import { AuthGuard } from '@nestjs/passport';
import { CreateBoxItemCommand ,RemoveBoxItemCommand,UpdateBoxItemCommand} from './command/index';
@Controller('box-item')
export class BoxItemController {
    constructor(private commandBus:CommandBus,private queryBus:QueryBus) {}
    @Get(':productId')
    @UseGuards(AuthGuard('jwt'))
    async getBoxItemsByProductId(@Param() param) {
        return this.queryBus.execute(new GetBoxItemsByProductIdQuery(param.productId));
    }
    @Post('create')
    @UseGuards(AuthGuard('jwt'))
    async createBoxItem(@Req() req: any, @Body() dto: any) {
        const userId = req.user.id;
        if (!dto.productId || dto.quantity <= 0) {
            throw new Error('Invalid productId or quantity');
        }
        const boxItem = await this.commandBus.execute(
            new CreateBoxItemCommand(
                userId,
                dto.productId,
                dto.name,
                dto.quantity,
                dto.description ?? '' // Ensure description is always a string
            )
        );
        return boxItem;
    }
    @Post('remove')
    @UseGuards(AuthGuard('jwt'))
    async removeBoxItem(@Req() req: any, @Body() dto: any) {
        const userId = req.user.id;
        if (!dto.boxItemId) {
            throw new Error('Invalid box item ID');
        }

        const deletion = await this.commandBus.execute(
            new RemoveBoxItemCommand(userId, dto.boxItemId)
        );
        
        return deletion
    }
    @Post('update')
    @UseGuards(AuthGuard('jwt'))
    async updateBoxItem(@Req() req: any, @Body() dto: any) {
        const userId = req.user.id;
        if (!dto.boxItemId || !dto.name || dto.quantity <= 0) {
            throw new Error('Invalid box item data');
        }

        await this.commandBus.execute(
            new UpdateBoxItemCommand(
                userId,
                dto.boxItemId,
                dto.name,
                dto.quantity,
                dto.description  // Ensure description is optional
            )
        );
        
        return { message: 'Box item updated successfully' };
    }
}
