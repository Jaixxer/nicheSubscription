import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateProductCommand } from "../commands/index";
import { ProductRepository } from "../repository/repository.product";

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler implements ICommandHandler<CreateProductCommand> {
    constructor(private readonly productRepository: ProductRepository) { }

    async execute(command: CreateProductCommand): Promise<any> {
        const { curatorId, name, stock, pricingTiers,availablePlans, allowBackorder, maxSubscribers, description,category } = command;
        return this.productRepository.createProduct(curatorId, {
            name,
            stock,
            pricingTiers,
            availablePlans,
            allowBackorder,
            maxSubscribers,
            description,
            category
        });
    }
}