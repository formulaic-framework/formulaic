export enum InvalidAuthenticationReason {
  EXPIRED = "expired",
}

export class InvalidAuthenticationException {

  public readonly kind: "InvalidAuthenticationException";

  public readonly reason: InvalidAuthenticationReason;

  public constructor(
    reason: InvalidAuthenticationReason,
  ) {
    this.kind = "InvalidAuthenticationException";
    this.reason = reason;
  }


}
