import {
  Controller,
  Post,
  Body,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { ProcessVideoDto } from './dto/process-video.dto';

@ApiTags('media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('process-video')
  @ApiOperation({ summary: 'Process video for HLS streaming' })
  @ApiResponse({ status: 201, description: 'Video processing started' })
  async processVideo(@Body() processVideoDto: ProcessVideoDto) {
    return this.mediaService.processVideo(processVideoDto);
  }

  @Get('status/:jobId')
  @ApiOperation({ summary: 'Get processing status' })
  @ApiResponse({ status: 200, description: 'Processing status retrieved' })
  async getProcessingStatus(@Param('jobId') jobId: string) {
    return this.mediaService.getProcessingStatus(jobId);
  }
}