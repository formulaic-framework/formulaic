import { NoValue } from "./base/NoValue";
import { MapFP } from "./base/util";

export class Empty<T = any> extends NoValue<T> {
  public static readonly kind = "Empty";

  public override readonly kind: "Empty";
  public override readonly status: 404;

  public constructor() {
    super();
    this.kind = "Empty";
    this.status = 404;
  }

  public override map<O>(fn: (value: T) => O): MapFP<this, O, Empty<O>> {
    return this as unknown as MapFP<this, O, Empty<O>>;
  }

  public override async chain<O>(fn: (value: T) => Promise<O>): Promise<MapFP<this, O, Empty<O>>> {
    return this as unknown as MapFP<this, O, Empty<O>>;
  }

}
