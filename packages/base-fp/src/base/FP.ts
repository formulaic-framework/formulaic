import type { Literal } from "../Literal";
import { KindSelection } from "./util";

const inspect = Symbol.for("nodejs.util.inspect.custom");

export type EnsureFP<O>
  = O extends FP<any, string, number, boolean, boolean, boolean>
    ? O
    : Literal<O>;
    // : FP<O, "Literal", 200 | 201, true, false, false>;

export type Alt<FPType, O, NoValue extends boolean> = NoValue extends true ? EnsureFP<O> : FPType;

export type Or<FPType, O, HasData extends boolean> = HasData extends false ? EnsureFP<O> : FPType;

export type ExtractFPType<O>
  = O extends FP<infer X, string, number, boolean, boolean, boolean>
    ? X
    : O;

export type Map<O, Kind extends string, Status extends number, HasData extends boolean, HasError extends boolean, NoValue extends boolean>
  = HasData extends true
    ? EnsureFP<O>
    : FP<ExtractFPType<O>, Kind, Status, HasData, HasError, NoValue>;

export type MapIf<
  Kind extends string,
  FPType extends FP<any, Kind, any, any, any, any>,
  Needle extends string,
  O,
> = Kind extends Needle
  ? EnsureFP<O>
  : FPType;

/**
 * A base class for data that allows for strong-typing, even in error cases, and is chainable for easy use.
 *
 * Additionally, instances can be ready to transmit over the network, using `class-transformer` to hide information
 * that shouldn't be revealed.
 */
export abstract class FP<
  T,
  Kind extends string,
  Status extends number,
  HasData extends boolean,
  HasError extends boolean,
  NoValue extends boolean,
> {

  /**
   * The primary discriminator to differentiate between classes that extend {@link FP}.
   *
   * Multiple classes may use the same `kind`, but they must have some other way to discriminate between them.
   */
  public abstract readonly kind: Kind;

  /**
   * Usually represents a general HTTP response code that would be accurate for this entity.
   *
   * May be used by interceptors/further formatters to format HTTP responses.
   */
  public abstract readonly status: Status;

  /**
   * Provides a general sense if a response has "successful" data.
   * Allows data chaining.
   */
  public abstract readonly hasData: HasData;

  /**
   * Provides a general sense if a response represents an error or some
   * other failing.
   *
   * Allows error chaining.
   */
  public abstract readonly hasError: HasError;

  /**
   * Used for specific cases where no error has occurred, yet data is not available.
   * Aims to prevent `null` hell.
   */
  public abstract readonly noValue: NoValue;

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
  public abstract alt<O>(fn: () => O): Alt<this, O, NoValue>;

  /**
   * Asynchronously provide a fallback that is used if this response represents a lack of a value.
   *
   * The fallback does not replace any error cases (unless both `hasError` and `noValue` are set).
   *
   * Resolved values that are not instances of {@link FP} will be wrapped in {@link Literal}.
   *
   * @param fn An async function that produces a fallback value
   */
  public abstract altThen<O>(value: () => Promise<O>): Promise<Alt<this, O, NoValue>>;

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
  public abstract altValue<O>(value: O): Alt<this, O, NoValue>;

  /**
   * Replace any non-"success data" (if `hasData == false`) value with the value returned from the provided function.
   *
   * If the function returns a value that is not an instance of {@link FP}, it will be wrapped in {@link Literal}.
   *
   * @param fn A function that produces a fallback value.
   */
  public abstract or<O>(fn: () => O): Or<this, O, HasData>;

  /**
   * Asynchronously replaces any non-"success data" (if `hasData == false`) value with the value resolved in the provided function.
   *
   * If the function resolves a value that is not an instance of {@link FP}, it will be wrapped in {@link Literal}.
   *
   * @param fn A function that resolves to a fallback value.
   */
  public abstract orThen<O>(fn: () => Promise<O>): Promise<Or<this, O, HasData>>;

  /**
   * Replaces any non-"success data" (if `hasData == false`) value with the value provided.
   *
   * If the value provided is not an instance of {@link FP}, it will be wrapped in {@link Literal}.
   *
   * @param value A fallback value.
   */
  public abstract orValue<O>(value: O): Or<this, O, HasData>;

  /**
   * Transform "success data" (if `hasData == true`), while leaving empty values or errors alone.
   *
   * If the value returned is not an instance of {@link FP}, it will be wrapped in {@link Literal}.
   *
   * @param fn A function that transforms the current value.
   */
  public abstract map<O>(fn: (data: T) => O): Map<O, Kind, Status, HasData, HasError, NoValue>;

  /**
   * Asynchronously transform "success data" (if `hasData == true`), while leaving empty values or errors alone.
   *
   * @param fn A function that transforms the current value.
   */
   public abstract chain<O>(fn: (data: T) => Promise<O>): Promise<Map<O, Kind, Status, HasData, HasError, NoValue>>;

  /**
   * Transforms data that match the `kind` specified, returning the output from the transformation function
   * instead of any entities that match the filter.
   *
   * Useful for changing specific error types and similar transformations.
   *
   * See {@link map} for a more efficient way to transform "success data", {@link or} to transform any non-"success data" response,
   * and {@link altValue} to transform any "empty" response.
   *
   * @param kind The kind(s) that should be transformed.
   * @param fn A function that is called with any objects that match the selected {@link kind}.
   *
   * @example
   * const data = new UnexpectedError() as Literal<number> | UnexpectedError<number> | Empty<number>;
   * const transformed = data.mapIf([UnexpectedError], (err) => new MissingPermission<number>());
   * // => Literal<number> | MissingPermission<number> | Empty<number>
   */
  public mapIf<K extends string, O>(kind: KindSelection<K>, fn: (data: this) => O): MapIf<Kind, this, K, O> {
    if(this.matchKind(kind)) {
      const mapped = fn(this);
      return this.ensureFP(mapped) as MapIf<Kind, this, K, O>;
    }
    return this as MapIf<Kind, this, K, O>;
  }

  protected matchKind<K extends string>(kind: KindSelection<K>): this is { kind: K } {
    if(Array.isArray(kind)) {
      return kind.some(spec => typeof spec === "string" ? (this.kind as string) === spec : (this.kind as string) === spec.kind);
    }
    return (this.kind as string) === (typeof kind === "string" ? kind : kind.kind);
  }

  protected abstract ensureFP<O>(value: O): EnsureFP<O>;

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

export function isFP<T>(value: any): value is FP<T, string, number, boolean, boolean, boolean> {
  return value
    && typeof value === "object"
    && (typeof value.kind === "string")
    && (typeof value.hasData === "boolean")
    && (typeof value.noValue === "boolean");
}
