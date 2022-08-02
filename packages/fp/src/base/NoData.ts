import { Data } from "./Data";
import { EnsureData, FP, isFP } from "./FP";

export abstract class NoData<T> extends FP<T> {
  public override readonly hasData: false;
  public override readonly noValue: true;

  public constructor() {
    super();
    this.hasData = false;
    this.noValue = true;
  }

  public override substitute(value: T): (this extends NoData<T> ? Data<T> : this) {
    return new Data(value) as (this extends NoData<T> ? Data<T> : this);
  }

  public override async substituteAsync<O>(fn: () => Promise<O>): Promise<this extends NoData<T> ? EnsureData<O> : this> {
    const resolved = await fn();
    if(isFP(resolved)) {
      return resolved as (this extends NoData<T> ? EnsureData<O> : this);
    }
    return new Data(resolved as O) as (this extends NoData<T> ? EnsureData<O> : this);
  }
}
