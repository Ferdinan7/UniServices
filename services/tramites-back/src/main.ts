import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv'
import cors from 'cors'

async function bootstrap() {
  dotenv.config()
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Server is running on http://localhost:${process.env.PORT ?? 3000}/tramites`);
}
bootstrap();
