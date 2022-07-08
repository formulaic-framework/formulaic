import { Controller, Get, INestApplication } from "@nestjs/common";
import { AuthModule, Private, Public } from "@formulaic/auth-module";
import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { sign } from "jsonwebtoken";
import { JWTPayload } from "../../src/user/dto/jwt-payload";

@Controller("/")
class DefaultController {

  @Get("default")
  public defaultRoute() {
    return "ok";
  }

  @Get("public")
  @Public()
  public publicRoute() {
    return "ok";
  }

  @Get("protected")
  @Private()
  public protected() {
    return "ok";
  }

}

describe("@Public() and @Private()", () => {

  let jwt: string;
  let app: INestApplication;

  beforeAll(() => {
    jwt = sign({
      sub: "admin",
      roles: [],
    }, "test");
  });

  afterEach(async () => {
    if(app) {
      await app.close();
    }
    app = undefined;
  });

  it.each([
    ["user", "allow", "default", "succeeds"],
    ["anon", "allow", "default", "succeeds"],

    ["user", "allow", "@Public", "succeeds"],
    ["anon", "allow", "@Public", "succeeds"],

    ["user", "allow", "@Private", "succeeds"],
    ["anon", "allow", "@Private", "fails"],

    ["user", "deny", "default", "succeeds"],
    ["anon", "deny", "default", "fails"],

    ["user", "deny", "@Public", "succeeds"],
    ["anon", "deny", "@Public", "succeeds"],

    ["user", "deny", "@Private", "succeeds"],
    ["anon", "deny", "@Private", "fails"],
  ] as const)("a %s with defaultPolicy=%s with a %s route %s", async (userType, defaultPolicy, route, result) => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule.forRootAsync({
          global: true,
          imports: [],
          inject: [],
          useFactory: () => ({
            secretOrPublicKey: "test",
            defaultPolicy,
            payload: JWTPayload,
            userId: ({ sub }) => sub,
            getUserById: id => null,
            getRoles: ({ roles }) => roles,
          }),
        }),
      ],
      controllers: [
        DefaultController,
      ],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    const url = route === "default"
      ? "/default"
      : route === "@Private"
        ? "/protected"
        : "/public";

    let req = request(app.getHttpServer()).get(url);

    if(userType === "user") {
      req = req.set("Authorization", `Bearer ${jwt}`);
    }

    if(result === "succeeds") {
      return req.expect(200).expect("ok");
    }
    return req.expect(403);
  });

});
