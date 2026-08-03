import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';

describe('BookmarkController', () => {
  let controller: BookmarkController;
  let bookmarkService: { create: jest.Mock; update: jest.Mock; findAllByOwnerId: jest.Mock; findOneByIdAndOwnerId: jest.Mock; remove: jest.Mock };

  beforeEach(async () => {
    bookmarkService = {
      create: jest.fn(),
      update: jest.fn(),
      findAllByOwnerId: jest.fn(),
      findOneByIdAndOwnerId: jest.fn(),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarkController],
      providers: [{ provide: BookmarkService, useValue: bookmarkService }],
    }).compile();

    controller = module.get<BookmarkController>(BookmarkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a bookmark through the controller', async () => {
    const createdBookmark = { id: '1', title: 'Nest', url: 'https://nestjs.com', ownerId: 'user-1' };
    bookmarkService.create.mockResolvedValue(createdBookmark);

    const result = await controller.create({ title: 'Nest', url: 'https://nestjs.com' }, { id: 'user-1' });

    expect(bookmarkService.create).toHaveBeenCalledWith({ title: 'Nest', url: 'https://nestjs.com' }, 'user-1');
    expect(result).toEqual(createdBookmark);
  });

  it('updates a bookmark through the controller', async () => {
    const updatedBookmark = { id: '1', title: 'Updated', url: 'https://nestjs.com', ownerId: 'user-1' };
    bookmarkService.update.mockResolvedValue(updatedBookmark);

    const result = await controller.update('1', { title: 'Updated' }, { id: 'user-1' });

    expect(bookmarkService.update).toHaveBeenCalledWith('1', 'user-1', { title: 'Updated' });
    expect(result).toEqual(updatedBookmark);
  });

  it('uses sub as owner id when id is missing from the auth payload', async () => {
    const createdBookmark = { id: '1', title: 'Nest', url: 'https://nestjs.com', ownerId: 'auth0-user-1' };
    bookmarkService.create.mockResolvedValue(createdBookmark);

    const result = await controller.create({ title: 'Nest', url: 'https://nestjs.com' }, { sub: 'auth0-user-1' } as never);

    expect(bookmarkService.create).toHaveBeenCalledWith({ title: 'Nest', url: 'https://nestjs.com' }, 'auth0-user-1');
    expect(result).toEqual(createdBookmark);
  });
});
