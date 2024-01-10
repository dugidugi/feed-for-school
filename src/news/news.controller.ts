import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dtos/create-news.dto';
import { News } from './schemas/news.schema';

@Controller('news')
export class NewsController {
  constructor(private newsService: NewsService) {}

  @Post()
  create(@Body() createNewsDto: CreateNewsDto): Promise<News> {
    return this.newsService.create(createNewsDto);
  }

  @Get()
  findAll(): Promise<News[]> {
    return this.newsService.findAll();
  }
}
