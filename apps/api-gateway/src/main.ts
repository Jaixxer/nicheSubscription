import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule,new FastifyAdapter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true}));
      app.enableCors({
    origin: ['http://localhost:5173'], // frontend dev URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true, // if using cookies or sessions
  });


  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
