import { BaseQuery } from "../../common/cqrs/base.query";

export class GetProductsByCuratorIdQuery extends BaseQuery {
    constructor(
        public readonly curatorId: string,
        public readonly page: number = 1,
        public readonly limit: number = 10,
        public readonly offset:number = 0
    ) {
        super();
    }
}