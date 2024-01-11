import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserFollow, UserFollowSchema } from './schemas/user-follow.schema';
import { RedisService } from 'src/common/redis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserFollow.name, schema: UserFollowSchema },
    ]),
  ],
  providers: [UsersService, RedisService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
