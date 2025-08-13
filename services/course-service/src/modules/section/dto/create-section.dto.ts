import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateSectionDto {
  @ApiProperty({ example: 'Introduction to Web Development' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn the basics of web development', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({ example: 'course-id' })
  @IsString()
  courseId: string;
}