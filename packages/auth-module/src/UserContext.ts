import { MaybePromise } from "./AuthModuleOptions";

/**
 * All required properties if a user is attached to a request.
 */
export class UserContext<UserType> {

  id: string | number;

  roles: any[];

  /**
   * The JWT payload attached to this request.
   */
  jwt: any;

  /**
   * The entire user object - fetched if the {@link ParseUser} decorator set.
   */
  user?: UserType;

  getUser: () => MaybePromise<UserType>;

}
