import { instanceToPlain } from "class-transformer";
import { AccessForbidden } from "./AccessForbidden";
import { EntityNotFound } from "./EntityNotFound";
import { NotFound } from "./NotFound";

const notFoundMissing = [
  "NotFound (permissionError = false)",
  new NotFound("User", false),
] as const;

const notFoundPermission = [
  "NotFound (permissionError = true)",
  new NotFound("User", true),
] as const;

const forbidden = [
  "AccessForbidden",
  new AccessForbidden("User"),
] as const;

const entityNotFound = [
  "EntityNotFound",
  new EntityNotFound("User", { where: { id: "admin" }}),
] as const;

const all = [
  notFoundMissing,
  notFoundPermission,
  forbidden,
  entityNotFound,
] as const;

describe("NotFound", () => {

  describe("usage with class-transformer", () => {

    describe("'kind'", () => {

      it.each(all)("exposed from %s", (env, fp) => {
        // is typed correctly:
        expect<"NotFound">(fp.kind).toBe("NotFound");

        // runtime:
        const transformed = instanceToPlain(fp);
        expect(transformed.kind).toBe("NotFound");
      });

    });

    describe("permissionError", () => {
      it.each([true, false])("hidden in production (when '%p')", (val) => {
        const transformed = instanceToPlain(new NotFound("User", val));
        expect(transformed).not.toHaveProperty("permissionError");
      });

      it.each([true, false])("exposed in debug (when '%p')", (val) => {
        const transformed = instanceToPlain(new NotFound("User", val), { groups: ["debug"] });
        expect(transformed).toHaveProperty("permissionError", val);
      });
    });

    describe("status", () => {

      it.each([true, false])("defaults to '404' in production", (val) => {
        const transformed = instanceToPlain(new NotFound("User", val));
        expect(transformed).toHaveProperty("status", 404);
      });

      it("uses 403 for permissionError in debug", () => {
        const transformed = instanceToPlain(new NotFound("User", true), { groups: ["debug"] });
        expect(transformed).toHaveProperty("status", 403);
      });

      it("uses 404 for non-permissionError in debug", () => {
        const transformed = instanceToPlain(new NotFound("User", false), { groups: ["debug"] });
        expect(transformed).toHaveProperty("status", 404);
      });

    });

  });

});
