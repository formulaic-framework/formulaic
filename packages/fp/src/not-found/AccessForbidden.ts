import { MapFP } from "../base/util";
import { NotFound } from "./NotFound";

/**
 * Describes a permission error in which the user was forbidden to access
 * an entity that exists.
 *
 * This class will avoid exposing information in production settings by default -
 * users will be sent a minimal {@link NotFound} instance, unless otherwise configured.
 */
export class AccessForbidden<T, EntityType, EntityName extends string> extends NotFound<T, EntityType, EntityName> {

  public constructor(entityName: EntityName) {
    super(entityName, true);
  }

  public override map<O>(fn: (data: T) => O): MapFP<this, O, AccessForbidden<O, EntityType, EntityName>> {
    return this as unknown as MapFP<this, O, AccessForbidden<O, EntityType, EntityName>>;
  }

  public override async chain<O>(fn: (data: T) => Promise<O>): Promise<MapFP<this, O, AccessForbidden<O, EntityType, EntityName>>> {
    return this as unknown as MapFP<this, O, AccessForbidden<O, EntityType, EntityName>>;
  }

}
