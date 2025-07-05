import { QueryHandler,IQueryHandler } from "@nestjs/cqrs";
import { GetProductsByCuratorIdQuery } from "../queries/get-products-by-curator-id.query";
import { ProductRepository } from "../repository/repository.product";

@QueryHandler(GetProductsByCuratorIdQuery)
export class GetProductsByCuratorIdQueryHandler implements IQueryHandler<GetProductsByCuratorIdQuery> {
    constructor(private productRepo: ProductRepository) {}

    async execute(query: GetProductsByCuratorIdQuery) {
        const { curatorId, page, limit } = query;
        let {offset} = query;
        if (!curatorId) {
            throw new Error("Curator ID is required.");
        }
        if (page < 1 || limit < 1) {
            throw new Error("Page and limit must be greater than 0.");
        }
         offset = (page - 1) * limit;
        if (offset < 0) {
            throw new Error("Offset cannot be negative.");
        }

        const products = await this.productRepo.findProductsByCuratorId(curatorId, limit, offset);
        if (!products || products.length === 0) {
            throw new Error("No products found for the given curator ID.");
        }

        return products;
    }
}