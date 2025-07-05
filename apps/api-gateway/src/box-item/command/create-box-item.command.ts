import { BaseCommand } from "../../common/cqrs/base.command";

export class CreateBoxItemCommand extends BaseCommand {
  constructor(
    public readonly userId:string,
    public readonly productId:string, // For validation purposes and linking purposes
    public readonly name: string,
    public readonly quantity: number,
    public readonly description: string | null, // Can be null if not provided
  ) {
    super();
  }
}