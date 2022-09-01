import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { CancelablePromise, PetStoreClient } from "../../helpers/generated";
import { Literal, NoValue } from "@formulaic/base-fp";
import { wrapFetch } from "./wrapFetch";

class NotFound<T> extends NoValue<T, "NotFound", 404> {
  public override readonly kind: "NotFound";
  public override readonly status: 404;

  public constructor() {
    super();
    this.kind = "NotFound";
    this.status = 404;
  }
}

function expectFP<Kinds extends string, Needle extends Kinds>(kind: Kinds, search: Needle): asserts kind is Needle {
  expect(kind).toBe(search);
}

const restHandlers = [
  rest.get("https://petstore.swagger.io/v2/user/obj", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({
      test: "hello",
    }));
  }),

  rest.get("https://petstore.swagger.io/v2/user/fp", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(new Literal(10)));
  }),

  rest.get("https://petstore.swagger.io/v2/user/not-found-fp", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(new NotFound()));
  }),

  rest.get("https://petstore.swagger.io/v2/user/not-found-fp-as-404", (req, res, ctx) => {
    return res(ctx.status(404), ctx.json(new NotFound()));
  }),

  rest.get("https://petstore.swagger.io/v2/user/not-found-fp-as-500", (req, res, ctx) => {
    return res(ctx.status(500), ctx.json(new NotFound()));
  }),
];

describe("wrapFetch", () => {

  const server = setupServer(...restHandlers);
  let store: PetStoreClient;

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  beforeEach(() => {
    store = new PetStoreClient({
      BASE: "https://petstore.swagger.io/v2",
    });
  });

  afterAll(() => server.close());

  afterEach(() => server.resetHandlers());

  describe("returns responses", () => {

    describe("with openapi-typescript-codegen", () => {

      it("returns FP entities", async () => {
        const res = await wrapFetch(() => store.user.getUserByName("fp") as any as CancelablePromise<Literal<number>>);
        expect(res.kind).toBe("Literal");
      });

      it("returns NotFound (returned as 200)", async () => {
        const res = await wrapFetch(() => store.user.getUserByName("not-found-fp") as any as CancelablePromise<Literal<number> | NotFound<"User">>);
        expect(res.kind).toBe("NotFound");
      });

      it("wraps misc data in Literal", async () => {
        const res = await wrapFetch(() => store.user.getUserByName("obj") as any as CancelablePromise<{ test: string }>);
        expectFP(res.kind, "Literal");
        expect(res.data.test).toBe("hello");
      });

    });

  });

  /**
   * Most API libraries throw a generic error for any non-200 response recieved.
   *
   * This causes problems for APIs that wish to return FP objects representing errors,
   * yet also wish to represent the response with a proper status code.
   *
   * wrapFetch should handle these cases, parsing the response body
   * and returning successful responses as FP instances.
   */
  describe("allows FPs to be returned as non-200", () => {

    describe("with openapi-typescript-codegen", () => {

      it("handles 404", async () => {
        const res = await wrapFetch(() => store.user.getUserByName("not-found-fp-as-404") as any as CancelablePromise<Literal<number> | NotFound<"User">>);
        expect(res.kind).toBe("NotFound");
      });

      it("handles 500", async () => {
        const res = await wrapFetch(() => store.user.getUserByName("not-found-fp-as-500") as any as CancelablePromise<Literal<number> | NotFound<"User">>);
        expect(res.kind).toBe("NotFound");
      });

    });

  });

});
