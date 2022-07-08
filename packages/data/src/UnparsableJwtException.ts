export enum UnparsableJwtReason {
  AUTH_HEADER_UNPARSABLE = "auth_header_unparsable",
  NOT_JWT = "not_jwt",
  INVALID_TOKEN = "invalid_token",
  INVALID_STRUCTURE = "invalid_structure",
  REQUEST_TYPE = "request_type",
}

export class UnparsableJwtException {
  public readonly kind: "UnparsableJwtException";
  public readonly reason: UnparsableJwtReason;
  public readonly websocket: boolean;

  public constructor(
    reason: UnparsableJwtReason,
    websocket = false,
  ) {
    this.kind = "UnparsableJwtException";
    this.reason = reason;
    this.websocket = websocket;
  }
}
