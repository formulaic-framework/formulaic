import { MissingPermission } from "./MissingPermission"

describe("MissingPermission", () => {

  const err = new MissingPermission<number>();

  describe("map", () => {
    it("returns itself", () => {
      const map = err.map(i => i + 1);
      expect(map).toBe(err);
    });
  });

  describe("chain", () => {
    it("resolves itself", async () => {
      const chain = await err.chain(async i => i + 1);
      expect(chain).toBe(err);
    });
  });

});
