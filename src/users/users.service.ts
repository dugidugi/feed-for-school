import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { RedisService } from '@src/redis/redis.service';
import { News } from '@src/news/schemas/news.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserFollow } from './schemas/user-follow.schema';
import { User } from './schemas/user.schema';
import { NewsService } from '@src/news/news.service';
import {
  PaginationDto,
  PaginationResponseDto,
} from 'src/common/dtos/pagination.dto';
import { BasicResponseDto } from 'src/common/dtos/response.dto';
import { GetFollowingSortingDto } from './dtos/get-following-sorting.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserFollow.name) private userFollowModel: Model<UserFollow>,
    private readonly redisService: RedisService,
    private readonly newsService: NewsService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<BasicResponseDto<User>> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new BadRequestException('이미 존재하는 email입니다.');
    }
    const createdUser = await new this.userModel(createUserDto).save();
    return { data: createdUser };
  }

  async findAll(): Promise<BasicResponseDto<User[]>> {
    const users = await this.userModel.find().exec();
    return { data: users };
  }

  async followSchool(
    userId: string,
    schoolId: string,
  ): Promise<BasicResponseDto<UserFollow>> {
    const alreadyFollow = await this.userFollowModel.findOne({
      user: userId,
      school: schoolId,
    });
    if (alreadyFollow) {
      throw new BadRequestException('already following');
    }
    try {
      const userFollow = await this.userFollowModel.create({
        school: schoolId,
        user: userId,
      });
      return { data: userFollow };
    } catch (e) {
      //TODO
    }
  }

  async getFollowing(
    userId: string,
    paginationDto: PaginationDto,
    getFollowingSortingDto: GetFollowingSortingDto,
  ): Promise<PaginationResponseDto<UserFollow>> {
    const { page, pageSize } = paginationDto;
    const start = (page - 1) * pageSize;

    const totalItems = await this.userFollowModel.countDocuments({
      user: userId,
    });

    const totalPages = Math.ceil(totalItems / pageSize);

    const [field, order] = getFollowingSortingDto.sort.split('.');

    const userFollows = await this.userFollowModel
      .find({ user: userId })
      .sort({ [field]: order as SortOrder })
      .skip(start)
      .limit(pageSize)
      .exec();

    return { data: userFollows, totalItems, totalPages };
  }

  async unfollowSchool(
    userId: string,
    schoolId: string,
  ): Promise<BasicResponseDto<UserFollow>> {
    return this.userFollowModel.findOneAndDelete({
      user: userId,
      school: schoolId,
    });
  }

  async getUserNewsFeed(
    userId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginationResponseDto<News>> {
    const { page, pageSize } = paginationDto;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    const newsIds = await this.redisService.lrange(
      `user:${userId}:newsfeed`,
      start,
      end,
    );

    const newsPromises: Promise<News>[] = newsIds.map((newsId) =>
      this.newsService.findById(newsId).then((news) => news.data),
    );

    const news = await Promise.all(newsPromises);

    const totalItems = await this.redisService.llen(`user:${userId}:newsfeed`);
    const totalPages = Math.ceil(totalItems / pageSize);

    return { data: news, totalPages, totalItems };
  }
}
