import { FP, isFP } from "./FP";
import { Literal } from "../Literal";
import { Alt, EnsureFP, Or } from "./util";

/**
 * One of the {@link FP} core interfaces that represents "successful" data.
 *
 * Users are unlikely to find this class as useful directly as alternatives:
 * - if you are returning arbitrary data and don't want to create a FP class, use {@link Literal}.
 * - if you are creating your own FP classes, you likely want to extend {@link DataFP}.
 */
export abstract class Data<T> extends FP<T> {
  public override readonly hasData: true;
  public override readonly hasError: false;
  public override readonly noValue: false;

  public constructor() {
    super();
    this.hasData = true;
    this.hasError = false;
    this.noValue = false;
  }

  public override alt<O>(fn: () => O): Alt<this, O> & this {
    return this as this as (Alt<this, O> & this);
  }

  public override async altThen<O>(fn: () => Promise<O>): Promise<Alt<this, O> & this> {
    return this as this as (Alt<this, O> & this);
  }

  public override altValue<O>(value: O): Alt<this, O> & this {
    return this as this as (Alt<this, O> & this);
  }

  public override or<O>(fn: () => O): Or<this, O> & this {
    return this as this as (Or<this, O> & this);
  }

  public override async orThen<O>(fn: () => Promise<O>): Promise<Or<this, O> & this> {
    return this as this as (Or<this, O> & this);
  }

  public override orValue<O>(value: O): Or<this, O> & this {
    return this as this as (Or<this, O> & this);
  }

  protected processMap<I,O>(input: I, fn: (data: I) => O): EnsureFP<O> {
    const mapped = fn(input);
    return this.ensureFP(mapped);
  }

  protected async processThen<I, O>(input: I, fn: (data: I) => Promise<O>): Promise<EnsureFP<O>> {
    const resolved = await fn(input);
    return this.ensureFP(resolved);
  }

  protected ensureFP<O>(value: O): EnsureFP<O> {
    if(isFP(value)) {
      return value as EnsureFP<O>;
    }
    return new Literal(value) as EnsureFP<O>;
  }

}
