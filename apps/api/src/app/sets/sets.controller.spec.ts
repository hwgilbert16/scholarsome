import { Test, TestingModule } from '@nestjs/testing';
import { SetsController } from './sets.controller';

describe('SetsController', () => {
  let controller: SetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SetsController],
    }).compile();

    controller = module.get<SetsController>(SetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
