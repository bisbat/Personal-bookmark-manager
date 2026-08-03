import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';

describe('BookmarkService', () => {
  let service: BookmarkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookmarkService],
    }).compile();

    service = module.get<BookmarkService>(BookmarkService);
  });

  it('creates a bookmark', () => {
    const bookmark = service.create({ title: 'Nest', url: 'https://nestjs.com' });

    expect(bookmark).toMatchObject({ id: 1, title: 'Nest', url: 'https://nestjs.com' });
  });

  it('updates an existing bookmark', () => {
    service.create({ title: 'Nest', url: 'https://nestjs.com' });

    const updated = service.update(1, { title: 'Updated' });

    expect(updated.title).toBe('Updated');
  });

  it('removes an existing bookmark', () => {
    service.create({ title: 'Nest', url: 'https://nestjs.com' });

    const removed = service.remove(1);

    expect(removed.id).toBe(1);
    expect(service.findAll()).toHaveLength(0);
  });
});
