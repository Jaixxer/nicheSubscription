import { NestFactory } from '@nestjs/core';
import { BillingMsModule } from './billing-ms.module';

async function bootstrap() {
  const app = await NestFactory.create(BillingMsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
