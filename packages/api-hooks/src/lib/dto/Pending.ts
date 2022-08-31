import { NoValue } from "@formulaic/base-fp";

export class Pending<T> extends NoValue<T, "Pending", 102> {
  public static readonly kind = "Pending";

  public override readonly kind: "Pending";

  public override readonly status: 102;

  public constructor() {
    super();
    this.kind = "Pending";
    this.status = 102;
  }
}
