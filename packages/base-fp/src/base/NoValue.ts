import { EnsureFP, ExtractFPType, FP, isFP } from "./FP";
import { Literal } from "../Literal";

/**
 * One of the {@link FP} core interfaces, representing responses that have not failed,
 * but lack data - e.g. a database `findOne()` call that didn't match any results.
 *
 * In general, this is used to avoid `null` hell.
 */
export abstract class NoValue<T, Kind extends string, Status extends number = 404> extends FP<T, Kind, Status, false, false, true> {
  public override readonly hasData: false;
  public override readonly hasError: false;
  public override readonly noValue: true;

  public constructor() {
    super();
    this.hasData = false;
    this.hasError = false;
    this.noValue = true;
  }

  public override alt<O>(fn: () => O): EnsureFP<O> {
    return this.altValue(fn());
  }

  public override async altThen<O>(fn: () => Promise<O>): Promise<EnsureFP<O>> {
    return this.altValue(await fn());
  }

  public override altValue<O>(value: O): EnsureFP<O> {
    return this.orValue(value);
  }

  public override or<O>(fn: () => O): EnsureFP<O> {
    return this.orValue(fn());
  }

  public override async orThen<O>(fn: () => Promise<O>): Promise<EnsureFP<O>> {
    return this.orValue(await fn());
  }

  public override orValue<O>(value: O): EnsureFP<O> {
    return this.ensureFP(value);
  }

  public override map<O>(fn: (data: T) => O): NoValue<ExtractFPType<O>, Kind, Status> {
    return this as unknown as NoValue<ExtractFPType<O>, Kind, Status>;
  }

  public override async chain<O>(fn: (data: T) => Promise<O>): Promise<NoValue<ExtractFPType<O>, Kind, Status>> {
    return this as unknown as NoValue<ExtractFPType<O>, Kind, Status>;
  }

  protected override ensureFP<O>(value: O): EnsureFP<O> {
    if(isFP(value)) {
      return value as EnsureFP<O>;
    }
    return new Literal(value) as FP<O, "Literal", 200 | 201, true, false, false> as EnsureFP<O>;
  }

}
