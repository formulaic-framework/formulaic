import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { FPInterceptor } from '@formulaic/fp-interceptor';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalInterceptors(new FPInterceptor());
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it("hides AccessForbidden/EntityNotFound", async () => {
    const forbidden = await request(app.getHttpServer())
      .get("/access-forbidden")
      .expect(200);

    const notFound = await request(app.getHttpServer())
      .get("/entity-not-found")
      .expect(200);

    expect(forbidden.body).toStrictEqual(notFound.body);
  });

});
