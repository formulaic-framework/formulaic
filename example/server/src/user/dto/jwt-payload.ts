import { Role } from "acl";
import { IsString } from "class-validator";

export class JWTPayload {

  @IsString()
  sub: string;

  @IsString({
    each: true,
  })
  roles: Role[];

}
