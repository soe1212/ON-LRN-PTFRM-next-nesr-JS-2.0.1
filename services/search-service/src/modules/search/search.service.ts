import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from './elasticsearch.service';
import { SearchCoursesDto } from './dto/search-courses.dto';
import { IndexCourseDto } from './dto/index-course.dto';

@Injectable()
export class SearchService {
  constructor(private elasticsearchService: ElasticsearchService) {}

  async searchCourses(searchDto: SearchCoursesDto) {
    const { q, category, level, page = 1, limit = 10 } = searchDto;
    const from = (page - 1) * limit;

    const query: any = {
      bool: {
        must: [],
        filter: [],
      },
    };

    // Text search
    if (q) {
      query.bool.must.push({
        multi_match: {
          query: q,
          fields: ['title^3', 'description^2', 'tags', 'category'],
          type: 'best_fields',
          fuzziness: 'AUTO',
        },
      });
    } else {
      query.bool.must.push({
        match_all: {},
      });
    }

    // Filters
    if (category) {
      query.bool.filter.push({
        term: { 'category.keyword': category },
      });
    }

    if (level) {
      query.bool.filter.push({
        term: { 'level.keyword': level },
      });
    }

    // Only published courses
    query.bool.filter.push({
      term: { status: 'PUBLISHED' },
    });

    const searchParams = {
      index: 'courses',
      body: {
        query,
        from,
        size: limit,
        sort: [
          { _score: { order: 'desc' } },
          { rating: { order: 'desc' } },
          { totalStudents: { order: 'desc' } },
        ],
        highlight: {
          fields: {
            title: {},
            description: {},
          },
        },
        aggs: {
          categories: {
            terms: { field: 'category.keyword', size: 20 },
          },
          levels: {
            terms: { field: 'level.keyword', size: 10 },
          },
          price_ranges: {
            range: {
              field: 'price',
              ranges: [
                { key: 'Free', to: 1 },
                { key: '$1-$50', from: 1, to: 50 },
                { key: '$50-$100', from: 50, to: 100 },
                { key: '$100+', from: 100 },
              ],
            },
          },
        },
      },
    };

    const result = await this.elasticsearchService.search(searchParams);

    return {
      courses: result.body.hits.hits.map((hit: any) => ({
        ...hit._source,
        id: hit._id,
        score: hit._score,
        highlights: hit.highlight,
      })),
      total: result.body.hits.total.value,
      aggregations: {
        categories: result.body.aggregations.categories.buckets,
        levels: result.body.aggregations.levels.buckets,
        priceRanges: result.body.aggregations.price_ranges.buckets,
      },
      page,
      limit,
      pages: Math.ceil(result.body.hits.total.value / limit),
    };
  }

  async getSuggestions(query: string) {
    const searchParams = {
      index: 'courses',
      body: {
        suggest: {
          course_suggest: {
            prefix: query,
            completion: {
              field: 'suggest',
              size: 10,
            },
          },
        },
      },
    };

    const result = await this.elasticsearchService.search(searchParams);
    
    return {
      suggestions: result.body.suggest.course_suggest[0].options.map(
        (option: any) => option.text
      ),
    };
  }

  async indexCourse(indexCourseDto: IndexCourseDto) {
    const document = {
      ...indexCourseDto,
      suggest: {
        input: [
          indexCourseDto.title,
          ...indexCourseDto.tags,
          indexCourseDto.category,
        ],
        weight: indexCourseDto.rating * 10 + indexCourseDto.totalStudents / 100,
      },
      indexed_at: new Date(),
    };

    await this.elasticsearchService.index({
      index: 'courses',
      id: indexCourseDto.id,
      body: document,
    });

    return { message: 'Course indexed successfully' };
  }

  async deleteCourse(courseId: string) {
    await this.elasticsearchService.delete({
      index: 'courses',
      id: courseId,
    });

    return { message: 'Course removed from index' };
  }
}