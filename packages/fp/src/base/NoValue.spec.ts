import { UnexpectedError } from "../UnexpectedError";
import { NoValue } from "./NoValue";

class NoValueImpl<T> extends NoValue<T, "NoValueImpl", 404> {
  public override readonly kind: "NoValueImpl";
  public override readonly status: 404;

  public constructor() {
    super();
    this.kind = "NoValueImpl";
    this.status = 404;
  }
}

describe("NoValue", () => {

  const no = new NoValueImpl<number>();

  describe("alt", () => {
    it("uses the provided value", () => {
      const alt = no.alt(() => 5);
      expect(alt.kind).toBe("Literal");
      expect(alt.data).toBe(5);
    });

    it("relays FP values", () => {
      const alt = no.alt(() => new UnexpectedError());
      expect(alt.kind).toBe("UnexpectedError");
    });
  });

  describe("altThen", () => {
    it("uses the resolved value", async () => {
      const alt = await no.altThen(async () => 5);
      expect(alt.kind).toBe("Literal");
      expect(alt.data).toBe(5);
    });
  });

  describe("altValue", () => {
    it("uses the provided value", () => {
      const alt = no.altValue(5);
      expect(alt.kind).toBe("Literal");
      expect(alt.data).toBe(5);
    });
  });

  describe("or", () => {
    it("uses the provided value", () => {
      const or = no.or(() => 5);
      expect(or.kind).toBe("Literal");
      expect(or.data).toBe(5);
    });
  });

  describe("orThen", () => {
    it("uses the resolved value", async () => {
      const or = await no.orThen(async () => 5);
      expect(or.kind).toBe("Literal");
      expect(or.data).toBe(5);
    });
  });

  describe("map", () => {
    it("returns itself", () => {
      const map = no.map(i => i + 5);
      expect(map).toBe(no);
    });
  });

  describe("chain", () => {
    it("resolves itself", async () => {
      const chain = await no.chain(async i => i + 5);
      expect(chain).toBe(no);
    });
  });

});
