import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Collection, Prisma } from '../../prisma/generated/client';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Injectable()
export class CollectionService {
  constructor(private readonly prisma: PrismaService) {}

  async findAllByOwnerId(ownerId: string, query?: { name?: string }): Promise<Collection[]> {
    return this.prisma.collection.findMany({
      where: {
        ownerId,
        ...(query?.name ? { name: { contains: query.name, mode: 'insensitive' } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneByIdAndOwnerId(id: string, ownerId: string): Promise<Collection | null> {
    return this.prisma.collection.findFirst({
      where: {
        id,
        ownerId,
      },
    });
  }

  async create(createCollectionDto: CreateCollectionDto, ownerId: string): Promise<Collection> {
    const { name } = createCollectionDto;

    return this.prisma.collection.create({
      data: {
        name,
        ownerId,
      },
    });
  }

  async update(id: string, ownerId: string, updateData: UpdateCollectionDto): Promise<Collection> {
    try {
      return await this.prisma.collection.update({
        where: { id, ownerId },
        data: {
          ...(updateData.name ? { name: updateData.name } : {}),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Collection not found or access denied');
      }
      throw error;
    }
  }

  async patch(id: string, ownerId: string, updateData: UpdateCollectionDto): Promise<Collection> {
    try {
      return await this.prisma.collection.update({
        where: { id, ownerId },
        data: {
          ...(updateData.name !== undefined ? { name: updateData.name } : {}),
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Collection not found or access denied');
      }
      throw error;
    }
  }

  async remove(id: string, ownerId: string): Promise<Collection> {
    try {
      return await this.prisma.collection.delete({
        where: { id, ownerId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException('Collection not found or access denied');
      }
      throw error;
    }
  }
}
