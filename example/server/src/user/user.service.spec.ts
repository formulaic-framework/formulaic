import { IDModule } from "@formulaic/id";
import { MAX_NOLOOKALIKES_SIZE } from "@formulaic/id/dist/config";
import { Test, TestingModule } from "@nestjs/testing";
import { IDs } from "../id";
import { UserService } from "./user.service";

describe('UserService', () => {

  let userService: UserService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
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
      const user = await userService.buildUser("admin");
      expect(user.id.length).toEqual(MAX_NOLOOKALIKES_SIZE[IDs.user[1]]);
    });
  });

});
