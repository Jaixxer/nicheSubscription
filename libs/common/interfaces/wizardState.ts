import { WizardStep1Dto, WizardStep2Dto,WizardStep3Dto } from "../dtos";

export interface WizardState{
    userId : string;
    wizardId: string;
    currentStep: number;
    step1Data?: WizardStep1Dto;
    step2Data? : WizardStep2Dto;
    step3Data? :WizardStep3Dto;
    createdAt: Date;
    updatedAt: Date;

}