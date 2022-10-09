import { Test, TestingModule } from '@nestjs/testing';
import { SetsService } from './sets.service';

describe('SetService', () => {
  let service: SetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SetsService],
    }).compile();

    service = module.get<SetsService>(SetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
