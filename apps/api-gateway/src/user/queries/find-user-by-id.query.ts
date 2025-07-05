import { BaseQuery } from '../../common/cqrs/base.query';

export class findUserByIdQuery extends BaseQuery{
    constructor(
        public readonly id: string
    ) {
        super();
    }
}