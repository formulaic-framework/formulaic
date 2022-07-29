import { Data } from "./Data";
import type { NoData } from "./NoData";

export type EnsureData<O> = O extends { kind: string } ? O : Data<O>;

export type MapFPIf<ThisType extends FP<any>, K extends string, O> = ThisType extends { kind: K } ? EnsureData<O> : ThisType;

export type MapFPUnless<ThisType extends FP<any>, K extends string, O> = ThisType extends { kind: K } ? ThisType : EnsureData<O>;

export type MapFPData<T, ThisType extends FP<T>, O> = ThisType extends Data<T> ? EnsureData<O> : ThisType;

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
  ): MapFPIf<this, K, O> {
    const k = typeof kind === "string" ? kind : kind.kind;
    if(this.kind === k) {
      const mapped = fn(this);
      if(isFP(mapped)) {
        return mapped as MapFPIf<this, K, O>;
      }
      return new Data(mapped) as MapFPIf<this, K, O>;
    }
    return this as MapFPIf<this, K, O>;
  }

  public mapUnless<K extends string, O>(
    kind: K | { kind: K } | K[],
    fn: (input: this) => O,
  ): MapFPUnless<this, K, O> {
    const k = typeof kind === "string"
      ? [kind]
      : Array.isArray(kind)
        ? kind
        : [kind.kind];
    if(k.includes(this.kind as K)) {
      return this as MapFPUnless<this, K, O>;
    }
    const mapped = fn(this);
    if(isFP(mapped)) {
      return mapped as MapFPUnless<this, K, O>;
    }
    return new Data(mapped) as MapFPUnless<this, K, O>;
  }

  /**
   * Perform a data-transformation if data is available ({@link hasData}),
   * retaining the original data if data is not available.
   */
  public mapData<O>(fn: (input: T) => O): MapFPData<T, this, O> {
    return this as MapFPData<T, this, O>;
  }

  /**
   * Promise-version of {@link mapData}
   */
  public mapDataAsync<O>(fn: (input: T) => Promise<O>): Promise<MapFPData<T, this, O>> {
    return Promise.resolve(this) as Promise<MapFPData<T, this, O>>;
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

  /**
   * Provide an asynchronous way of obtaining a backup value that should be used if an operation
   * specifically reported that a value was missing.
   *
   * This does not change the result if an error was thrown - use {@link or()} instead to replace
   * any non-successful result.
   */
  public substituteAsync<O>(fn: () => Promise<O>): Promise<this extends NoData<T> ? EnsureData<O> : this> {
    return Promise.resolve(this) as Promise<this extends NoData<T> ? EnsureData<O> : this>;
  }

}

export function isFP<T>(value: any): value is FP<T> {
  return value
    && typeof value === "object"
    && (typeof value.kind === "string")
    && (typeof value.hasData === "boolean")
    && (typeof value.noValue === "boolean");
}
