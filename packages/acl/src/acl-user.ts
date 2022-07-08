/**
 * A very simple representation of a user that can have an ID and a set of roles,
 * that may be useful for many applications.
 *
 * Used by high-level Formulaic modules that are more opinionated.
 */
export class AclUser<Role extends string = string> {

  public readonly kind: "AclUser";

  public readonly id: string;

  public readonly roles: Role[];

}
