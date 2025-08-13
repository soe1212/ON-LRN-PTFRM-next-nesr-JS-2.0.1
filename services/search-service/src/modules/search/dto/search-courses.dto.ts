import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchCoursesDto {
  @ApiProperty({ required: false, example: 'web development' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiProperty({ required: false, example: 'Web Development' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false, example: 'BEGINNER' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiProperty({ required: false, example: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, example: 10, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit?: number = 10;
}