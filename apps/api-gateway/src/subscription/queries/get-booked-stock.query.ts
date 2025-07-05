import { BaseQuery } from "apps/api-gateway/src/common/cqrs/base.query";

export class GetBookedStockQuery extends BaseQuery {
    constructor(
        public readonly productId: string
    ) {
        super();
    }
}