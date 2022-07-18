import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Expose, Transform } from "class-transformer";
import { NoData } from "./base/NoData";

/**
 * Flexible class describing an entity that was not found,
 * or that the user lacks permission to view.
 */
export class NotFound<T, EntityName extends string> extends NoData<T> {
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
   *
   * If a value is set, it will override the default logic.
   */
  @ApiProperty()
  @Transform(({ value, obj, options }) => {
    if(value) {
      return value;
    }
    if(options.groups.includes("debug") || options.groups.includes("exposeForbidden")) {
      const permissionError = (obj as NotFound<any, any>).permissionError;
      return permissionError ? 403 : 404;
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
    this.permissionError = permissionError;
    this.entityName = entityName;
  }

}
