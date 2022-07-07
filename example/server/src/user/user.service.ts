import { IDService } from "@formulaic/id";
import { Injectable } from "@nestjs/common";
import { ID } from "../id";
import { User } from "./user.entity";

@Injectable()
export class UserService {

  public constructor(
    private readonly id: IDService<ID>,
  ) {}

  public async buildUser(
    username: string,
  ): Promise<User> {
    const user = new User();
    user.id = await this.id.id("user");
    user.username = username;
    return user;
  }

}
