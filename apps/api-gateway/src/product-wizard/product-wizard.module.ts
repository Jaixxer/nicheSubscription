import { Module } from '@nestjs/common';
import { WizardStateService } from './services/wizard-state.service';
import { ProductWizardController } from './product-wizard.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { RedisModule } from '../redis/redis.module';
import { RedisService } from '../redis/redis.service';
import { WizardCompletionService } from './services/wizard-completion.service';

@Module({
  imports: [CqrsModule,RedisModule],
  providers: [WizardStateService,RedisService,WizardCompletionService],
  controllers: [ProductWizardController]
})
export class ProductWizardModule {}
