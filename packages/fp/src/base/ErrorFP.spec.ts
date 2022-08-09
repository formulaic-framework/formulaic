import { Empty } from "../Empty";
import { BaseErrorFP, ErrorFP } from "./ErrorFP";
import { Alt } from "./util";

class TestBaseErrorFP<T> extends BaseErrorFP<T, ReferenceError, 500, false> {
  public alt<O>(fn: () => O): Alt<this, O> {
    throw new Error("Method not implemented.");
  }
  public altThen<O>(value: () => Promise<O>): Promise<Alt<this, O>> {
    throw new Error("Method not implemented.");
  }
  public altValue<O>(value: O): Alt<this, O> {
    throw new Error("Method not implemented.");
  }
  public kind: "TestBaseErrorFP";

  public constructor() {
    super(false, 500);
    this.kind = "TestBaseErrorFP";
  }
}

class TestErrorFP<T> extends ErrorFP<T, ReferenceError, number> {
  public kind: "TestErrorFP";

  public constructor() {
    super();
    this.kind = "TestErrorFP";
  }
}

describe("BaseErrorFP", () => {
  const err = new TestBaseErrorFP();

  describe("map", () => {
    it("returns itself", () => {
      expect(err.map(i => `hi ${i}`)).toBe(err);
    });
  });

  describe("chain", () => {
    it("resolves itself", async () => {
      expect(await err.chain(async i => `hi ${i}`)).toBe(err);
    });
  });
});

describe("ErrorFP", () => {

  const err = new TestErrorFP();

  describe("altThen", () => {
    it("resolves itself", async () => {
      expect(await err.altThen(async () => "Hi")).toBe(err);
    });
  });

  describe("or", () => {
    it("uses the provided value", () => {
      expect(err.or(() => "Hi")).toHaveProperty("data", "Hi");
    });

    it("relays 'FP' instances as-is", () => {
      const or = err.or(() => new Empty());
      expect<"Empty">(or.kind).toBe("Empty");
    });
  });

  describe("orThen", () => {
    it("resolves to the provided value", async () => {
      expect(await err.orThen(() => Promise.resolve("Hi"))).toHaveProperty("data", "Hi");
    });
  });

  describe("map", () => {
    it("returns itself", () => {
      expect(err.map(i => `hi ${i}`)).toBe(err);
    });
  });

  describe("chain", () => {
    it("resolves itself", async () => {
      expect(await err.chain(async i => `hi ${i}`)).toBe(err);
    });
  });

});
