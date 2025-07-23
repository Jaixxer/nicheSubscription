import { BaseQuery } from "../../common/cqrs/base.query";

export class GetAllProductsQuery extends BaseQuery {
    constructor(
        public readonly limit: number = 10,
        public readonly page: number = 1
    ) {
        super();
    }
}