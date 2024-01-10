import { Body, Controller, Get, Post } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { CreateSchoolDto } from './dtos/create-school.dto';
import { School } from './schemas/school.schema';

@Controller('schools')
export class SchoolsController {
  constructor(private schoolsService: SchoolsService) {}

  @Post()
  create(@Body() createSchoolDto: CreateSchoolDto): Promise<School> {
    return this.schoolsService.create(createSchoolDto);
  }

  @Get()
  findAll(): Promise<School[]> {
    return this.schoolsService.findAll();
  }
}
