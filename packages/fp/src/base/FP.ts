import { Data } from "./Data";
import type { NoData } from "./NoData";

export abstract class FP<T> {
  public abstract readonly status: number;
  public abstract readonly kind: string;
  public abstract readonly hasData: boolean;
  public abstract readonly noValue: boolean;

  /**
   * Perform a data-transformation if data is available ({@link hasData}),
   * retaining the original data if data is not available.
   */
  public mapData<O>(fn: (input: T) => O): (this extends Data<T> ? (O extends { kind: string } ? O : Data<O>) : this) {
    return this as (this extends Data<T> ? (O extends { kind: string } ? O : Data<O>) : this);
  }

  /**
   * Replace any non-successful result with a default value.
   *
   * To only replace missing values (e.g. "value not found"), use {@link substitute()} instead.
   */
  public or<O = T>(value: O): (this extends Data<T> ? this : Data<O>) {
    return new Data(value) as (this extends Data<T> ? this : Data<O>);
  }

  /**
   * Provide a backup value that should be used if an operation specifically reported
   * that a value was missing.
   *
   * This does not change the value if an error was thrown - use {@link or()} instead to replace
   * any non-successful result.
   */
  public substitute(value: T): (this extends NoData<T> ? Data<T> : this) {
    return this as (this extends NoData<T> ? Data<T> : this);
  }

}

export function isFP<T>(value: any): value is FP<T> {
  return value
    && typeof value === "object"
    && (typeof value.kind === "string")
    && (typeof value.hasData === "boolean")
    && (typeof value.noValue === "boolean");
}
