import { TaggedType } from "./interface/TaggedType";

export class EntityNotFound<
  EntityName extends string = string,
  FindOptions = any,
> {

  public readonly kind: "EntityNotFound";

  public readonly hasData: false;

  public readonly entityName: EntityName;

  public readonly findOptions: FindOptions;

  public constructor(
    entityName: EntityName,
    findOptions: FindOptions,
  ) {
    this.kind = "EntityNotFound";
    this.entityName = entityName;
    this.findOptions = findOptions;
  }

}

export function isEntityNotFound(obj: TaggedType): obj is EntityNotFound {
  return obj.kind === "EntityNotFound";
}
