import { HashModule } from "@formulaic/hash";
import { IDModule } from "@formulaic/id";
import { MAX_NOLOOKALIKES_SIZE } from "@formulaic/id/dist/config";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IDs } from "../id";
import { User } from "./user.entity";
import { UserService } from "./user.service";

describe('UserService', () => {

  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: "sqlite",
          database: ":memory:",
          entities: [
            User,
          ],
          autoLoadEntities: true,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
        HashModule,
        IDModule.forRoot({
          ids: IDs,
        }),
      ],
      providers: [
        UserService,
      ],
    }).compile();
    userService = app.get<UserService>(UserService);
  });

  describe("buildUser", () => {
    it("generates IDs", async () => {
      const user = await userService.buildUser("admin", "admin");
      expect(user.id.length).toEqual(MAX_NOLOOKALIKES_SIZE[IDs.user[1]]);
    });
  });

  describe("listAll", () => {

    it("returns nothing without users", async () => {
      const users = await userService.listAll(true);
      expect(users.length).toBe(0);
    });

    it("can return users", async () => {
      const created = await Promise.all([
        userService.createUser("test1", "password"),
        userService.createUser("test2", "password"),
      ]);

      const users = await userService.listAll(true);
      expect(users.length).toBe(2);
    });

  });

});
