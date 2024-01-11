import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserFollow } from './schemas/user-follow.schema';
import { News } from 'src/news/schemas/news.schema';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post('/:userId/following/:schoolId')
  followSchool(
    @Param('userId') userId: string,
    @Param('schoolId') schoolId: string,
  ): Promise<UserFollow> {
    return this.usersService.followSchool(userId, schoolId);
  }

  @Get('/:userId/following')
  getFollowing(@Param('userId') userId: string): Promise<UserFollow[]> {
    return this.usersService.getFollowing(userId);
  }

  @Delete('/:userId/following/:schoolId')
  unfollowSchool(
    @Param('userId') userId: string,
    @Param('schoolId') schoolId: string,
  ): Promise<UserFollow> {
    return this.usersService.unfollowSchool(userId, schoolId);
  }
}
