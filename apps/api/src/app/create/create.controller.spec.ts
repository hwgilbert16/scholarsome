import { Test, TestingModule } from '@nestjs/testing';
import { CreateController } from './create.controller';

describe('CreateController', () => {
  let controller: CreateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateController],
    }).compile();

    controller = module.get<CreateController>(CreateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
