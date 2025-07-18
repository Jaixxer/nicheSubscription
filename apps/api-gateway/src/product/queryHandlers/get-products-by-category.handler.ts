import { QueryHandler, IQueryHandler } from "@nestjs/cqrs";
import { ProductRepository } from "../repository/repository.product";
import { getProductsByCategoryQuery} from "../queries/index";

@QueryHandler(getProductsByCategoryQuery)
export class GetProductByCategoryQueryHandler implements IQueryHandler<getProductsByCategoryQuery> {
    constructor(private productRepo: ProductRepository) {}

    async execute(query: getProductsByCategoryQuery) {
        const { category, page, limit } = query;
        if (!category) {
            throw new Error("Category is required.");
        }
        if (page < 1 || limit < 1) {
            throw new Error("Page and limit must be greater than 0.");
        }
        const offset = (page - 1) * limit;
        if (offset < 0) {
            throw new Error("Offset cannot be negative.");
        }

        const products = await this.productRepo.findProductsByCategory(category, limit, offset);
        if (!products || products.length === 0) {
            throw new Error("No products found for the given category.");
        }

        return products;
    }
}