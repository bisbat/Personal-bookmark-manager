import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdateBookmarkDto {
    @IsOptional()
    @IsUrl()
    url?: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
