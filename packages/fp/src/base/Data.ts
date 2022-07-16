import { FP, isFP } from "./FP";

export class Data<T> extends FP<T> {
  public override readonly status: 200 | 201;
  public override readonly kind: "Data";
  public override readonly hasData: true;
  public override readonly noValue: false;

  public readonly data: T;

  public constructor(
    value: T,
  ) {
    super();
    this.kind = "Data";
    this.hasData = true;
    this.noValue = false;
    this.data = value;
  }

  public override mapData<O>(fn: (input: T) => O): (this extends Data<T> ? (O extends { kind: string } ? O : Data<O>) : this) {
    const previousValue = this.data;
    const updatedValue = fn(previousValue);
    if(isFP(updatedValue)) {
      return updatedValue as (this extends Data<T> ? (O extends { kind: string } ? O : Data<O>) : this);
    } else {
      return new Data(updatedValue) as (this extends Data<T> ? (O extends { kind: string } ? O : Data<O>) : this);
    }
  }

  public override or<O = T>(value: O): (this extends Data<T> ? this : Data<O>) {
    return this as (this extends Data<T> ? this : Data<O>);
  }

}
