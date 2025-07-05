import { BaseCommand } from "../../common/cqrs/base.command";

export class UpdateBoxItemCommand extends BaseCommand {
  constructor(
    public readonly userId: string,
    public readonly boxItemId: string, // ID of the box item to update
    public readonly name?: string, // Optional name update
    public readonly quantity?: number, // Optional quantity update
    public readonly description?: string | null // Optional description update
  ) {
    super();
  }
}