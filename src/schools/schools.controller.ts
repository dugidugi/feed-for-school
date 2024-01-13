import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dtos/create-school.dto';
import { School } from './schemas/school.schema';
import {
  PaginationDto,
  PaginationResponseDto,
} from '@src/common/dtos/pagination.dto';
import { News } from '@src/news/schemas/news.schema';
import { BasicResponseDto } from '@src/common/dtos/response.dto';
import { GetSchoolNewsSortingDto } from './dtos/get-school-news-sorting.dto';

@Controller('schools')
export class SchoolsController {
  constructor(private schoolsService: SchoolsService) {}

  @Post()
  create(
    @Body() createSchoolDto: CreateSchoolDto,
  ): Promise<BasicResponseDto<School>> {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get('/:schoolId/news')
  getNews(
    @Param('schoolId') schoolId: string,
    @Query() paginationDto: PaginationDto,
    @Query() getSchoolNewsSortingDto: GetSchoolNewsSortingDto,
  ): Promise<PaginationResponseDto<News>> {
    return this.schoolsService.getNewsBySchoolId(
      schoolId,
      paginationDto,
      getSchoolNewsSortingDto,
    );
  }
}
