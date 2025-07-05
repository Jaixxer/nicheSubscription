import { Module } from '@nestjs/common';
import { BoxItemController } from './box-item.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { BoxItemQueryRepository } from './repositories/box-item.query.repository';
import { BoxItemCommandRepository } from './repositories/box-item.command.repository';
import { PrismaModule } from 'apps/api-gateway/prisma/prisma.module';
import { ProductModule } from '../product/product.module';
import { GetBoxItemsByProductIdHandler } from './queryHandlers/get-box-items-by-productId.handler';
import { CreateBoxItemHandler } from './commandHandlers/create-box-item.handler';
import { ProductRepository } from '../product/repository/repository.product';
import { RemoveBoxItemHandler } from './commandHandlers/remove-box-item.handler';
import { UpdateBoxItemHandler } from './commandHandlers/update-box-item.handler';
@Module({
  imports: [CqrsModule,PrismaModule,ProductModule],
  controllers: [BoxItemController],
  providers: [ProductRepository,BoxItemCommandRepository, BoxItemQueryRepository,GetBoxItemsByProductIdHandler,CreateBoxItemHandler,RemoveBoxItemHandler,UpdateBoxItemHandler],
})
export class BoxItemModule {}
