import { Data } from "./Data";
import type { NoData } from "./NoData";

export abstract class FP<T> {
  public abstract readonly status: number;
  public abstract readonly kind: string;
  public abstract readonly hasData: boolean;
  public abstract readonly noValue: boolean;

  /**
   * Utility to easily transform data based on type - especially useful for conditionally converting types.
   *
   * @example
   * function getData(): Data<number> | AccessForbidden<"Number"> {
   *   return new Data(10);
   * }
   * const x = getData();
   * const y = x.mapIf(AccessForbidden, () => new DatabaseException("find"));
   */
  public mapIf<K extends string, O>(
    kind: K | { kind: K },
    fn: (input: this) => O,
  ): (this extends { kind: K } ? (O extends { kind: string } ? O : Data<O>) : this) {
    const k = typeof kind === "string" ? kind : kind.kind;
    if(this.kind === k) {
      const mapped = fn(this);
      if(isFP(mapped)) {
        return mapped as (this extends { kind: K } ? (O extends { kind: string } ? O : Data<O>) : this);
      }
      return new Data(mapped) as (this extends { kind: K } ? (O extends { kind: string } ? O : Data<O>) : this);
    }
    return this as (this extends { kind: K } ? (O extends { kind: string } ? O : Data<O>) : this);
  }

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
