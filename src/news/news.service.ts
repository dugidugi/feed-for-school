import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schemas/news.schema';
import { Model } from 'mongoose';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

  async create(createNewsDto: any): Promise<News> {
    const createdNews = new this.newsModel(createNewsDto);
    return createdNews.save();
  }

  async findAll(): Promise<News[]> {
    return this.newsModel.find().exec();
  }
}
