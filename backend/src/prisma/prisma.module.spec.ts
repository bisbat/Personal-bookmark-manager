jest.mock('./prisma.service', () => ({
  PrismaService: class PrismaService {},
}));

import { PrismaModule } from './prisma.module';

describe('PrismaModule', () => {
  it('is defined', () => {
    expect(PrismaModule).toBeDefined();
  });
});
