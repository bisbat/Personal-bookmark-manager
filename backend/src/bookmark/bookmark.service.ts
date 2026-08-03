import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Bookmark, Prisma } from '../../prisma/generated/client';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';

@Injectable()
export class BookmarkService {
    constructor(private readonly prisma: PrismaService) { }

    async findAllByOwnerId(
        ownerId: string,
    ): Promise<Bookmark[]> {
        return this.prisma.bookmark.findMany({
            where: { ownerId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOneByIdAndOwnerId(
        id: string,
        ownerId: string,
    ): Promise<Bookmark | null> {
        return this.prisma.bookmark.findFirst({
            where: {
                id,
                ownerId,
            },
        });
    }

    async create(createBookmarkDto: CreateBookmarkDto, ownerId: string): Promise<Bookmark> {
        return this.prisma.bookmark.create({
            data: {
                url: createBookmarkDto.url,
                title: createBookmarkDto.title,
                ownerId: ownerId,
                notes: createBookmarkDto.notes,
            },
        });
    }

    async update(id: string, ownerId: string, updateData: UpdateBookmarkDto): Promise<Bookmark> {
        try {
            return await this.prisma.bookmark.update({
                where: { id, ownerId },
                data: updateData,
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('ไม่พบ Bookmark นี้ หรือคุณไม่มีสิทธิ์แก้ไข');
            }
            throw error;
        }
    }

    async remove(id: string, ownerId: string): Promise<Bookmark> {
        try {
            return await this.prisma.bookmark.delete({
                where: { id, ownerId },
            });
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('ไม่พบ Bookmark นี้ หรือคุณไม่มีสิทธิ์ลบ');
            }
            throw error;
        }
    }
}