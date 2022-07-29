import { AccessForbidden } from "../AccessForbidden";
import { Data } from "./Data";

describe("Data", () => {

  it("stores a value", () => {
    const data = new Data("Hello");
    expect(data.data).toBe("Hello");
  });

  describe("mapData()", () => {

    it("can do simple transformations", () => {
      const num = new Data(10);
      const transformed = num.mapData(n => n + 1);
      expect(transformed.data).toBe(11);
    });

    it("can unpack returned Data", () => {
      const num = new Data(10);
      const transformed = num.mapData(n => new Data(n + 1));
      expect(transformed.data).toBe(11);
    });

    it("will pass through errors", () => {
      const num = new Data(10);
      const convertedError = num.mapData(() => new AccessForbidden("User"));
      expect(convertedError.kind).toBe("NotFound");
    });

  });

  describe("or()", () => {

    it("returns the existing data", () => {
      const num = new Data(10);
      const afterOr = num.or(-1);
      expect(afterOr.data).toBe(10);
    });

  });

  describe("substitute()", () => {

    it("returns the existing data", () => {
      const num = new Data(10);
      const afterSub = num.substitute(-1);
      expect(afterSub.data).toBe(10);
    });

  });

  describe("substituteAsync()", () => {

    it("returns the existing data", async () => {
      const num = new Data(10);
      const afterSub = await num.substituteAsync(async () => -1);
      expect(afterSub.data).toBe(10);
    });

  })

});
