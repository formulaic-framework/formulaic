import { EntityService } from "@formulaic/entity-service";
import { HashService } from "@formulaic/hash";
import { IDService } from "@formulaic/id";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ID } from "../id";
import { User } from "./user.entity";

@Injectable()
export class UserService extends EntityService<User> {

  public constructor(
    private readonly hash: HashService,
    private readonly id: IDService<ID>,
    @InjectRepository(User)
    private readonly users: Repository<User>,
  ) {
    super("User", users);
  }

  public async createUser(username: string, password: string) {
    const user = await this.buildUser(username, password);
    return this.save(user);
  }

  public async buildUser(
    username: string,
    password: string,
  ): Promise<User> {
    const user = new User();
    user.id = await this.id.id("user");
    user.username = username;
    user.password = await this.hash.hash(password);
    return user;
  }

}
