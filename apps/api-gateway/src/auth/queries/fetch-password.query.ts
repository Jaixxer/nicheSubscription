import { BaseQuery } from "../../common/cqrs/base.query";

export class FetchPasswordQuery extends BaseQuery {
    constructor(
        public readonly email: string,    ) {
        super();
    }
}