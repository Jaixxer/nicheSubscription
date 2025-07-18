import { BaseQuery } from "../../common/cqrs/base.query";

export class CheckUserStripIdQuery extends BaseQuery {
  constructor(
    public readonly userId: string,

  ) {
    super();
  }
}