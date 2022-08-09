import { AccessForbidden } from "./AccessForbidden";

describe("AccessForbidden", () => {

  const notFound = new AccessForbidden<number, number, "User">("User");

  describe("map()", () => {
    it("returns itself", () => {
      expect(notFound.map(i => i + 5)).toBe(notFound);
    });
  });

  describe("chain()", () => {
    it("returns itself", async () => {
      expect(await notFound.chain(async i => i + 5)).toBe(notFound);
    });
  });

});
