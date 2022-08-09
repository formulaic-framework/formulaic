import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { NoValue } from "../base/NoValue";

/**
 * Flexible class describing an entity that was not found,
 * or that the user lacks permission to view.
 */
export class NotFound<T, EntityType, EntityName extends string> extends NoValue<T> {
  public static readonly kind = "NotFound";

  @ApiProperty()
  @Expose()
  public override readonly kind: "NotFound";

  /**
   * Distinguishes truly not found entities from requests denied because a user lacks permission
   * to know if the entity exists.
   */
  @ApiPropertyOptional()
  @Expose({
    groups: ["debug", "exposeForbidden"],
  })
  public readonly permissionError: boolean;

  /**
   * Flexible HTTP status - by default, debug mode will reveal the distinction between not found errors
   * and permission errors, and production environments will hide the difference.
   */
  @ApiProperty()
  @Transform(({ value, options }) => {
    const groups = (options && options.groups && Array.isArray(options.groups))
      ? options.groups
      : [];
    if(groups.includes("debug") || groups.includes("exposeForbidden")) {
      return value;
    }
    return 404;
  })
  public override readonly status: 403 | 404;

  @ApiPropertyOptional()
  @Expose({
    groups: ["structure"],
  })
  public readonly entityName?: EntityName;

  public constructor(
    entityName: EntityName,
    permissionError: boolean,
  ) {
    super();
    this.kind = "NotFound";
    this.status = permissionError ? 403 : 404;
    this.permissionError = permissionError;
    this.entityName = entityName;
  }

}
