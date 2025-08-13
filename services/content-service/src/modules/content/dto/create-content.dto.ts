import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateContentDto {
  @ApiProperty({ example: 'course-123' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 'lecture-456' })
  @IsString()
  lectureId: string;

  @ApiProperty({ example: 'video.mp4' })
  @IsString()
  fileName: string;

  @ApiProperty({ example: 'https://storage.example.com/video.mp4' })
  @IsString()
  fileUrl: string;

  @ApiProperty({ example: 'https://cdn.example.com/playlist.m3u8', required: false })
  @IsOptional()
  @IsString()
  hlsUrl?: string;

  @ApiProperty({ example: 'https://cdn.example.com/thumb.jpg', required: false })
  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @ApiProperty({ example: 'video/mp4' })
  @IsString()
  mimeType: string;

  @ApiProperty({ example: 1024000 })
  @IsNumber()
  size: number;

  @ApiProperty({ example: 'course-123/lecture-456/video.mp4' })
  @IsString()
  storageKey: string;

  @ApiProperty({ example: 'uploaded', required: false })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiProperty({ example: 1200, required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}