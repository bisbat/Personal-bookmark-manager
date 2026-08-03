import { Test, TestingModule } from '@nestjs/testing';
import { CollectionService } from './collection.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CollectionService', () => {
  let service: CollectionService;
  let prisma: { collection: { findMany: jest.Mock; findFirst: jest.Mock; create: jest.Mock; update: jest.Mock; delete: jest.Mock } };

  beforeEach(async () => {
    prisma = {
      collection: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CollectionService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<CollectionService>(CollectionService);
  });

  it('finds collections scoped to the owner', async () => {
    prisma.collection.findMany.mockResolvedValue([{ id: '1', name: 'Work', ownerId: 'user-1' }]);

    await service.findAllByOwnerId('user-1');

    expect(prisma.collection.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: expect.objectContaining({ ownerId: 'user-1' }),
    }));
  });

  it('creates a collection for the authenticated owner', async () => {
    prisma.collection.create.mockResolvedValue({ id: '1', name: 'Work', ownerId: 'user-1' });

    await service.create({ name: 'Work' } as any, 'user-1');

    expect(prisma.collection.create).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ ownerId: 'user-1' }),
    }));
  });
});
