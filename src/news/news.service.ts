import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './schemas/news.schema';
import { Model } from 'mongoose';
import { CreateNewsDto } from './dtos/create-news.dto';
import { EditNewsDto } from './dtos/edit-news.dto';

@Injectable()
export class NewsService {
  constructor(@InjectModel(News.name) private newsModel: Model<News>) {}

  async create(createNewsDto: CreateNewsDto): Promise<News> {
    const createdNews = new this.newsModel(createNewsDto);
    return createdNews.save();
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
