import { FP, isFP } from "./FP";
import { Literal } from "../Literal";
import { Alt, EnsureFP, FPFields, MapFP, Or } from "./util";

/**
 * One of the {@link FP} core interfaces, representing responses that have not failed,
 * but lack data - e.g. a database `findOne()` call that didn't match any results.
 *
 * In general, this is used to avoid `null` hell.
 */
export abstract class NoValue<T> extends FP<T> {
  public override readonly hasData: false;
  public override readonly hasError: false;
  public override readonly noValue: true;

  public constructor() {
    super();
    this.hasData = false;
    this.hasError = false;
    this.noValue = true;
  }

  public override alt<O>(fn: () => O): Alt<this, O> {
    return this.altValue(fn());
  }

  public override async altThen<O>(fn: () => Promise<O>): Promise<Alt<this, O>> {
    return this.altValue(await fn());
  }

  public override altValue<O>(value: O): Alt<this, O> {
    return this.orValue(value) as EnsureFP<O> as Alt<this, O>;
  }

  public override or<O>(fn: () => O): Or<this, O> {
    return this.orValue(fn());
  }

  public override async orThen<O>(fn: () => Promise<O>): Promise<Or<this, O>> {
    return this.orValue(await fn());
  }

  public override orValue<O>(value: O): Or<this, O> {
    return this.ensureFP(value) as EnsureFP<O> as Or<this, O>;
  }

  public override map<O>(fn: (data: T) => O): MapFP<this, O, FPFields<this>> {
    return this as MapFP<this, O, FPFields<this>>;
  }

  public override async chain<O>(fn: (data: T) => Promise<O>): Promise<MapFP<this, O, FPFields<this>>> {
    return this as MapFP<this, O, FPFields<this>>;
  }

  protected ensureFP<O>(value: O): EnsureFP<O> {
    if(isFP(value)) {
      return value as EnsureFP<O>;
    }
    return new Literal(value) as EnsureFP<O>;
  }

}
