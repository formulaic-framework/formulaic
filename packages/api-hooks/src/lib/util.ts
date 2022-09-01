import { EnsureFP } from "@formulaic/base-fp";
import { FailedRequest } from "./dto/FailedRequest";
import { Pending } from "./dto/Pending";
import { SkippedRequest } from "./dto/SkippedRequest";

export type FetchFunctionResponse<Res>
  = SkippedRequest<Res>
  | EnsureFP<Res>
  | FailedRequest<Res, any, number>
  | undefined;

export type FetchFunction<
  Args extends any[],
  Res,
> = (...args: Args) => Promise<FetchFunctionResponse<Res>>;

export type LastResponse<Res>
  = Pending<Res>
  | EnsureFP<Res>
  | FailedRequest<Res, any, number>;

export type LastData<Res>
  = Pending<Res>
  | EnsureFP<Res>;

export type LatestResponse<Res>
  = SkippedRequest<Res>
  | Pending<Res>
  | EnsureFP<Res>
  | FailedRequest<Res, any, number>;
