import { inspect } from "util";
import semver from "semver";
import { AccessForbidden } from "../not-found/AccessForbidden";
import { Empty } from "../Empty";
import { isFP } from "./FP";
import { Literal } from "../Literal";
import { MissingPermission } from "../MissingPermission";
import { DatabaseException } from "../DatabaseException";

function expectFP<Kinds extends string, Needle extends Kinds>(kind: Kinds, search: Needle): asserts kind is Needle {
  expect(kind).toBe(search);
}

describe("FP", () => {

  describe("[Symbol.toStringTag]()", () => {

    it("returns 'kind' by default (Literal)", () => {
      const value = new Literal(10);
      expect(value[Symbol.toStringTag]).toBe("Literal<number>");
    });

    it("returns 'kind' by default (DatabaseException)", () => {
      const exception = new DatabaseException("save");
      expect(exception[Symbol.toStringTag]).toBe("UnexpectedError");
    });

    it("enables (default) util.inspect", () => {
      const value = new Literal(10);
      expect(inspect(value, { customInspect: false, depth: -1 })).toBe("[Literal [Literal<number>]]");
    });

    it("enables (default) util.inspect (DatabaseException)", () => {
      const exception = new DatabaseException("save");
      expect(inspect(exception, { customInspect: false, depth: -1 })).toBe("[DatabaseException [UnexpectedError]]");
    });

  });

  describe("util.inspect", () => {

    const HAS_INSPECT_PARAM = semver.satisfies(process.versions.node, ">= 16.14.0");

    it("produces short descriptions if depth < 0", () => {
      const value = new Literal(10);
      expect(inspect(value, { depth: -1 })).toBe("[Literal<number>]");
    });

    it("produces basic descriptions (Literal<number>)", () => {
      const value = new Literal(10);
      expect(inspect(value)).toBe("Literal<number> 10");
    });

    if(HAS_INSPECT_PARAM) {
      it("produces basic descriptions (Literal<string> - Node 16.14.0+)", () => {
        const value = new Literal("Hello");
        expect(inspect(value)).toBe("Literal<string> 'Hello'");
      });
    } else {
      it("produces basic descriptions (Literal<string> - Legacy <16.14.0)", () => {
        const value = new Literal("Hello");
        expect(inspect(value)).toBe('Literal<string> "Hello"');
      });
    }
  });

});

/**
 * FP does not implement many public methods, so there aren't unit tests to actually evaluate.
 *
 * Instead, the following section will check functionality that is mostly tested at compile time,
 * to ensure that the type signatures of FP (and core interfaces) provide proper type narrowing.
 *
 * == Explanation of test method
 *
 * Because it's impossible to include a negative test case in a file that needs to be compiled
 * by TypeScript, see the following example in a comment of a failing test:
 *
 * ```ts
 * const kind = "Data" as "Data" | "NoValue";
 * const t: "Data" = kind;
 * // => type error - kind could also be "NoValue"
 * ```
 */

describe("FP (typing)", () => {

  describe("alt", () => {

    it("replaces Empty", () => {
      const x = new Empty();
      const y = x.alt(() => new Literal(10));
      const z: Literal<number> = y;
      expect<"Literal">(y.kind).toBe("Literal");
      expect(y.data).toBe(10);
    });

    it("doesn't affect the type of data", () => {
      const x = new Literal(10);
      const y = x.alt(() => new Empty());
      const z: Literal<number> = y;
      expect<"Literal">(y.kind).toBe("Literal");
      expect(y.data).toBe(10);
    });

    it("doesn't affect the type of errors", () => {
      const x = new MissingPermission();
      const y = x.alt(() => new Empty());
      const z: MissingPermission<unknown> = y;
      expect<"MissingPermission">(y.kind).toBe("MissingPermission");
    });

    it("removes Empty from (Empty | Literal)", () => {
      const x = new Empty() as Literal<number> | Empty;
      const y = x.alt(() => 10);
      const z: Literal<number> = y;
      expect<"Literal">(y.kind).toBe("Literal");
      expect(y.data).toBe(10);
    });

    it("removes Empty from (Empty | Literal | Error)", () => {
      const x = new Literal(10) as Literal<number> | Empty<number> | MissingPermission<number>;
      const y = x.alt(() => 20);
      const z: Literal<number> | MissingPermission<number> = y;
      expectFP(z.kind, "Literal");
      expect(z.data).toBe(10);
    });

  });

  describe("altValue", () => {

    it("replaces Empty", () => {
      const x = new Empty();
      const y = x.altValue("Hello");
      const z: Literal<string> = y;
      expect<"Literal">(y.kind).toBe("Literal");
      expect(z.data).toBe("Hello");
    });

    it("doesn't affect the type of data", () => {
      const x = new Literal(10);
      const y = x.altValue("Hello");
      const z: Literal<number> = y;
      expect<"Literal">(y.kind).toBe("Literal");
      expect(z.data).toBe(10);
    });

    it("doesn't affect the type of errors", () => {
      const x = new MissingPermission();
      const y = x.altValue("Hello");
      const z: MissingPermission<unknown> = y;
      expect<"MissingPermission">(y.kind).toBe("MissingPermission");
    });

    it("removes Empty from (Empty | Literal)", () => {
      const x = new Empty<number>() as Empty<number> | Literal<number>;
      const y = x.altValue(15);
      const z: Literal<number> = y;
      expect<"Literal">(y.kind).toBe("Literal");
      expect(z.data).toBe(15);
    });

    it("removes Empty from (Empty | Literal | Error)", () => {
      const x = new MissingPermission() as MissingPermission<number> | Literal<number> | Empty<number>;
      const y = x.altValue(15);
      const z: Literal<number> | MissingPermission<number> = y;
      expectFP(z.kind, "MissingPermission");
    });

  });

  describe("map", () => {

    it("retains Empty", () => {
      const x = new Empty<number>();
      const y = x.map(i => {
        expect(i).toBe(-1); // fail - never should get to this case
        return 10;
      });
      const z: Empty<number> = y;
      expect<"Empty">(y.kind).toBe("Empty");
    });

    it("maps the type of Empty", () => {
      const x = new Empty<number>();
      const y = x.map(i => {
        expect(i).toBe(-1); // fail - never should get to this case
        return "hi";
      });
      const z: Empty<string> = y;
      expect<"Empty">(y.kind).toBe("Empty");
    });

    it("transforms data", () => {
      const x = new Literal(10);
      const y = x.map(i => {
        expect(i).toBe(10);
        return i + 5;
      });
      const z: Literal<number> = y;
      expect<"Literal">(y.kind).toBe("Literal");
      expect(z.data).toBe(15);
    });

    it("transforms correctly with Literal | Empty", () => {
      const x = new Literal(10) as Literal<number> | Empty<number>;
      const y = x.map(i => `Number ${i}`);
      const z: Literal<string> | Empty<string> = y;
      expect<"Literal" | "Empty">(y.kind).toBe("Literal");
      expectFP(z.kind, "Literal");
      expect(z.data).toBe("Number 10");
    });

  });

});

describe("isFP", () => {

  it("recognizes Literal", () => {
    expect(isFP(new Literal(10))).toBe(true);
  });

  it("recognizes AccessForbidden", () => {
    expect(isFP(new AccessForbidden("User"))).toBe(true);
  });

  it("rejects strings", () => {
    expect(isFP("hello")).toBe(false);
  });

});
