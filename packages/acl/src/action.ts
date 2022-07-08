/**
 * A standard set of actions that a user may perform.
 */
export enum Action {

  /**
   * Shortcut to allow all actions.
   * (Set by CASL)
   */
  MANAGE = "manage",

  /**
   * Create a new entity.
   */
  CREATE = "create",

  /**
   * Read an entity/property.
   */
  BROWSE = "browse",

  /**
   * Update the values of an existing entity.
   */
  UPDATE = "update",

  /**
   * Delete an entity.  If soft-deletion is possible,
   * this is typically referring to a soft-delete, and {@link REMOVE} is used for a hard-delete.
   */
  DELETE = "delete",

  /**
   * Hard-delete an entity.
   * Omit, or alias of {@link DELETE} if an entity cannot be soft-deleted.
   */
  REMOVE = "remove",

  /**
   * An application-specific custom "primary action" that can be used for entities.
   *
   * For an entity representing a draft, may perform a publishing step.
   * For an entity representing a shopping cart, may complete the transaction.
   * For an entity representing a queued action, may execute the action.
   */
  SUBMIT = "submit",

}

export type CRUDAction
  = Action.CREATE
  | Action.BROWSE
  | Action.UPDATE
  | Action.DELETE;
