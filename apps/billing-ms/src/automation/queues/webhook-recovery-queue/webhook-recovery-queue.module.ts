import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

@Module({
    imports:[BullModule.registerQueue({
        name: 'webhook-recovery-queue',
        defaultJobOptions: {
            removeOnComplete: true,
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 5000
            }
        }
    })]
})
export class WebhookRecoveryQueueModule {}
