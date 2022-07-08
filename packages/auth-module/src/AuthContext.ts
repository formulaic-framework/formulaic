import { UserContext } from "./UserContext";

/**
 * An object to attach to `request.user`.
 */
export class AuthContext<User, AclType> {

  public user: UserContext<User> | undefined | false;
  public acl: AclType | undefined;

  public constructor() {
  }

  public setAcl(acl: AclType): void {
    this.acl = acl;
  }

  public setNoUser(): void {
    this.user = false;
  }

  public setUser(user: UserContext<User>): void {
    this.user = user;
  }

}
