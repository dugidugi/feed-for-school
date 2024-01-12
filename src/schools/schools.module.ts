import { Module } from '@nestjs/common';
import { SchoolsService } from './schools.service';
import { SchoolsController } from './schools.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { School, SchoolSchema } from './schemas/school.schema';
import { News, NewsSchema } from '@src/news/schemas/news.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: School.name, schema: SchoolSchema }]),
    MongooseModule.forFeature([{ name: News.name, schema: NewsSchema }]),
  ],
  providers: [SchoolsService],
  controllers: [SchoolsController],
})
export class SchoolsModule {}
