import { AclUser as BaseAclUser } from "@formulaic/acl";
import { Role } from "./role";

export enum Subject {
  AclArticle = "AclArticle",
  AclDraft = "AclDraft",
  AclComment = "AclComment",
  AclUser = "AclUser",
}

export class AclUser extends BaseAclUser<Role> {
}

export class AclArticle {
  public readonly kind: Subject.AclArticle;
  public readonly id: string;
}

export class AclDraft {
  public readonly kind: Subject.AclDraft;
  public readonly id: string;
  public readonly createdById: string;
  public readonly published: boolean;
}

export class AclComment {
  public readonly kind: Subject.AclComment;
  public readonly id: string;
  public readonly createdById: string;
  public readonly userDeleted: boolean;
  public readonly staffDeleted: boolean;
}
