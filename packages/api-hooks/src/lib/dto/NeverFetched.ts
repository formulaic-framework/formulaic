import { NoValue } from "@formulaic/base-fp";

/**
 * Represents if a query has never been fetched.
 */
export class NeverFetched<T> extends NoValue<T, "NeverFetched", 204> {
  public static readonly kind = "NeverFetched";

  public override readonly kind: "NeverFetched";

  public override readonly status: 204;

  public constructor() {
    super();
    this.kind = "NeverFetched";
    this.status = 204;
  }

}
