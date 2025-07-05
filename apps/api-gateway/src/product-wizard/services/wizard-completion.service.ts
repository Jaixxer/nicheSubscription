import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RedisService } from '../../redis/redis.service';
import { CreateProductCommand } from '../../product/commands/create-product.command';
import { error } from 'console';
import { CreateBoxItemCommand } from '../../box-item/command';
@Injectable()
export class WizardCompletionService {
    constructor(private commandBus:CommandBus,private redisService:RedisService) {}
    async completeWizard(wizardId: string, userId: string,publish:boolean) {
        // Logic to complete the wizard, e.g., saving final data, sending notifications, etc.
        if (publish){
            const data = await this.redisService.get(wizardId);
            if (!data ) {
                throw new Error('Wizard not found');
            }
            const wizardState = JSON.parse(data);
            if (wizardState.userId !== userId) {
                throw new Error('Access denied');
            }
            console.log('Wizard State:', wizardState);
            const createProduct = await this.commandBus.execute(new CreateProductCommand(
                userId,
                wizardState.step1Data.name,
                wizardState.step3Data.stock,
                wizardState.step2Data.pricingTiers,
                wizardState.step2Data.availablePlans,
                wizardState.step2Data.allowBackorder,
                wizardState.step2Data.maxSubscribers,
                wizardState.step1Data.description,
                wizardState.step1Data.category
            ));
            if (!createProduct) {
                throw new Error('Product creation failed'+error);
            }
            
          for (const boxItem of wizardState.step3Data.boxItems) {
                await this.commandBus.execute(new CreateBoxItemCommand(
                    userId,
                    createProduct.product.id,
                    boxItem.name,
                    boxItem.quantity,
                    boxItem.description 
                ));
            }
            const deleteReidsData = await this.redisService.del(wizardId);
            return {
                message: 'Product created successfully',
                product: createProduct.product,
                boxItems: createProduct.boxItems,
            };
        }
        else{
            return("You wanna delete this shit!")
        }
    }
}
