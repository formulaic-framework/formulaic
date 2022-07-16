import { ApiProperty } from "@nestjs/swagger";
import { FP } from "./base/FP";

/**
 * Report that a user is completely missing the permission for a broad action.
 *
 * This should be used when the user won't gain any information if they are told about this lack of permission -
 * use {@link AccessForbidden} if evaluating the user's ability relative to a specific document, which can avoid
 * revealing the existence of hidden information.
 */
export class MissingPermission<T> extends FP<T> {
  @ApiProperty()
  public override readonly kind: "MissingPermission";

  @ApiProperty()
  public override readonly status: 401;

  public override readonly hasData: false;

  public override readonly noValue: false;

  public constructor() {
    super();
    this.kind = "MissingPermission";
    this.status = 401;
    this.hasData = false;
    this.noValue = false;
  }
}
