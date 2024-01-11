import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './schemas/news.schema';
// import { BullModule } from '@nestjs/bull';
import { RedisService } from 'src/common/redis.service';
import { UsersModule } from 'src/users/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),

    UsersModule,
  ],
  providers: [NewsService, RedisService],
  controllers: [NewsController],
})
export class NewsModule {}
