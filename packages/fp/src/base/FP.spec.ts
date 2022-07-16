import { AccessForbidden } from "../AccessForbidden";
import { Data } from "./Data"
import { isFP } from "./FP"

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
