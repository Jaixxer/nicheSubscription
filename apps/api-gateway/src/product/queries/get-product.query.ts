import { BaseQuery } from "../../common/cqrs/base.query";

export class GetProductQuery extends BaseQuery {
    constructor(
        public readonly productId: string
    ) {
        super();
    }
}