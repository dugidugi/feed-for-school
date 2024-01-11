import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schemas/news.schema';
import { Model } from 'mongoose';
import { CreateNewsDto } from './dtos/create-news.dto';
import { EditNewsDto } from './dtos/edit-news.dto';
// import { InjectQueue } from '@nestjs/bull';
// import { Queue } from 'bull';
import { RedisService } from 'src/common/redis.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class NewsService {
  constructor(
    @InjectModel(News.name) private newsModel: Model<News>,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const createdNews = await new this.newsModel(createNewsDto).save();

    const createdNewsId = createdNews._id.toString();

    // cache-news:id
    this.redisService.setValue(`news:${createdNewsId}`, createdNews);

    // cache-user:userId:newsfeed (list)
    const schoolId = createdNews.school.toString();
    const followers = await this.usersService.getFollwersBySchoolId(schoolId);
    followers.forEach((followerId) => {
      this.redisService.lpush(`user:${followerId}:newsfeed`, createdNewsId);
    });
    return createdNews;
  }

  async findAll(): Promise<News[]> {
    return this.newsModel.find().exec();
  }

  async deleteById(id: string): Promise<News> {
    console.log(id);
    return this.newsModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, editNewsDto: EditNewsDto): Promise<News> {
    return this.newsModel.findByIdAndUpdate(id, editNewsDto, { new: true });
  }
}
