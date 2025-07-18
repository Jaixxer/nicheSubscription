import { BaseCommand } from "../../common/cqrs/base.command";

export class CreateConnectedAccountCommand extends BaseCommand {
  constructor(
    public readonly curatorId:string,
    public readonly email: string
  ) {
    super();
  }
}