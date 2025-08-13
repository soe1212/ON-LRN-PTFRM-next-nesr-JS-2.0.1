import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsArray, IsEnum } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'Complete Web Development Bootcamp' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn web development from scratch...' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Master web development skills', required: false })
  @IsOptional()
  @IsString()
  shortDescription?: string;

  @ApiProperty({ example: 'https://example.com/thumbnail.jpg', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 79.99, required: false })
  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @ApiProperty({ example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ example: 'BEGINNER', enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'] })
  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'])
  level: string;

  @ApiProperty({ example: 'Web Development' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'Frontend', required: false })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiProperty({ example: ['javascript', 'react', 'nodejs'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ example: ['Basic computer knowledge'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  requirements?: string[];

  @ApiProperty({ example: ['Build web applications'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  learningObjectives?: string[];

  @ApiProperty({ example: 'instructor-id' })
  @IsString()
  instructorId: string;
}