import { ForbiddenException, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { RedisService } from '../../redis/redis.service';
import { WizardState } from 'libs/common/interfaces/wizardState';
import { WizardStep1Dto,WizardStep2Dto,WizardStep3Dto } from 'libs/common/dtos';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class WizardStateService {
    constructor(private redisService:RedisService) { }
    async startWizard(userId: string) {
        const wizardId = randomUUID()
        const wizardState : WizardState= {
            userId:userId,
            wizardId: wizardId,
            currentStep: 1,
            step1Data: undefined,
            step2Data: undefined,
            step3Data: undefined,
            createdAt: new Date(),
            updatedAt: new Date(),

        }
        const saveWizardState = this.redisService.set(`${wizardId}`, JSON.stringify(wizardState), 3600);
        return {
            wizardId: wizardId,
            message: 'Product wizard started',
        }
    }
    async saveStep(wizardId: string, stepNumber: number, stepData: any, userId: string) {
        // Logic to save the step data in Redis or database
        let dtoInstance
        console.log(stepNumber)
        switch (stepNumber) {
            case 1:
                 dtoInstance= plainToInstance(WizardStep1Dto,stepData)
                break;
            case 2:
                dtoInstance= plainToInstance(WizardStep2Dto,stepData)
                
                break;
            case 3:
                dtoInstance= plainToInstance(WizardStep3Dto,stepData)

                break;
            default:
                throw new Error('Invalid step number');
        }
        console.log(dtoInstance)
        // Validate the DTO instance
        const errors = await validate(dtoInstance)
        console.log(errors)
        if (errors.length > 0) {
            throw new ForbiddenException('Validation failed: ' + (errors));
        }

        const data = await this.redisService.get(wizardId);
        let wizardState: WizardState = data ? JSON.parse(data) : null;
        wizardState[`step${stepNumber}Data`] = stepData;
        wizardState.currentStep= stepNumber
        wizardState.updatedAt=new Date()
        
        const saveStepData = this.redisService.set(`${wizardId}`, JSON.stringify(wizardState), 3600);
        return {
            message: `Step ${stepNumber} saved successfully`,
            wizardId: wizardId,
            stepData: stepData,
        }

    }
    async getWizardState(wizardId: string, userId: string) {
        // Logic to retrieve the wizard state from Redis or database
        const data = await this.redisService.get(wizardId);
        const wizardState: WizardState = data ? JSON.parse(data) : null;
        if (!wizardState || wizardState.userId !== userId) {
            throw new Error('Wizard not found or access denied');
        }
        return wizardState;
    }


}
