import { renderHook } from "@testing-library/react-hooks";
import { afterEach, beforeEach, describe, expect, it, Mock, test, vi } from "vitest";
import { useQuery, UseQueryOptions } from "./useQuery";

function _useQuery<Args extends any[], Res>(
  fn: (...args: Args) => false | Promise<Res>,
  args: Args,
  opts: UseQueryOptions<Args> = {},
) {
  const rendered = renderHook(() => useQuery(fn, args, opts));
  const returnValue = rendered.result.current;
  return returnValue;
}

describe("useQuery", () => {


  describe("timing examples", () => {

    let mock: Mock<any[], any>;
    let apiMockCall: (counter?: number | false) => false | Promise<number>;

    beforeEach(() => {
      vi.useFakeTimers();
      mock = vi.fn();
      apiMockCall = (counter?: number | false) => {
        if(counter === false) {
          return false;
        }
        mock(counter);
        return Promise.resolve(counter ?? 0);
      };
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    /**
     * debounce = 1s
     * waitTime = 0
     * maxDelay = 3s
     *
     * 0         1         2         3
     * +---------+---------+---------+
     * T----------
     */
    describe("single request (d=1s, w=0, max=3s)", () => {

      it("makes a request (at some point)", () => {
        const [last, refresh, data] = _useQuery(apiMockCall, [1], {
          debounce: 1000,
          waitTime: 0,
          maxDelay: 3000,
        });
        vi.advanceTimersByTime(5000);
        expect(mock).toHaveBeenCalledOnce();
      });

      it("executes the first request immediately", () => {
        const [last, refresh, data] = _useQuery(apiMockCall, [1], {
          debounce: 1000,
        });
        expect(mock).toHaveBeenCalledOnce();
        expect(mock).toHaveBeenCalledWith(1);
      });

    });

    /**
     * debounce = 1s
     * waitTime = 0
     * maxDelay = 3s
     *
     * 0         1         2         3
     * +---------+---------+---------+
     * T----------
     *                     T----------
     */
    describe("individual requests (d=1s, w=0, max=3s)", () => {

      it("sends both requests", () => {
        const [last, refresh, data] = _useQuery(apiMockCall, [1], {
          debounce: 1000,
          waitTime: 0,
          maxDelay: 3000,
        });
        vi.advanceTimersByTime(2000);
        refresh();
        vi.advanceTimersByTime(3000);
        expect(mock).toHaveBeenCalledTimes(2);
      });

      it("sends second request immediately", () => {
        const [last, refresh, data] = _useQuery(apiMockCall, [1], {
          debounce: 1000,
          waitTime: 0,
          maxDelay: 3000,
        });
        vi.advanceTimersByTime(2000);
        expect(mock).toBeCalledTimes(1);
        refresh();
        expect(mock).toHaveBeenCalledTimes(2);
      });

    });

    /**
     * debounce = 1s
     * waitTime = 0
     * maxDelay = 3s
     *
     * 0         1         2         3
     * +---------+---------+---------+
     * T----------
     *       T===R------
     */
    describe("refreshed during debounce period", () => {

      it("sends both requests", () => {
        const [last, refresh, data] = _useQuery(apiMockCall, [1], {
          debounce: 1000,
          waitTime: 0,
          maxDelay: 3000,
        });
        // @0s
        vi.advanceTimersByTime(200);
        // @0.2s
        refresh();
        vi.advanceTimersByTime(5000);
        // @5.2s
        expect(mock).toBeCalledTimes(2);
      });

    });

    /**
     * debounce = 1s
     * waitTime = 0
     * maxDelay = 3s
     *
     * 0         1         2         3
     * +---------+---------+---------+
     * T----------
     *    T======X---
     *       T======X---
     *          T======X---
     *             T======X---
     */
    describe("multiple debounce requests", () => {

      it("only sends 2 total requests", () => {
        const [last, refresh, data] = _useQuery(apiMockCall, [1], {
          debounce: 1000,
          waitTime: 0,
          maxDelay: 3000,
        });
        // @0s
        vi.advanceTimersByTime(200);
        // @0.2s
        refresh();
        vi.advanceTimersByTime(200);
        // @0.4s
        refresh();
        vi.advanceTimersByTime(200);
        // @0.6s
        refresh();
        vi.advanceTimersByTime(200);
        // @0.8s
        refresh();
        vi.advanceTimersByTime(200);
        // @1s
        refresh();
        vi.advanceTimersByTime(200);
        // @1.2s
        refresh();
        vi.advanceTimersByTime(5000);
        // @6.2s
        expect(mock).toBeCalledTimes(2);
      });

    });


  });

});
