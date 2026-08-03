import { Test, TestingModule } from '@nestjs/testing';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';

declare const describe: any;
declare const beforeEach: any;
declare const it: any;
declare const expect: any;
declare const jest: any;

describe('CollectionController', () => {
  let controller: CollectionController;
  let service: { findAllByOwnerId: jest.Mock; findOneByIdAndOwnerId: jest.Mock; create: jest.Mock; update: jest.Mock; patch: jest.Mock; remove: jest.Mock };

  beforeEach(async () => {
    service = {
      findAllByOwnerId: jest.fn(),
      findOneByIdAndOwnerId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      patch: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CollectionController],
      providers: [{ provide: CollectionService, useValue: service }],
    }).compile();

    controller = module.get<CollectionController>(CollectionController);
  });

  it('delegates create with the authenticated owner id', async () => {
    service.create.mockResolvedValue({ id: '1', name: 'Work', ownerId: 'user-1' });

    await controller.create({ name: 'Work' }, { id: 'user-1' });

    expect(service.create).toHaveBeenCalledWith({ name: 'Work' }, 'user-1');
  });
});
