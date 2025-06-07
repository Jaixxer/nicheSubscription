import { NestFactory } from '@nestjs/core';
import { NotificationsMsModule } from './notifications-ms.module';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsMsModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
