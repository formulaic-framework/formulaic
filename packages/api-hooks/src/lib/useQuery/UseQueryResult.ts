import { EnsureFP } from "@formulaic/base-fp";
import { FailedRequest } from "../dto/FailedRequest";
import { NeverFetched } from "../dto/NeverFetched";

export type UseQueryLastResponse<Res>
  = NeverFetched<Res>
  | EnsureFP<Res>
  | FailedRequest<Res, any, number>;

export type UseQueryRefreshFunction = () => void;

export interface UseQueryData {

  /**
   * Determines if any requests may be either in a queue/debounce phase or in-flight.
   *
   * {@link pending} may be set to `true` more often then expected, including cases
   * where a request is currently debouncing, but will later be canceled if the input is invalid.
   */
  pending: boolean;

}

export type UseQueryResult<Res> = [
  UseQueryLastResponse<Res>,
  UseQueryRefreshFunction,
  UseQueryData,
];
