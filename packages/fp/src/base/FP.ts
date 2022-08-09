import { Data } from "./Data";
import type { Alt, FPFields, MapFP, Or } from "./util";

const inspect = Symbol.for("nodejs.util.inspect.custom");

export type EnsureData<O> = O extends { kind: string } ? O : Data<O>;

export type MapFPIf<ThisType extends FP<any>, K extends string, O> = ThisType extends { kind: K } ? EnsureData<O> : ThisType;

export type MapFPUnless<ThisType extends FP<any>, K extends string, O> = ThisType extends { kind: K } ? ThisType : EnsureData<O>;

export type MapFPData<T, ThisType extends FP<T>, O> = ThisType extends Data<T> ? EnsureData<O> : ThisType;

/**
 * A base class for data that allows for strong-typing, even in error cases, and is chainable for easy use.
 *
 * Additionally, instances can be ready to transmit over the network, using `class-transformer` to hide information
 * that shouldn't be revealed.
 */
export abstract class FP<T> {

  /**
   * The primary discriminator to differentiate between classes that extend {@link FP}.
   *
   * Multiple classes may use the same `kind`, but they must have some other way to discriminate between them.
   */
  public abstract readonly kind: string;

  /**
   * Usually represents a general HTTP response code that would be accurate for this entity.
   *
   * May be used by interceptors/further formatters to format HTTP responses.
   */
  public abstract readonly status: number;

  /**
   * Provides a general sense if a response has "successful" data.
   * Allows data chaining.
   */
  public abstract readonly hasData: boolean;

  /**
   * Provides a general sense if a response represents an error or some
   * other failing.
   *
   * Allows error chaining.
   */
  public abstract readonly hasError: boolean;

  /**
   * Used for specific cases where no error has occurred, yet data is not available.
   * Aims to prevent `null` hell.
   */
  public abstract readonly noValue: boolean;

  /**
   * Provide a fallback that is used if this response represents a lack of a value.
   *
   * The fallback does not replace any error cases (unless both `hasError` and `noValue` are set).
   *
   * Returned values that are not instances of {@link FP} will be wrapped in {@link Literal}.
   *
   * @param fn A function that produces a fallback value
   *
   * @example
   * function sampleFunction(): Literal<number> | NoValue<number> | ErrorFP<number> {
   *   return new Literal(10);
   * }
   * const found = sampleFunction();
   * const afterFallback = found.alt(() => new Literal(15));
   * // => Literal<number> | ErrorFP<number>
   */
  public abstract alt<O>(fn: () => O): Alt<this, O>;

  /**
   * Asynchronously provide a fallback that is used if this response represents a lack of a value.
   *
   * The fallback does not replace any error cases (unless both `hasError` and `noValue` are set).
   *
   * Resolved values that are not instances of {@link FP} will be wrapped in {@link Literal}.
   *
   * @param fn An async function that produces a fallback value
   */
  public abstract altThen<O>(value: () => Promise<O>): Promise<Alt<this, O>>;

  /**
   * Provide a fallback value that is used if this response represents a lack of a value.
   *
   * The fallback does not replace any error cases (unless both `hasError` and `noValue` are set).
   *
   * Fallback values that are not instances of {@link FP} will be wrapped in {@link Literal}.
   *
   * @param value A fallback value.
   *
   * @example
   * function sampleFunction(): Literal<number> | NoValue<number> | ErrorFP<number> {
   *   return new Literal(10);
   * }
   * const found = sampleFunction();
   * const afterFallback = found.alt(new Literal(15));
   * // => Literal<number> | ErrorFP<number>
   */
  public abstract altValue<O>(value: O): Alt<this, O>;

  /**
   * Replace any non-"success data" (if `hasData == false`) value with the value returned from the provided function.
   *
   * If the function returns a value that is not an instance of {@link FP}, it will be wrapped in {@link Literal}.
   *
   * @param fn A function that produces a fallback value.
   */
  public abstract or<O>(fn: () => O): Or<this, O>;

  /**
   * Asynchronously replaces any non-"success data" (if `hasData == false`) value with the value resolved in the provided function.
   *
   * If the function resolves a value that is not an instance of {@link FP}, it will be wrapped in {@link Literal}.
   *
   * @param fn A function that resolves to a fallback value.
   */
  public abstract orThen<O>(fn: () => Promise<O>): Promise<Or<this, O>>;

  /**
   * Replaces any non-"success data" (if `hasData == false`) value with the value provided.
   *
   * If the value provided is not an instance of {@link FP}, it will be wrapped in {@link Literal}.
   *
   * @param value A fallback value.
   */
  public abstract orValue<O>(value: O): Or<this, O>;

  /**
   * Transform "success data" (if `hasData == true`), while leaving empty values or errors alone.
   *
   * If the value returned is not an instance of {@link FP}, it will be wrapped in {@link Literal}.
   *
   * @param fn A function that transforms the current value.
   */
  public abstract map<O>(fn: (data: T) => O): MapFP<this, O, FPFields<this>>;

  /**
   * Asynchronously transform "success data" (if `hasData == true`), while leaving empty values or errors alone.
   *
   * @param fn A function that transforms the current value.
   */
  public abstract chain<O>(fn: (data: T) => Promise<O>): Promise<MapFP<this, O, FPFields<this>>>;

  public get [Symbol.toStringTag](): string {
    return this.kind;
  }

  public [inspect](depth: number | null, options, inspect) {
    if(depth < 0) {
      return options.stylize(`[${this.inspectTag(depth, options, inspect)}]`, 'special');
    }

    return `${this.inspectTag(depth, options, inspect)} ${this.inspectValue(depth, options, inspect)}`;
  }

  /* istanbul ignore next */
  protected inspectTag(depth: number | null, options, inspect): string {
    return this[Symbol.toStringTag];
  }

  /* istanbul ignore next */
  protected inspectValue(depth: number | null, options, inspect): string {
    return "";
  }

}

export function isFP<T>(value: any): value is FP<T> {
  return value
    && typeof value === "object"
    && (typeof value.kind === "string")
    && (typeof value.hasData === "boolean")
    && (typeof value.noValue === "boolean");
}
