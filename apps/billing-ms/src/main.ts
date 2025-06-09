import { NestFactory } from '@nestjs/core';
import { BillingMsModule } from './billing-ms.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices"

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(BillingMsModule,
    {
      transport:Transport.REDIS,
      options:{
        port:6379,
        host:"localhost"
      }
    }
  );
  
  await app.listen();
}
bootstrap();
