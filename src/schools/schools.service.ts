import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { School } from './schemas/school.schema';
import { Model } from 'mongoose';

@Injectable()
export class SchoolsService {
  constructor(@InjectModel(School.name) private schoolModel: Model<School>) {}

  async create(createSchoolDto: any): Promise<School> {
    const existingSchool = await this.schoolModel.findOne({
      admin: { _id: createSchoolDto.admin },
    });

    if (existingSchool) {
      throw new BadRequestException('School already exists');
    }
    const createdSchool = new this.schoolModel(createSchoolDto);
    return createdSchool.save();
  }

  async findAll(): Promise<School[]> {
    return this.schoolModel.find().exec();
  }
}
