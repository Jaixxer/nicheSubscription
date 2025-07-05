import { QueryHandler,ICommandHandler } from "@nestjs/cqrs";
import { GetProductQuery } from "../queries/get-product.query";
import { ProductRepository } from "../repository/repository.product";

@QueryHandler(GetProductQuery)
export class GetProductQueryHandler implements ICommandHandler<GetProductQuery> {
    constructor(private productRepo: ProductRepository) {}

    async execute(query: GetProductQuery) {
        const { productId } = query;
        if (!productId) {
            throw new Error("Product ID is required.");
        }

        const product = await this.productRepo.findById(productId);
        if (!product) {
            throw new Error("Product not found.");
        }

        return product;
    }
}