import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({ example: 'user-123' })
  @IsString()
  userId: string;

  @ApiProperty({ example: 'course-456' })
  @IsString()
  courseId: string;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  price: number;
}