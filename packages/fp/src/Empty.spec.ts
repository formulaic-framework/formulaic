import { Empty } from "./Empty";

describe("Empty", () => {

  const emptyNum: Empty<number> = new Empty();

  describe("chain", () => {

    it("resolves itself", async () => {
      const chained = await emptyNum.chain(async i => i + 5);
      expect(chained).toBe(emptyNum);
    });

  });

});
