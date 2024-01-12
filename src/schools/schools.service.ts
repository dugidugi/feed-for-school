import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { School } from './schemas/school.schema';
import { Model } from 'mongoose';
import {
  PaginationDto,
  PaginationResponseDto,
} from '@src/common/dtos/pagination.dto';
import { News } from '@src/news/schemas/news.schema';
import { BasicResponseDto } from '@src/common/dtos/response.dto';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<School>,
    @InjectModel(News.name) private newsModel: Model<News>,
  ) {}

  async create(createSchoolDto: any): Promise<BasicResponseDto<School>> {
    const existingSchool = await this.schoolModel.findOne({
      admin: { _id: createSchoolDto.admin },
    });

    if (existingSchool) {
      throw new BadRequestException('School already exists');
    }
    const createdSchool = await new this.schoolModel(createSchoolDto).save();
    return { data: createdSchool };
  }

  async findAll(): Promise<BasicResponseDto<School[]>> {
    const schools = await this.schoolModel.find().exec();
    return { data: schools };
  }

  async getNewsBySchoolId(
    schoolId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<News>> {
    const { page, pageSize } = paginationDto;
    const start = (page - 1) * pageSize;

    const totalItems = await this.newsModel.countDocuments({
      school: schoolId,
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    const news = await this.newsModel
      .find({ school: schoolId })
      .skip(start)
      .limit(pageSize)
      .exec();

    return { data: news, totalItems, totalPages };
  }
}
