import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { NotFound } from "./NotFound";

/**
 * Describes a request that executed without any errors,
 * but did not return data.
 *
 * In production, {@link EntityNotFound} is configured to hide the difference between
 * missing entities and permission errors, exposing both as a minimal {@link NotFound} response.
 */
export class EntityNotFound<
  EntityName extends string = string,
  FindOptions = any,
  T = any,
> extends NotFound<T, EntityName> {

  @ApiPropertyOptional()
  @Expose({
    groups: ["debug"]
  })
  public readonly findOptions?: FindOptions;

  public constructor(
    entityName: EntityName,
    findOptions?: FindOptions,
  ) {
    super(entityName, false);
    this.findOptions = findOptions;
  }

}
