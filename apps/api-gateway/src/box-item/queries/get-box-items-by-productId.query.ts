import { BaseQuery } from "../../common/cqrs/base.query";

export class GetBoxItemsByProductIdQuery extends BaseQuery {
  constructor(public readonly productId: string) {
    super();
  }
}