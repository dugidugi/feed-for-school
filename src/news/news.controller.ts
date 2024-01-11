import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { NewsService } from './news.service';
import { CreateNewsDto } from './dtos/create-news.dto';
import { News } from './schemas/news.schema';
import { EditNewsDto } from './dtos/edit-news.dto';

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

  @Delete(':id')
  deleteById(@Param('id') id: string): Promise<News> {
    return this.newsService.deleteById(id);
  }

  @Put(':id')
  updateById(
    @Param('id') id: string,
    @Body() editNewsDto: EditNewsDto,
  ): Promise<News> {
    return this.newsService.updateById(id, editNewsDto);
  }
}
