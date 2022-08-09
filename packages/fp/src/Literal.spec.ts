import { inspect } from "util";
import { Literal } from "./Literal";

describe("Literal", () => {

  const ten = new Literal(10);

  describe("status", () => {

    it("defaults to '200'", () => {
      expect(ten.status).toBe(200);
    });

    it("is '201' if created = true", () => {
      const created = new Literal(10, true);
      expect(created.status).toBe(201);
    });

  });

  describe("getData()", () => {

    it("retrieves the value", () => {
      expect(ten.getData()).toBe(10);
    });

  });

  describe("chain", () => {

    it("performs async transformations", async () => {
      const updated = await ten.chain(async i => i + 5);
      expect(updated.getData()).toBe(15);
    });

  });

  describe("util.inspect", () => {

    it("can describe 'undefined'", () => {
      const value = new Literal(undefined);
      expect(inspect(value)).toBe("Literal<undefined> undefined");
    });

  });

});
