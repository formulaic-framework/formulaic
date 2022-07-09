import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ApiExceptionFilter } from "@formulaic/exception-filter";
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ApiExceptionFilter(httpHost));
  await app.listen(3000);
}
bootstrap();
