import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum } from 'class-validator';

export class CreateLectureDto {
  @ApiProperty({ example: 'Introduction to HTML' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Learn HTML basics', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'VIDEO', enum: ['VIDEO', 'ARTICLE', 'QUIZ', 'ASSIGNMENT', 'RESOURCE'] })
  @IsEnum(['VIDEO', 'ARTICLE', 'QUIZ', 'ASSIGNMENT', 'RESOURCE'])
  type: string;

  @ApiProperty({ example: 15, required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ example: 'https://example.com/video.mp4', required: false })
  @IsOptional()
  @IsString()
  videoUrl?: string;

  @ApiProperty({ example: 'https://example.com/playlist.m3u8', required: false })
  @IsOptional()
  @IsString()
  hlsUrl?: string;

  @ApiProperty({ example: 'https://example.com/thumbnail.jpg', required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ example: 'Article content here...', required: false })
  @IsOptional()
  @IsString()
  articleContent?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isPreview?: boolean;

  @ApiProperty({ example: 1 })
  @IsNumber()
  order: number;

  @ApiProperty({ example: 'section-id' })
  @IsString()
  sectionId: string;
}