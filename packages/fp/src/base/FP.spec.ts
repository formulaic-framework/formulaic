import { AccessForbidden } from "../AccessForbidden";
import { DatabaseException } from "../DatabaseException";
import { Data } from "./Data";
import { isFP } from "./FP";

describe("FP", () => {

  describe("mapIf()", () => {

    it("maps data", () => {
      const x = new Data(10);
      const y = x.mapIf("Data", d => d.data + 1);
      expect(y.data).toBe(11);
    });

    it("can be given FP class constructors (that have a 'kind')", () => {
      const x = new Data(10);
      const y = x.mapIf(Data, d => d.data + 1);
      expect(y.data).toBe(11);
    });

    it("can be given AccessForbidden constructor", () => {
      const x = new AccessForbidden("User");
      const y = x.mapIf(AccessForbidden, () => new DatabaseException("find"));
      expect(y.kind).toBe("UnexpectedError");
    });

    it("converts types", () => {
      const x = new Data(10);
      const y = x.mapIf("Data", () => new AccessForbidden("Number"));
      expect(y.kind).toBe("NotFound");
    });

    it("correctly handles multiple types", () => {
      const x = new Data(10) as Data<number> | AccessForbidden<unknown, "Number">;
      const y = x.mapIf("Data", () => new DatabaseException("find"));
      expect(y.kind).toBe("UnexpectedError");
    });

    it("handles non-matching cases", () => {
      const x = new Data(10);
      const y = x.mapIf("Foo", () => new DatabaseException("find"));
      expect(y.kind).toBe("Data");
    });

  });

  describe("mapUnless()", () => {

    it("maps if type doesn't match", () => {
      const x = new Data(10);
      const y = x.mapUnless(AccessForbidden, x => x.data + 1);
      expect(y.data).toBe(11);
    });

    it("can filter types", () => {
      const x = new Data(10) as Data<number> | AccessForbidden<number, "Number">;
      const y = x.mapUnless(Data, () => new DatabaseException("find"));
      expect(y.kind).toBe("Data");
    });

    it("can filter multiple", () => {
      const x = new Data(10) as Data<number> | AccessForbidden<number, "Number"> | DatabaseException<number, "find">;
      const y = x.mapUnless(["Data", "DatabaseException"], () => new Data("Hi"));
      expect(y.data).toBe(10);
    });

  });

});

describe("isFP", () => {

  it("recognizes Data", () => {
    expect(isFP(new Data(10))).toBe(true);
  });

  it("recognizes AccessForbidden", () => {
    expect(isFP(new AccessForbidden("User"))).toBe(true);
  });

  it("rejects strings", () => {
    expect(isFP("hello")).toBe(false);
  });

});
