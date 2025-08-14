import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';

@ApiTags('progress')
@Controller()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get user progress for all courses' })
  @ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
  async getUserProgress(@Param('userId') userId: string) {
    return this.progressService.getUserProgress(userId);
  }

  @Get('user/:userId/course/:courseId')
  @ApiOperation({ summary: 'Get user progress for specific course' })
  @ApiResponse({ status: 200, description: 'Course progress retrieved successfully' })
  async getCourseProgress(
    @Param('userId') userId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.progressService.getCourseProgress(userId, courseId);
  }

  @Post('update')
  @ApiOperation({ summary: 'Update learning progress' })
  @ApiResponse({ status: 200, description: 'Progress updated successfully' })
  async updateProgress(@Body() updateProgressDto: UpdateProgressDto) {
    return this.progressService.updateProgress(updateProgressDto);
  }

  @Get('analytics/course/:courseId')
  @ApiOperation({ summary: 'Get course completion analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  async getCourseAnalytics(@Param('courseId') courseId: string) {
    return this.progressService.getCourseAnalytics(courseId);
  }
}