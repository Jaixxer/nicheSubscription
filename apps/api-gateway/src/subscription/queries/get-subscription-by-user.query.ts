import { BaseQuery } from "apps/api-gateway/src/common/cqrs/base.query";
import { Status } from "libs/common/dtos/dto.subscription";

export class GetSubscriptionByUserQuery extends BaseQuery {
    constructor(
        public readonly subscriberId: string,
        public readonly status?: Status, // Optional status filter
        public readonly productId?: string // Optional product ID filter
    ) {
        super();
    }
}