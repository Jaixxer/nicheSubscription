import { Controller, Post, Req,Body, UseGuards, Param } from '@nestjs/common';
import { WizardStateService } from './services/wizard-state.service';
import { WizardCompletionService } from './services/wizard-completion.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('product-wizard')
export class ProductWizardController {
    constructor(private wizardStateService:WizardStateService,private wizardCompletionService:WizardCompletionService) {}
    @Post('start')
    @UseGuards(AuthGuard('jwt')) 
    async startWizard(@Req() req: any) {
        // Logic to start the wizard
        const userId = req.user.id
        return this.wizardStateService.startWizard(userId);
    }
    /// TESTING PURPOSESS///
    @Post('get-wizard-state')
    @UseGuards(AuthGuard('jwt'))
    async getWizardState(@Body() body: any, @Req() req: any) {
        const { wizardId } = body;
        const userId = req.user.id;
        return this.wizardStateService.getWizardState(wizardId, userId);
    }

    @Post('save-step/:stepNumber')
    @UseGuards(AuthGuard('jwt')) 

    async saveStep(@Param('stepNumber') stepNumber: string, @Body() body: any, @Req() req: any) {
        const { wizardId, stepData } = body;
        console.log('Step Number:', stepNumber);
        const userId = req.user.id;
        const stepNumberInt = parseInt(stepNumber, 10);
        return this.wizardStateService.saveStep(wizardId, stepNumberInt, stepData, userId);
    }
    @Post('complete')
    @UseGuards(AuthGuard('jwt')) 

    async completeWizard(@Body() body: any, @Req() req: any) {
        const { wizardId, publish } = body;
        const userId = req.user.id;
        return this.wizardCompletionService.completeWizard(wizardId, userId,publish);
    }
}
