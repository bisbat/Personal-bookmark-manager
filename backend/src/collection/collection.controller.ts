import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

type AuthUser = {
  id?: string;
  sub?: string;
};

@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  private getOwnerId(user: AuthUser): string {
    return user.id ?? user.sub ?? '';
  }

  @Get()
  list(@CurrentUser() user: AuthUser, @Query('name') name?: string) {
    return this.collectionService.findAllByOwnerId(this.getOwnerId(user), { name });
  }

  @Get(':id')
  findOne(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.collectionService.findOneByIdAndOwnerId(id, this.getOwnerId(user));
  }

  @Post()
  create(@Body() dto: CreateCollectionDto, @CurrentUser() user: AuthUser) {
    return this.collectionService.create(dto, this.getOwnerId(user));
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCollectionDto, @CurrentUser() user: AuthUser) {
    return this.collectionService.update(id, this.getOwnerId(user), dto);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() dto: UpdateCollectionDto, @CurrentUser() user: AuthUser) {
    return this.collectionService.patch(id, this.getOwnerId(user), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.collectionService.remove(id, this.getOwnerId(user));
  }
}
