import { Module } from '@nestjs/common';
import { ProductRepository } from './repository/repository.product';
import { ProductController } from './product.controller';
import { PrismaModule } from 'apps/api-gateway/prisma/prisma.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateProductCommandHandler } from './commandHandlers/create-product-command.handler';
import { GetProductQueryHandler } from './queryHandlers/get-product.handler';
import { UpdateProductCommandHandler } from './commandHandlers/update-product-command.handler';
import { GetProductsByCuratorIdQueryHandler } from './queryHandlers/get-product-by-curator-id.handler';
import { GetProductByCategoryQueryHandler } from './queryHandlers/get-products-by-category.handler';
import { DeleteProductHandler } from './commandHandlers/delete-product-command.handler';
@Module({
  imports:[PrismaModule,CqrsModule],
  providers: [ProductRepository,CreateProductCommandHandler,GetProductQueryHandler,UpdateProductCommandHandler,GetProductsByCuratorIdQueryHandler,GetProductByCategoryQueryHandler,DeleteProductHandler],
  controllers: [ProductController]
})
export class ProductModule {}
