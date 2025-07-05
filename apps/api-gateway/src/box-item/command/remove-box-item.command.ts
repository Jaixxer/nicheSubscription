import { BaseCommand } from "../../common/cqrs/base.command";

export class RemoveBoxItemCommand extends BaseCommand {
  constructor(
    public readonly userId: string,
    public readonly boxItemId: string, // The ID of the box item to be removed
  ) {
    super();
  }
}