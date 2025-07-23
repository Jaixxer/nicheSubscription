import { BaseQuery } from "apps/api-gateway/src/common/cqrs/base.query";
import { UserRoles } from "libs/common/enums";
export class SearchUserQuery extends BaseQuery {
    constructor(
        public readonly email?: string,
        public readonly role?: UserRoles,
        public readonly firstName?: string,
        public readonly lastName?: string,
        public readonly isActive?: boolean,
        public readonly subscription?: string,
        public readonly BillingStartDate?:Date,
        public readonly BillingEndDate?: Date, 
        public readonly page: number=1,
        public readonly limit: number=10,
        public readonly sortBy: string= 'createdAt',
        public readonly sortOrder: 'asc' | 'desc'= 'asc'
    ) {
        super();
    }
}