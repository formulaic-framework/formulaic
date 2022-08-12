import { ApiPropertyOptional } from "@nestjs/swagger";
import { Expose } from "class-transformer";
import { ExtractFPType } from "../base/FP";
import { MapFP } from "../base/util";
import { NotFound } from "./NotFound";

/**
 * Describes a request that executed without any errors,
 * but did not return data.
 *
 * In production, {@link EntityNotFound} is configured to hide the difference between
 * missing entities and permission errors, exposing both as a minimal {@link NotFound} response.
 */
export class EntityNotFound<
  T,
  EntityType = T,
  EntityName extends string = string,
  FindOptions = any,
> extends NotFound<T, EntityType, EntityName> {

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

  public override map<O>(fn: (data: T) => O): EntityNotFound<ExtractFPType<O>, EntityType, EntityName, FindOptions> {
    return this as unknown as EntityNotFound<ExtractFPType<O>, EntityType, EntityName, FindOptions>;
  }

  public override async chain<O>(fn: (data: T) => Promise<O>): Promise<EntityNotFound<ExtractFPType<O>, EntityType, EntityName, FindOptions>> {
    return this as unknown as EntityNotFound<ExtractFPType<O>, EntityType, EntityName, FindOptions>;
  }

}
