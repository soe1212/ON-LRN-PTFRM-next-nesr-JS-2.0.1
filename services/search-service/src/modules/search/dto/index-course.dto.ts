import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class IndexCourseDto {
  @ApiProperty({ example: 'course-123' })
  @IsString()
  id: string;

  @ApiProperty({ example: 'Complete Web Development Bootcamp' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn web development from scratch...' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Web Development' })
  @IsString()
  category: string;

  @ApiProperty({ example: 'BEGINNER' })
  @IsString()
  level: string;

  @ApiProperty({ example: 'PUBLISHED' })
  @IsString()
  status: string;

  @ApiProperty({ example: ['javascript', 'react', 'nodejs'] })
  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 4.8 })
  @IsNumber()
  rating: number;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  totalStudents: number;

  @ApiProperty({ example: 'instructor-123' })
  @IsString()
  instructorId: string;

  @ApiProperty({ example: 'https://example.com/thumbnail.jpg', required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ example: '2023-11-20T10:30:00Z' })
  @IsString()
  createdAt: string;

  @ApiProperty({ example: '2023-11-20T10:30:00Z', required: false })
  @IsOptional()
  @IsString()
  publishedAt?: string;
}