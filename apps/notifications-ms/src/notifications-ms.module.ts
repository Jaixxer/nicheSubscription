import { Module } from '@nestjs/common';
import { ConfigModule,  } from '@nestjs/config';
import { SubscriptionConsumer } from './events/consumers/subscription.consumer';
import { UserConsumer } from './events/consumers/user.consumers';
import { NotificationService } from './services/notification.service';
import { NotificationTemplates } from './services/template.service';
import { SmsProvider } from './providers/sms.provider';
import { EmailProvider } from './providers/email.provider';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true})],
  controllers: [SubscriptionConsumer,UserConsumer],
  providers: [NotificationService,NotificationTemplates,SmsProvider,EmailProvider],
})
export class NotificationsMsModule {}
