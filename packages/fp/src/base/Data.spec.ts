import { Literal } from "../Literal";
import { DataFP } from "./DataFP";
import { LoginResponse } from "./DataFP.spec";

describe("Data", () => {

  describe.each([
    ["Literal", new Literal(10)],
    ["DataFP (LoginResponse)", new LoginResponse("admin", "[jwt contents]")],
  ])("DataFP instance: %s", (name, fp) => {
    const altValue = "alt";

    describe("alt", () => {
      const alt = fp.alt(() => altValue);

      it("returns the FP instance", () => {
        expect(alt).toBe(fp);
      });

      it("does not return the alternative value", () => {
        expect(alt).not.toBe(altValue);
      });
    });

    describe("altThen", () => {
      it("returns the FP instance", async () => {
        const altThen = await fp.altThen(() => Promise.resolve(altValue));
        expect(altThen).toBe(fp);
      });
    });

    describe("altValue", () => {
      const alt = fp.altValue(altValue);
      it("returns the FP instance", () => {
        expect(alt).toBe(fp);
      });
    });

    describe("or", () => {
      it("returns the FP instance", () => {
        expect(fp.or(() => altValue)).toBe(fp);
      });
    });

    describe("orThen", () => {
      it("returns the FP instance", async () => {
        expect(await fp.orThen(() => Promise.resolve(altValue))).toBe(fp);
      });
    });

    describe("orValue", () => {
      it("returns the FP instance", async () => {
        expect(fp.orValue(altValue)).toBe(fp);
      });
    });
  });

  describe("getData()", () => {

    it("is implemented for both Literal and DataFP", () => {

      class ExampleData extends DataFP {
        public override readonly kind: "ExampleData";
        public override readonly status: 200;

        public constructor() {
          super();
          this.kind = "ExampleData";
          this.status = 200;
        }
      }

      const literal = new Literal(10);
      const dataFP = new ExampleData();

      expect(literal.getData()).toBe(10);
      expect(dataFP.getData().status).toBe(200);
    });

  })

})
