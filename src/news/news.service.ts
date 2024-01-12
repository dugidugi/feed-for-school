import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schemas/news.schema';
import { Model } from 'mongoose';
import { CreateNewsDto } from './dtos/create-news.dto';
import { EditNewsDto } from './dtos/edit-news.dto';
import { RedisService } from '@src/redis/redis.service';
import { UserFollow } from '@src/users/schemas/user-follow.schema';
import { BasicResponseDto } from '@src/common/dtos/response.dto';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<News>,
    @InjectModel(UserFollow.name) private userFollowModel: Model<UserFollow>,
    private readonly redisService: RedisService,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<BasicResponseDto<News>> {
    const createdNews = await new this.newsModel(createNewsDto).save();

    const createdNewsId = createdNews._id.toString();

    // cache-news:id
    this.redisService.setValue(`news:${createdNewsId}`, createdNews);

    // cache-user:userId:newsfeed (list)
    const schoolId = createdNews.school.toString();
    const followers = await this.userFollowModel
      .find({ school: schoolId })
      .exec();
    const followerIds = followers.map((follower) => follower.user.toString());

    const pushToNewsfeedPromises = followerIds.map((followerId) =>
      this.redisService.lpush(`user:${followerId}:newsfeed`, createdNewsId),
    );

    Promise.all(pushToNewsfeedPromises);

    return { data: createdNews };
  }

  async findAll(): Promise<BasicResponseDto<News[]>> {
    const news = await this.newsModel.find().exec();
    return { data: news };
  }

  async deleteById(id: string): Promise<BasicResponseDto<News>> {
    const news = await this.newsModel.findByIdAndDelete(id).exec();

    if (!news) {
      throw new NotFoundException(`News with id ${id} not found`);
    }

    this.redisService.deleteKey(`news:${id}`);

    const schoolId = news.school.toString();
    const followers = await this.userFollowModel
      .find({ school: schoolId })
      .exec();
    const followerIds = followers.map((follower) => follower.user.toString());

    const removeFromNewsfeedPromises = followerIds.map((followerId) =>
      this.redisService.lrem(`user:${followerId}:newsfeed`, 0, id),
    );

    Promise.all(removeFromNewsfeedPromises);

    return { data: news };
  }

  async updateById(
    id: string,
    editNewsDto: EditNewsDto,
  ): Promise<BasicResponseDto<News>> {
    const updatedNews = await this.newsModel.findByIdAndUpdate(
      id,
      editNewsDto,
      {
        new: true,
      },
    );
    if (!updatedNews) {
      throw new NotFoundException(`News with id ${id} not found`);
    }

    const updatedNewsId = updatedNews._id.toString();

    this.redisService.setValue(`news:${updatedNewsId}`, updatedNews);

    return { data: updatedNews };
  }

  async findById(id: string): Promise<BasicResponseDto<News>> {
    const cachedNews = await this.redisService.getValue<News>(`news:${id}`);
    if (cachedNews) {
      return { data: cachedNews };
    }

    const news = await this.newsModel.findById(id).exec();
    this.redisService.setValue(`news:${id}`, news);
    return { data: news };
  }
}
