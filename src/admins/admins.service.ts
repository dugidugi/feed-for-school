import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from './schemas/admin.schema';
import { Model } from 'mongoose';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { BasicResponseDto } from 'src/common/dtos/response.dto';

@Injectable()
export class AdminsService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async create(
    createAdminDto: CreateAdminDto,
  ): Promise<BasicResponseDto<Admin>> {
    const createdAdmin = await new this.adminModel(createAdminDto).save();
    return { data: createdAdmin };
  }

  async findAll(): Promise<BasicResponseDto<Admin[]>> {
    const admins = await this.adminModel.find().exec();
    return { data: admins };
  }
}
