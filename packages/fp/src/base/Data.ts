import { EnsureData, FP, isFP } from "./FP";

type DataMapData<T, ThisType extends Data<T>, O>
  = ThisType extends Data<T>
    ? EnsureData<O>
    : ThisType;

export class Data<T> extends FP<T> {
  public static readonly kind = "Data";

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

  public override mapData<O>(fn: (input: T) => O): DataMapData<T, this, O> {
    const previousValue = this.data;
    const updatedValue = fn(previousValue);
    if(isFP(updatedValue)) {
      return updatedValue as DataMapData<T, this, O>;
    } else {
      return new Data(updatedValue) as DataMapData<T, this, O>;
    }
  }

  public override async mapDataAsync<O>(fn: (input: T) => Promise<O>): Promise<DataMapData<T, this, O>> {
    const previousValue = this.data;
    const updatedValue = await fn(previousValue);
    if(isFP(updatedValue)) {
      return updatedValue as DataMapData<T, this, O>;
    } else {
      return new Data(updatedValue as T) as DataMapData<T, this, O>;
    }
  }

  public override or<O = T>(value: O): (this extends Data<T> ? this : Data<O>) {
    return this as (this extends Data<T> ? this : Data<O>);
  }

}
