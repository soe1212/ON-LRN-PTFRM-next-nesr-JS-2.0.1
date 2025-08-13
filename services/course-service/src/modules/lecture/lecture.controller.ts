import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LectureService } from './lecture.service';
import { CreateLectureDto } from './dto/create-lecture.dto';
import { UpdateLectureDto } from './dto/update-lecture.dto';

@ApiTags('lectures')
@Controller('lectures')
export class LectureController {
  constructor(private readonly lectureService: LectureService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new lecture' })
  @ApiResponse({ status: 201, description: 'Lecture created successfully' })
  async create(@Body() createLectureDto: CreateLectureDto) {
    return this.lectureService.create(createLectureDto);
  }

  @Get('section/:sectionId')
  @ApiOperation({ summary: 'Get lectures by section ID' })
  @ApiResponse({ status: 200, description: 'Lectures retrieved successfully' })
  async findBySection(@Param('sectionId') sectionId: string) {
    return this.lectureService.findBySection(sectionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lecture by ID' })
  @ApiResponse({ status: 200, description: 'Lecture found' })
  @ApiResponse({ status: 404, description: 'Lecture not found' })
  async findOne(@Param('id') id: string) {
    return this.lectureService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update lecture' })
  @ApiResponse({ status: 200, description: 'Lecture updated successfully' })
  @ApiResponse({ status: 404, description: 'Lecture not found' })
  async update(@Param('id') id: string, @Body() updateLectureDto: UpdateLectureDto) {
    return this.lectureService.update(id, updateLectureDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete lecture' })
  @ApiResponse({ status: 200, description: 'Lecture deleted successfully' })
  @ApiResponse({ status: 404, description: 'Lecture not found' })
  async remove(@Param('id') id: string) {
    return this.lectureService.remove(id);
  }
}