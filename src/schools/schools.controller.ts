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

@Controller('schools')
export class SchoolsController {
  constructor(private schoolsService: SchoolsService) {}

  @Post()
  create(
    @Body() createSchoolDto: CreateSchoolDto,
  ): Promise<BasicResponseDto<School>> {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  findAll(): Promise<BasicResponseDto<School[]>> {
    return this.schoolsService.findAll();
  }

  @Get('/:schoolId/news')
  getNews(
    @Param('schoolId') schoolId: string,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<News>> {
    return this.schoolsService.getNewsBySchoolId(schoolId, paginationDto);
  }
}
