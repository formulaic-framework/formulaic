import { AccessForbidden } from "./AccessForbidden";
import { DatabaseException } from "./DatabaseException";

describe("AccessForbidden", () => {

  describe("mapData()", () => {

    it("stays AccessForbidden", () => {
      const forbidden = new AccessForbidden<number, "User">("User");
      const mapped = forbidden.mapData(i => i + 1);
      expect(mapped.kind).toBe("NotFound");
    });

  });

  describe("or()", () => {

    it("replaces the value with the value given", () => {
      const forbidden = new AccessForbidden("User");
      const afterOr = forbidden.or(10);
      expect(afterOr.kind).toBe("Data");
      expect(afterOr.data).toBe(10);
    });

  });

  describe("substitute()", () => {

    it("replaces the value with the value given", () => {
      const forbidden = new AccessForbidden("user");
      const afterSub = forbidden.substitute(10);
      expect(afterSub.kind).toBe("Data");
      expect(afterSub.data).toBe(10);
    });

  });

  describe("substituteAsync()", () => {

    it("replaces the value with a resolved FP", async () => {
      const forbidden = new AccessForbidden("user");
      const afterSub = await forbidden.substituteAsync(async () => new DatabaseException("save"));
      expect(afterSub.kind).toBe("UnexpectedError");
    });

    it("wraps loose values with Data", async () => {
      const forbidden = new AccessForbidden("user");
      const afterSub = await forbidden.substituteAsync(async () => 10);
      expect(afterSub.kind).toBe("Data");
      expect(afterSub.data).toBe(10);
    });

  })

});
