import { NotificationsMsModule } from './notifications-ms.module';
import { NestFactory } from '@nestjs/core';
import {MicroserviceOptions, Transport} from "@nestjs/microservices"

async function bootstrap() {
  console.log('🔄 Starting notifications microservice...');
  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(NotificationsMsModule,
    {
      transport:Transport.REDIS,
      options:{
        port:6379,
        host:"localhost"
      }
    }
  );
  
  await app.listen();
  console.log('✅ Notifications microservice is listening on Redis');
}
bootstrap();

