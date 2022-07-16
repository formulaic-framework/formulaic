import { NotFound } from "./NotFound";

/**
 * Describes a request that executed without any errors,
 * but did not return data.
 *
 * In production, {@link EntityNotFound} is configured to hide the difference between
 * missing entities and permission errors, exposing both as a minimal {@link NotFound} response.
 */
export class EntityNotFound<T, EntityName extends string> extends NotFound<T, EntityName> {

  public constructor(entityName: EntityName) {
    super(entityName, false);
  }

}
