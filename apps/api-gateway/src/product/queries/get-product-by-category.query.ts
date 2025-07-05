import { BaseQuery } from "../../common/cqrs/base.query";

export class getProductsByCategoryQuery extends BaseQuery {
    constructor(
        public readonly category: string,
        public readonly page: number = 1,
        public readonly limit: number = 10,
    ) {
        super();
    }
}