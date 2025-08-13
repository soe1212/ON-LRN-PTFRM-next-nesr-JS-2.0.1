import {
  Controller,
  Get,
  Post,
  Body,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchCoursesDto } from './dto/search-courses.dto';
import { IndexCourseDto } from './dto/index-course.dto';

@ApiTags('search')
@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('courses')
  @ApiOperation({ summary: 'Search courses' })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'category', required: false, type: String })
  @ApiQuery({ name: 'level', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Search results retrieved successfully' })
  async searchCourses(@Query() searchDto: SearchCoursesDto) {
    return this.searchService.searchCourses(searchDto);
  }

  @Get('suggestions')
  @ApiOperation({ summary: 'Get search suggestions' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiResponse({ status: 200, description: 'Suggestions retrieved successfully' })
  async getSuggestions(@Query('q') query: string) {
    return this.searchService.getSuggestions(query);
  }

  @Post('index/course')
  @ApiOperation({ summary: 'Index a course' })
  @ApiResponse({ status: 201, description: 'Course indexed successfully' })
  async indexCourse(@Body() indexCourseDto: IndexCourseDto) {
    return this.searchService.indexCourse(indexCourseDto);
  }
}