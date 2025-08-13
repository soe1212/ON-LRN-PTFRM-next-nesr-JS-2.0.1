import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class ProcessVideoDto {
  @ApiProperty({ example: 'content-123' })
  @IsString()
  contentId: string;

  @ApiProperty({ example: 'https://storage.example.com/video.mp4' })
  @IsString()
  videoUrl: string;

  @ApiProperty({ example: 'course-123' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 'lecture-456' })
  @IsString()
  lectureId: string;

  @ApiProperty({ example: '1080p', required: false })
  @IsOptional()
  @IsString()
  quality?: string;
}