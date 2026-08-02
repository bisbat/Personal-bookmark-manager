jest.mock('../../generated/prisma/client', () => ({
  PrismaClient: class {
    $connect = jest.fn();
    $disconnect = jest.fn();
  },
}));

jest.mock('@prisma/adapter-pg', () => ({
  PrismaPg: jest.fn(),
}));

import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  beforeEach(() => {
    process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/bookmarks';
  });

  it('connects when the Nest module initializes', async () => {
    const service = new PrismaService();
    const connect = jest
      .spyOn(service, '$connect')
      .mockResolvedValue(undefined);

    await service.onModuleInit();

    expect(connect).toHaveBeenCalledTimes(1);
  });

  it('disconnects when the Nest module is destroyed', async () => {
    const service = new PrismaService();
    const disconnect = jest
      .spyOn(service, '$disconnect')
      .mockResolvedValue(undefined);

    await service.onModuleDestroy();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
