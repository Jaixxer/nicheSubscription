import { NestFactory } from '@nestjs/core';
import { BillingMsModule } from './billing-ms.module';
import {MicroserviceOptions, Transport} from "@nestjs/microservices"
import { ValidationPipe } from '@nestjs/common';
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
  app.useGlobalPipes(new ValidationPipe({
      whitelist: true, forbidNonWhitelisted:true}));
  await app.listen();
}
bootstrap();
