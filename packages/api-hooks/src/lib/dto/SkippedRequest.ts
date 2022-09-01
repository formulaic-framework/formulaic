import { NoValue } from "@formulaic/base-fp";

export class SkippedRequest<T> extends NoValue<T, "SkippedRequest", 100> {
  public static readonly kind = "SkippedRequest";

  public override readonly kind: "SkippedRequest";

  public override readonly status: 100;

  public constructor() {
    super();
    this.kind = "SkippedRequest";
    this.status = 100;
  }
}
