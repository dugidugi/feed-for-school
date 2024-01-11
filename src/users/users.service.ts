import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserFollow } from './schemas/user-follow.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserFollow.name) private userFollowModel: Model<UserFollow>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async followSchool(userId: string, schoolId: string): Promise<UserFollow> {
    const alreadyFollow = await this.userFollowModel.findOne({
      user: userId,
      school: schoolId,
    });
    if (alreadyFollow) {
      throw new BadRequestException('already following');
    }
    try {
      return this.userFollowModel.create({ school: schoolId, user: userId });
    } catch (e) {
      //TODO
    }
  }

  async getFollowing(userId: string): Promise<UserFollow[]> {
    return this.userFollowModel.find({ user: userId }).exec();
  }

  async unfollowSchool(userId: string, schoolId: string): Promise<UserFollow> {
    return this.userFollowModel.findOneAndDelete({
      user: userId,
      school: schoolId,
    });
  }

  async getFollwersBySchoolId(schoolId: string): Promise<string[]> {
    const userFollows = await this.userFollowModel
      .find({ school: schoolId })
      .exec();
    const userIds = userFollows.map((userFollow) => userFollow.user.toString());

    return userIds;
  }
}
