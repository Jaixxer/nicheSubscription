import { BaseQuery } from "apps/api-gateway/src/common/cqrs/base.query";
import { Status } from "libs/common/dtos";

export class GetSubscriptionsQuery extends BaseQuery {
    constructor(
        public readonly userId: string,
        public readonly status: Status | 'all' = Status.active,
        public readonly limit: number=10,
        public readonly page: number=1
    ) {
        super();
    }
}