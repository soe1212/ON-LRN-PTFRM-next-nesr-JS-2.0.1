import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateProgressDto {
  @ApiProperty({ example: 'user-123' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'course-456' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 'lecture-789', required: false })
  @IsOptional()
  @IsString()
  lectureId?: string;

  @ApiProperty({ example: 15, required: false })
  @IsOptional()
  @IsNumber()
  timeSpent?: number;
}