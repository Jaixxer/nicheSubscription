import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllProductsQuery } from '../queries/get-all-products.query';
import { ProductRepository } from '../repository/repository.product';
import { Logger } from '@nestjs/common';

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsQueryHandler implements IQueryHandler<GetAllProductsQuery> {
    private readonly logger = new Logger(GetAllProductsQueryHandler.name);

    constructor(private readonly productRepository: ProductRepository) {}

    async execute(query: GetAllProductsQuery): Promise<any> {
        this.logger.log(`Fetching all products with limit: ${query.limit} and page: ${query.page}`);
        try {
            const offset = (query.page - 1) * query.limit;
            const products = await this.productRepository.findProductsByCategory('all', query.limit, offset);
            this.logger.log(`Fetched ${products.length} products`);
            return products;
        } catch (error) {
            this.logger.error('Failed to fetch products', error);
            throw error;
        }
    }
}



