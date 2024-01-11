import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RedisService } from 'src/common/redis.service';
import { News } from 'src/news/schemas/news.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserFollow } from './schemas/user-follow.schema';
import { User } from './schemas/user.schema';
import { NewsService } from 'src/news/news.service';
import {
  PaginationDto,
  PaginationResponseDto,
} from 'src/common/dtos/pagination.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserFollow.name) private userFollowModel: Model<UserFollow>,
    private readonly redisService: RedisService,
    private readonly newsService: NewsService,
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

    const news = await Promise.all(
      newsIds.map((newsId) => this.newsService.findById(newsId)),
    );
    const totalItems = await this.redisService.llen(`user:${userId}:newsfeed`);
    const totalPages = Math.ceil(totalItems / pageSize);

    return { data: news, totalPages, totalItems };
  }
}
