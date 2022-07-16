import { NestFactory } from '@nestjs/core';
import { FPInterceptor } from "@formulaic/fp-interceptor";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new FPInterceptor());
  await app.listen(3000);
}
bootstrap();
