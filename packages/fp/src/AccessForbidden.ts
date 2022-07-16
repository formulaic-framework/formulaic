import { NotFound } from "./NotFound";

/**
 * Describes a permission error in which the user was forbidden to access
 * an entity that exists.
 *
 * This class will avoid exposing information in production settings by default -
 * users will be sent a minimal {@link NotFound} instance, unless otherwise configured.
 */
export class AccessForbidden<T, EntityName extends string> extends NotFound<T, EntityName> {

  public constructor(entityName: EntityName) {
    super(entityName, true);
  }

}
