import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateProductCommand } from "../commands/index";
import { ProductRepository } from "../repository/repository.product";
import { Inject, Logger } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { RenewalPlan } from "@prisma/client";
import { lastValueFrom } from 'rxjs';

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler implements ICommandHandler<CreateProductCommand> {
    private readonly logger = new Logger(CreateProductCommandHandler.name);
    
    constructor(
        private readonly productRepository: ProductRepository,
        @Inject('BILLING_SERVICE') private readonly billingService: ClientProxy
    ) { }

    async execute(command: CreateProductCommand): Promise<any> {
        const { curatorId,curatorStripeId, name, stock, pricingTiers,availablePlans, allowBackorder, maxSubscribers, description,category } = command;
        
        // Execute database operation first
        if(!curatorStripeId){
            throw new Error('First validate the curator!');
        }
        const result = await this.productRepository.createProduct(curatorId, {
            name,
            stock,
            pricingTiers,
            availablePlans,
            allowBackorder,
            maxSubscribers,
            description,
            category
        });

        // Emit event to billing service after successful creation
        if (result && result.product) {
            try {
                const productCreatedEvent = {
                    productId: result.product.id,
                    curatorId,
                    name,
                    description,
                    category,
                    maxSubscribers,
                    availablePlans ,
                    pricingTiers: result.product.pricingTiers || []
                };
                console.log(curatorStripeId)
               const ids = await  lastValueFrom(this.billingService.send('product.created.with.plans', {productCreatedEvent,curatorStripeId}));
                this.logger.log(`Product created with ID: ${ids.productId} and Stripe ID: ${ids.stripeProductId}`);
                console.log(ids.pricingTiers);
                if (ids){
                const addStripeId = await this.productRepository.addStripeIdToProduct(result.product.id, ids.stripeProductId);
                const addStripeIdToPricingTiers = await this.productRepository.addStripeIdToPricingTiers(result.product.id, ids.pricingTiers);
                this.logger.log(`Product creation event emitted for productId: ${result.product.id}`);}
            } catch (error) {
                this.logger.error(`Failed to emit product creation event: ${error}`, error.stack);
                // Note: We don't fail the operation, just log the error
            }
        }

        return result;
    }
}