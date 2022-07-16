import { ApiExceptionFilter } from "@formulaic/exception-filter";
import { INestApplication } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("Exception filter", () => {
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
