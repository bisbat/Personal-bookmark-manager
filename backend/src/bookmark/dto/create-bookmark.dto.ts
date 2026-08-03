import { IsString, IsUrl, IsOptional } from 'class-validator';

export class CreateBookmarkDto {
    @IsUrl()
    url!: string;

    @IsString()
    title!: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
