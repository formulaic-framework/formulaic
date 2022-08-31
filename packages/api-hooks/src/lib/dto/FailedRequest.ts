import { ErrorFP } from "@formulaic/base-fp";

export class FailedRequest<T, ErrorValue, StatusCode extends number> extends ErrorFP<T, "FailedRequest", ErrorValue, StatusCode> {
  public static readonly kind = "FailedRequest";

  public override readonly kind: "FailedRequest";

  public constructor(
    err: ErrorValue,
    statusCode: StatusCode,
  ) {
    super(err, statusCode);
    this.kind = "FailedRequest";
  }

}
