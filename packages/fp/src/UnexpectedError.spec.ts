import { ClassTransformOptions, instanceToPlain } from "class-transformer";
import { UnexpectedError } from "./UnexpectedError";

describe("UnexpectedError", () => {

  const err = new UnexpectedError<number, Error>(new Error(), "test");

  describe("transforming (class-transformer)", () => {

    function inAllEnvironments(desc: string, fn: (opts: ClassTransformOptions) => any) {
      describe(`${desc} in any environment`, () => {
        test("in development", () => fn({ groups: ["debug"] }));
        test("in production", () => fn({ groups: [] }));
      });
    }

    inAllEnvironments("exposes 'kind'", (opts) => {
      const err = new UnexpectedError();
      const transformed = instanceToPlain(err, opts);
      expect(transformed).toHaveProperty("kind", "UnexpectedError");
    });

    inAllEnvironments("exposes 'status'", (opts) => {
      const err = new UnexpectedError();
      const transformed = instanceToPlain(err, opts);
      expect(transformed).toHaveProperty("status", 500);
    });

    describe("'code' property", () => {

      it("does not expose by default", () => {
        const transformed = instanceToPlain(err);
        expect(transformed).toHaveProperty("code", undefined);
        expect(transformed.code).toBeUndefined();
      });

      it.each([
        "debug",
        "info",
        "exposeUnexpectedType",
      ])("exposes 'code' under groups (%s)", (allGroups) => {
        const groups = allGroups.split(", ");
        const transformed = instanceToPlain(err, { groups });
        expect(transformed).toHaveProperty("code", "test");
      });

      it("is 'undefined' if not set", () => {
        const transformed = instanceToPlain(new UnexpectedError(), { groups: [ "debug" ] });
        expect(transformed).toHaveProperty("code", undefined);
        expect(transformed.code).toBeUndefined();
      });

      it("is 'undefined' if list of groups is empty", () => {
        const transformed = instanceToPlain(err, { groups: [] });
        expect(transformed).toHaveProperty("code", undefined);
        expect(transformed.code).toBeUndefined();
      });

    });

  });

  describe("map", () => {
    it("returns itself", () => {
      const mapped = err.map(i => i + 5);
      expect(mapped).toBe(err);
      expect(mapped.kind).toBe("UnexpectedError");
    });
  });

  describe("chain", () => {
    it("returns itself", async () => {
      const chained = await err.chain(async i => i + 5);
      expect(chained).toBe(err);
      expect(chained.kind).toBe("UnexpectedError");
    });
  });

});
