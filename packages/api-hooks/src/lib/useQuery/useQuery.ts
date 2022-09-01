import { EnsureFP } from "@formulaic/base-fp";
import { useEffect, useMemo, useRef, useState } from "react";
import { FailedRequest } from "../dto/FailedRequest";
import { NeverFetched } from "../dto/NeverFetched";
import { QueryConfigurationOptions, useQueryConfiguration } from "../QueryConfiguration";
import { wrapFetch } from "../wrapFetch/wrapFetch";
import { QueryContext } from "./QueryContext";
import { UseQueryData, UseQueryLastResponse, UseQueryResult } from "./UseQueryResult";

export interface UseQueryOptions<Args extends any[]> extends Partial<QueryConfigurationOptions> {

  /**
   * To prevent sending duplicate requests, React's memoization is applied to all
   * arguments.
   *
   * You may provide an additional equality check that can be applied in addition to React's memoization -
   * this can be used to further memoize requests, including values changed and reverted during the {@link debounce} period.
   *
   * Like React's memoization, Formulaic does not guarantee that requests will not be sent in all cases,
   * however providing an equality comparison can improve performance.
   */
  equality?: (a: Args, b: Args) => boolean;

  /**
   * By default, requests can be canceled at time of execution by returning `false` instead of a pending {@link Promise}.
   *
   * Additionally, you may provide a {@link validate} function that filters when requests are first queued -
   * this prevents invalid requests from even entering the debounce/wait periods.
   */
  validate?: (...args: Args) => boolean;

}

/**
 * Make API requests, powered by Formulaic's {@link FP}.
 * Requests can be filtered for validity, debounced, and more.
 *
 * This hook is intended for requests that can be re-run at will, such as fetching data.
 * Use {@link useRequest} for a similar hook, that can be carefully controlled if making a request to create, update, or delete data.
 *
 * @param fn The function that makes an API request.  Return `false` if the input variables are invalid.  Output wrapped with {@link wrapFetch}
 * @param args A list of arguments given to {@link fn}.  Updating the values will cause the API to reload data.
 * @param opts Additional options to configure querying.  Defaults can be set via context, see {@link QueryConfiguration}.
 */
export function useQuery<Args extends any[], Res>(
  fn: (...args: Args) => false | Promise<Res>,
  args: Args,
  opts: UseQueryOptions<Args> = {},
): UseQueryResult<Res> {
  const defaults = useQueryConfiguration();
  const debounce = opts.debounce ?? defaults.debounce;
  const maxDelay = opts.maxDelay ?? defaults.maxDelay;
  const waitTime = opts.waitTime ?? defaults.waitTime;

  const nextReq = useRef(0);

  const dirtyUntil = useRef(0);

  const [pending, setPending] = useState<number[]>([]);

  const addPending = (ctx: QueryContext<Args>) => {
    if(pending.includes(ctx.index)) {
      return;
    }
    setPending([...pending, ctx.index]);
  };

  const removePending = (ctx: QueryContext<Args>) => {
    if(!pending.includes(ctx.index)) {
      return;
    }
    setPending(pending.filter(i => i !== ctx.index));
  };

  // The absolute latest response
  const [lastRes, setLastRes] = useState<{
    ctx?: QueryContext<Args>,
    res: UseQueryLastResponse<Res>,
  }>(() => ({ res: new NeverFetched<Res>() }));

  /**
   * The final stage of an individual query, where the response is evaluated,
   * and properties updated as needed.
   */
  const handleResponse = (
    ctx: QueryContext<Args>,
    res: EnsureFP<Res> | FailedRequest<Res, any, number>,
  ) => {
    if(!lastRes.ctx) {
      setLastRes({ ctx, res });
    } else if(lastRes.ctx.before(ctx)) {
      setLastRes({ ctx, res });
    }
    removePending(ctx);
  };

  /**
   * A late stage of an individual query which performs final checks
   * to filter queries, and makes the request.
   */
  const executeQuery = async (ctx: QueryContext<Args>) => {
    if(ctx.index !== (nextReq.current - 1)) {
      return;
    }
    const req = fn(...ctx.args);
    if(req === false) {
      removePending(ctx);
      return;
    }
    const res = await wrapFetch(() => req);
    handleResponse(ctx, res);
  };

  /**
   * An early stage of an individual query which schedules queries
   * to be executed in the future.
   */
  const queueQuery = (ctx: QueryContext<Args>) => {
    if(debounce === 0 && waitTime === 0) {
      executeQuery(ctx);
      return;
    }

    if(dirtyUntil.current < Date.now()) {
      dirtyUntil.current = Date.now() + waitTime + debounce;
      if(waitTime === 0) {
        executeQuery(ctx);
      } else {
        setTimeout(() => executeQuery(ctx), waitTime);
      }
      return;
    }

    const waitTillClean = dirtyUntil.current - Date.now();
    const queueAfter = Math.max(waitTillClean, waitTime);

    dirtyUntil.current = Date.now() + queueAfter + debounce;
    setTimeout(() => executeQuery(ctx), queueAfter);
  };

  /**
   * The first common stage of queries, which collects various ways
   * queries can be triggered, and ensures that they are useful to send.
   */
  const filterQuery = (ctx: QueryContext<Args>) => {
    if(opts.validate && opts.validate(...ctx.args) === false) {
      return;
    }
    addPending(ctx);
    queueQuery(ctx);
  };

  /**
   * A generic callback that computes the initial {@link QueryContext}
   * for a request, to be handed to the unified {@link filterQuery} function
   * to start the first stage.
   *
   * While {@link handleResponse}, {@link executeQuery}, {@link queueQuery},
   * and {@link filterQuery} are intended to be common stages used by every
   * query, you should feel free to build alternatives to {@link triggerQuery}
   * to prepare new requests - just call {@link filterQuery}
   * to start the shared functionality.
   */
  const triggerQuery = () => {
    const index = nextReq.current;
    nextReq.current = nextReq.current + 1;
    const ctx = new QueryContext<Args>(index, args);
    filterQuery(ctx);
  };

  useEffect(() => triggerQuery(), [...args]);

  const data = useMemo<UseQueryData>(() => ({
    pending: false,
  }), []);

  return [lastRes?.res, triggerQuery, data];
}
