import { ApiProperty } from "@nestjs/swagger";
import { ErrorFP } from "./base/ErrorFP";
import { ExtractFPType } from "./base/FP";

/**
 * Report that a user is completely missing the permission for a broad action.
 *
 * This should be used when the user won't gain any information if they are told about this lack of permission -
 * use {@link AccessForbidden} if evaluating the user's ability relative to a specific document, which can avoid
 * revealing the existence of hidden information.
 */
export class MissingPermission<T> extends ErrorFP<T, "MissingPermission", 401> {
  public static readonly kind = "MissingPermission";

  @ApiProperty()
  public override readonly kind: "MissingPermission";

  @ApiProperty()
  public override readonly status: 401;

  public constructor() {
    super();
    this.kind = "MissingPermission";
    this.status = 401;
  }

  public override map<O>(fn: (value: T) => O): MissingPermission<ExtractFPType<O>> {
    return this as unknown as MissingPermission<ExtractFPType<O>>;
  }

  public override async chain<O>(fn: (value: T) => Promise<O>): Promise<MissingPermission<ExtractFPType<O>>> {
    return this as unknown as MissingPermission<ExtractFPType<O>>;
  }
}
