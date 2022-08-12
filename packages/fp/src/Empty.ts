import { ExtractFPType } from "./base/FP";
import { NoValue } from "./base/NoValue";
import { MapFP } from "./base/util";

export class Empty<T = any> extends NoValue<T, "Empty", 404> {
  public static readonly kind = "Empty";

  public override readonly kind: "Empty";
  public override readonly status: 404;

  public constructor() {
    super();
    this.kind = "Empty";
    this.status = 404;
  }

  public override map<O>(fn: (value: T) => O): Empty<ExtractFPType<O>> {
    return this as unknown as Empty<ExtractFPType<O>>;
  }

  public override async chain<O>(fn: (value: T) => Promise<O>): Promise<Empty<ExtractFPType<O>>> {
    return this as unknown as Empty<ExtractFPType<O>>;
  }

}
