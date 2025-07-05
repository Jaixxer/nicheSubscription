import { IQueryHandler ,QueryHandler} from '@nestjs/cqrs';
import { GetBoxItemsByProductIdQuery } from '../queries/get-box-items-by-productId.query';
import { BoxItemQueryRepository } from '../repositories/box-item.query.repository';
import { BoxItemDto } from 'libs/common/dtos/dto.box-item';
import { ProductRepository } from '../../product/repository/repository.product';

@QueryHandler(GetBoxItemsByProductIdQuery)
export class GetBoxItemsByProductIdHandler implements IQueryHandler<GetBoxItemsByProductIdQuery> {
  constructor(private readonly boxItemQueryRepo: BoxItemQueryRepository, private readonly productRepo:ProductRepository) {}

  async execute(query: GetBoxItemsByProductIdQuery): Promise<BoxItemDto[]> {
    const { productId } = query;
    const product = await this.productRepo.findById(productId);
    if (!product) {
        throw new Error('Product not found.');
    }
    const boxItems = await this.boxItemQueryRepo.getBoxItemsByProductId(productId);
    if (!boxItems || boxItems.length === 0) {
      throw new Error('No box items found for the given product ID.');
    }
    return boxItems.map(item => new BoxItemDto(item));
  }
}   

