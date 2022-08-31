//import "@testing-library/jest-dom";
import { renderHook } from "@testing-library/react-hooks";
import { afterEach, beforeEach, describe, expect, it, vi, Mock } from "vitest";
import { PetStoreClient } from "../helpers/generated";
import { useRequest, UseRequestResponse } from "./useRequest";
import { FetchFunction } from "./util";

describe("useRequest", () => {

  let fakeApiMethod: Mock<any[], any>;
  let fakeCallFn: FetchFunction<[string], { data: string }>;
  let fakeCallInfo: UseRequestResponse<[string], { data: string }>;

  let store: PetStoreClient;

  beforeEach(() => {
    fakeApiMethod = vi.fn();
    const fakeApiHook = renderHook(() => useRequest((i: string) => {
      if(i === "skip") {
        return false;
      }
      fakeApiMethod(i);
      return Promise.resolve({ data: i });
    }));
    const fakeHookResponse = fakeApiHook.result.current;
    fakeCallFn = fakeHookResponse[0];
    fakeCallInfo = fakeHookResponse[1];

    store = new PetStoreClient();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not immediately call the function", () => {
    expect(fakeApiMethod).not.toBeCalled();
  });

  it("calls the function when requested (direct)", () => {
    fakeCallFn("hi");
    expect(fakeApiMethod).toHaveBeenCalledOnce();
  });

  it("calls the function when requested (via object)", () => {
    fakeCallInfo.fetch("hi");
    expect(fakeApiMethod).toHaveBeenCalledOnce();
  });

  it("can skip invalid inputs", () => {
    fakeCallFn("skip");
    expect(fakeApiMethod).not.toBeCalled();
  });

  describe("fetch function", () => {

    it("resolves the response", async () => {
      const res = await fakeCallFn("hi");
      expect(res?.kind).toBe("Literal");
    });

    it("resolves if skipped", async () => {
      const res = await fakeCallFn("skip");
      expect(res?.kind).toBe("SkippedRequest");
    });

  });

});
