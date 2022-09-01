import { EnsureFP, FP } from "./FP";

/**
 * One of the {@link FP} core interfaces that represents "successful" data.
 *
 * Users are unlikely to find this class as useful directly as alternatives:
 * - if you are returning arbitrary data and don't want to create a FP class, use {@link Literal}.
 * - if you are creating your own FP classes, you likely want to extend {@link DataFP}.
 */
export abstract class Data<T, Kind extends string, Status extends number = 200 | 201> extends FP<T, Kind, Status, true, false, false> {
  public override readonly hasData: true;
  public override readonly hasError: false;
  public override readonly noValue: false;

  public constructor() {
    super();
    this.hasData = true;
    this.hasError = false;
    this.noValue = false;
  }

  public override alt<O>(fn: () => O): this {
    return this;
  }

  public override async altThen<O>(fn: () => Promise<O>): Promise<this> {
    return this;
  }

  public override altValue<O>(value: O): this {
    return this;
  }

  public override or<O>(fn: () => O): this {
    return this;
  }

  public override async orThen<O>(fn: () => Promise<O>): Promise<this> {
    return this;
  }

  public override orValue<O>(value: O): this {
    return this;
  }

  protected processMap<I,O>(input: I, fn: (data: I) => O): EnsureFP<O> {
    const mapped = fn(input);
    return this.ensureFP(mapped);
  }

  protected async processThen<I, O>(input: I, fn: (data: I) => Promise<O>): Promise<EnsureFP<O>> {
    const resolved = await fn(input);
    return this.ensureFP(resolved);
  }

}
