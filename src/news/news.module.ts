import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { News, NewsSchema } from './schemas/news.schema';
import { RedisService } from '@src/redis/redis.service';
import {
  UserFollow,
  UserFollowSchema,
} from '@src/users/schemas/user-follow.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: News.name, schema: NewsSchema },
      { name: UserFollow.name, schema: UserFollowSchema },
    ]),
  ],
  providers: [NewsService, RedisService],
  controllers: [NewsController],
  exports: [NewsService],
})
export class NewsModule {}
