import { BaseQuery } from '../../common/cqrs/base.query';

export class findUserByEmailQuery extends BaseQuery{
    constructor(
        public readonly email: string
    ) {
        super();
    }
}