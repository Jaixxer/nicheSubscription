import { BaseQuery } from "../../common/cqrs/base.query";

export class ValidateCredentialsQuery extends BaseQuery {
    constructor(
        public readonly email: string,
        public readonly password: string
    ) {
        super();
    }
}