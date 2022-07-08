import { AbilityBuilder } from "@casl/ability";
import { Action } from "@formulaic/acl";
import { AppAbility } from "./ability";
import { Role } from "./role";
import { AclUser } from "./subjects";

export function abilityFor(user?: AclUser) {
  const { can, cannot, build } = new AbilityBuilder(AppAbility);

  const roles = user?.roles ?? [];
  const admin = roles.includes(Role.ADMIN);
  const editor = roles.includes(Role.EDITOR);
  const writer = roles.includes(Role.WRITER);
  const mod = roles.includes(Role.MODERATOR);

  const staff = admin || editor || writer || mod;

  if(admin) {
    can(Action.MANAGE, "all");
  } else if(staff) {
    can(Action.BROWSE, "all");
    can(Action.DELETE, "AclComment");
  } else {
    can(Action.BROWSE, "AclArticle");
    can(Action.BROWSE, "AclComment");
    can(Action.BROWSE, "AclUser", ["id"]);
    cannot(Action.BROWSE, "AclComment", { staffDeleted: true });
    cannot(Action.BROWSE, "AclComment", { userDeleted: true });
  }

  if(admin || editor || writer) {
    can(Action.CREATE, "AclDraft");
    can(Action.UPDATE, "AclDraft");
  }

  if(admin || editor) {
    can(Action.UPDATE, "AclArticle");
    can(Action.REMOVE, "AclComment");
  }

  if(user) {
    can(Action.CREATE, "AclComment");
    can(Action.UPDATE, "AclComment", { createdById: user.id });
    can(Action.DELETE, "AclComment", { createdById: user.id });
    can(Action.SUBMIT, "AclComment", { createdById: user.id });
    cannot(Action.SUBMIT, "AclComment", { staffDeleted: true });
  }

  return build({
    detectSubjectType: (item) => item.kind,
  });
}
