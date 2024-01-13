import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { School } from './schemas/school.schema';
import { Model, SortOrder } from 'mongoose';
import {
  PaginationDto,
  PaginationResponseDto,
} from '@src/common/dtos/pagination.dto';
import { News } from '@src/news/schemas/news.schema';
import { BasicResponseDto } from '@src/common/dtos/response.dto';
import { GetSchoolNewsSortingDto } from './dtos/get-school-news-sorting.dto';

@Injectable()
export class SchoolsService {
  constructor(
    @InjectModel(School.name) private schoolModel: Model<School>,
    @InjectModel(News.name) private newsModel: Model<News>,
  ) {}

  async create(createSchoolDto: any): Promise<BasicResponseDto<School>> {
    const existingAdmin = await this.schoolModel.findOne({
      admin: { _id: createSchoolDto.admin },
    });

    if (existingAdmin) {
      throw new BadRequestException('Admin has a School already');
    }

    const existingSchoolName = await this.schoolModel.findOne({
      name: createSchoolDto.name,
    });

    if (existingSchoolName) {
      throw new BadRequestException('School name already exists');
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
    getSchoolNewsSortingDto: GetSchoolNewsSortingDto,
  ): Promise<PaginationResponseDto<News>> {
    const { page, pageSize } = paginationDto;
    const start = (page - 1) * pageSize;

    const [field, order] = getSchoolNewsSortingDto.sort.split('.');

    try {
      const totalItems = await this.newsModel.countDocuments({
        school: schoolId,
      });
      const totalPages = Math.ceil(totalItems / pageSize);

      const news = await this.newsModel
        .find({ school: schoolId })
        .sort({ [field]: order as SortOrder })
        .skip(start)
        .limit(pageSize)
        .exec();

      return { data: news, totalItems, totalPages };
    } catch (err) {
      throw new InternalServerErrorException(err.message);
    }
  }
}
