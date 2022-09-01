import { EnsureFP, isFP, Literal } from "@formulaic/base-fp";
import { useMemo, useState } from "react";
import { NeverFetched } from "./dto/NeverFetched";
import { SkippedRequest } from "./dto/SkippedRequest";
import { FetchFunction, LastData, LastResponse, LatestResponse } from "./util";
import { wrapFetch } from "./wrapFetch/wrapFetch";

export type UseRequestResponse<
  Args extends any[],
  Res,
> = {
  /**
   * A callback to trigger this request.
   */
  fetch: FetchFunction<Args, Res>;

  /**
   * Most users will prefer {@link last} over this property.
   *
   * The absolute latest request that returned.
   * May be {@link SkippedRequest} if the last request didn't meet validation.
   */
  latest: NeverFetched<Res> | LatestResponse<Res>;

  /**
   * The last response received for this request.
   * May represent a failure.
   *
   * If you wish to continue displaying the last successful response, see {@link lastData} instead.
   */
  last: NeverFetched<Res> | LastResponse<Res>;

  /**
   * The last successful response received for this request.
   */
  lastData: NeverFetched<Res> | LastData<Res>;
};

export interface UseRequestOptions {
};

/**
 * This hook wraps an API request so all responses can be handled using `fp`
 * methods.
 *
 * This hook does not immediately call the API provided, making it more suitable
 * for creation/save requests.
 * See {@link useQuery} for a similar hook that immediately calls the API method.
 */
export function useRequest<Args extends any[], Res>(
  fn: (...args: Args) => false | Promise<Res>,
  opts: UseRequestOptions = {},
): [FetchFunction<Args, Res>, UseRequestResponse<Args, Res>] {
  const [latest, setLatest] = useState<NeverFetched<Res> | LatestResponse<Res>>(new NeverFetched());
  const [last, setLast] = useState<NeverFetched<Res> | LastResponse<Res>>(new NeverFetched());
  const [lastData, setLastData] = useState<NeverFetched<Res> | LastData<Res>>(new NeverFetched());

  const fetch: FetchFunction<Args, Res> = async (...args: Args) => {
    const call = fn(...args);
    if(!call) {
      const skip = new SkippedRequest<Res>();
      setLatest(skip);
      return skip;
    }
    const res = await wrapFetch(() => call);
    if(isFP(res)) {
      setLatest(res);
      setLast(res);
      if(res.hasData) {
        setLastData(res);
      }
      return res;
    } else {
      const wrapped = new Literal(res as Res) as EnsureFP<Res>;
      setLatest(wrapped);
      setLast(wrapped);
      setLastData(wrapped);
      return wrapped;
    }
  };

  const res = useMemo<UseRequestResponse<Args, Res>>(() => ({
    fetch,
    latest,
    last,
    lastData,
  }), [ latest, last, lastData ]);

  return [fetch, res];
}
