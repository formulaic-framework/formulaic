import { Data } from "./Data";
import { FP } from "./FP";

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
}
