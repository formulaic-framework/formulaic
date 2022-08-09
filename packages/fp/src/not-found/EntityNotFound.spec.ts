import { EntityNotFound } from "./EntityNotFound";

describe("EntityNotFound", () => {

  const notFound = new EntityNotFound<number>("User", {
    where: {
      id: "admin",
    },
  });

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
