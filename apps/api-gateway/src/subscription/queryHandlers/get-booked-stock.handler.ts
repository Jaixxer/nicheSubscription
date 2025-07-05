import { QueryHandler,IQueryHandler } from "@nestjs/cqrs";

import { GetBookedStockQuery } from "../queries/get-booked-stock.query";
import { SubscriptionQueryRepository } from "../repositories/subscription.query.repository";
import { ProductRepository } from "apps/api-gateway/src/product/repository/repository.product";

@QueryHandler(GetBookedStockQuery)
export class GetBookedStockQueryHandler implements IQueryHandler<GetBookedStockQuery> {
    constructor(
        private readonly subscriptionRepo: SubscriptionQueryRepository,
        private readonly productRepo: ProductRepository
    ) {}

    async execute(query: GetBookedStockQuery): Promise<number> {
        const { productId } = query;
    
        const product = await this.productRepo.findById(productId);
        if (!product) {
            throw new Error("Product not found.");
        }
        return this.subscriptionRepo.getBookedStockForProduct(productId);
     

        return 0; // If backorders are allowed, return 0 booked stock
    }
}