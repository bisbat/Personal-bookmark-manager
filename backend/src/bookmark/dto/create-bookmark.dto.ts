import { IsString, IsUrl, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateBookmarkDto {
    @IsUrl()
    @IsNotEmpty()
    url!: string;

    @IsString()
    @IsNotEmpty()
    title!: string;

    @IsOptional()
    @IsString()
    notes?: string;
}
