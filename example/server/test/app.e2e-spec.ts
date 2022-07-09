import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { ApiExceptionFilter } from '@formulaic/exception-filter';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const httpHost = app.get(HttpAdapterHost);
    app.useGlobalFilters(new ApiExceptionFilter(httpHost));
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it("maps exceptions (AccessForbiddenException -> ForbiddenResponse)", async () => {
    const res = await request(app.getHttpServer())
      .get("/throw-access-forbidden")
      .expect(403)
      .expect({
        kind: "ForbiddenResponse",
        statusCode: 403,
        message: "Forbidden",
      });
  });

});
