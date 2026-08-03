import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

type AuthUser = {
  id?: string;
  sub?: string;
};

@Controller('bookmark')
@UseGuards(JwtAuthGuard)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  private getOwnerId(user: AuthUser): string {
    return user.id ?? user.sub ?? '';
  }

  @Get()
  async findAll(@CurrentUser() user: AuthUser) {
    return this.bookmarkService.findAllByOwnerId(this.getOwnerId(user));
  }

  @Get(':id')
  async findOneById(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.bookmarkService.findOneByIdAndOwnerId(id, this.getOwnerId(user));
  }

  @Post()
  async create(
    @Body() createBookmarkDto: CreateBookmarkDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookmarkService.create(createBookmarkDto, this.getOwnerId(user));
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateBookmarkDto: UpdateBookmarkDto,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookmarkService.update(id, this.getOwnerId(user), updateBookmarkDto);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: AuthUser,
  ) {
    return this.bookmarkService.remove(id, this.getOwnerId(user));
  }
}