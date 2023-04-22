import { Test, TestingModule } from "@nestjs/testing";
import { CardsController } from "./cards.controller";
import { CardsService } from "./cards.service";
import { UsersService } from "../users/users.service";
import { CardsModule } from "./cards.module";
import { UsersModule } from "../users/users.module";
import { SetsModule } from "../sets/sets.module";

describe("CardsController", () => {
  let cardsController: CardsController;
  let cardsService: CardsService;
  let usersService: UsersService;

  const working = {
    id: "47ab7340-dd04-4d09-ad16-a23799821b6a",
    setId: "2107297d-59a7-40b8-b764-81cc509f2afe",
    index: 0,
    term: "term",
    definition: "definition",
    createdAt: "2022-10-11T23:59:07.721Z",
    updatedAt: "022-10-11T23:59:07.722Z",
    set: {
      authorId: "47ab7340-dd04-4d09-ad16-a23799821b6a",
      private: true
    }
  };

  beforeEach(async () => {
    // const cardsServiceProvider = {
    //   provide: CardsService,
    //   useFactory: () => ({
    //     card: jest.fn(() => {
    //       return working;
    //     })
    //   })
    // };
    //
    // const usersServiceProvider = {
    //   provide: UsersService,
    //   useFactory: () => ({
    //     getUserInfo: jest.fn(() => {
    //       return { id: "2107297d-59a7-40b8-b764-81cc509f2afe" };
    //     }),
    //     user: jest.fn(() => {
    //       return { id: "47ab7340-dd04-4d09-ad16-a23799821b6a" };
    //     })
    //   })
    // };

    const app: TestingModule = await Test.createTestingModule({
      imports: [CardsModule, UsersModule, SetsModule],
      controllers: [CardsController],
      providers: [CardsService, UsersService]
    }).compile();

    cardsController = app.get<CardsController>(CardsController);
    cardsService = app.get<CardsService>(CardsService);
    usersService = app.get<UsersService>(UsersService);
  });

  describe("card", () => {
    it("should call getUserInfo", async () => {
      //   const getUserInfo = jest.spyOn(usersService, "getUserInfo")
      //       .mockImplementation(() => {
      //         return { id: "", email: "" };
      //       });
      //   // eslint-disable-next-line
      //   await cardsController.card({ cardId: "47ab7340-dd04-4d09-ad16-a23799821b6a" }, { cookies: { access_token: "" } } as any as Request);
      //
      //   expect(spyUsersService.getUserInfo).toHaveBeenCalled();
      // });

      // it("should retrieve a card", async () => {
      //   expect(
      //       // eslint-disable-next-line
      //       await cardsController.card({ cardId: "47ab7340-dd04-4d09-ad16-a23799821b6a" }, { cookies: { access_token: "" } } as any as Request)
      //   ).toEqual(working);
      // });
    });
  });