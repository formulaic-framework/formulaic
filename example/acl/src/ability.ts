import { Ability, AbilityClass } from "@casl/ability";
import { Action, CRUDAction } from "@formulaic/acl";
import {
  AclArticle,
  AclComment,
  AclDraft,
  AclUser,
} from "./subjects";

export type Abilities
  = [Action.MANAGE | Action.BROWSE, "all"]
  | [Action, "AclArticle" | AclArticle]
  | [CRUDAction, "AclDraft" | AclDraft]
  | [Action, "AclComment" | AclComment]
  | [CRUDAction, "AclUser" | AclUser];

export type AppAbility = Ability<Abilities>;
export const AppAbility = Ability as AbilityClass<AppAbility>;
