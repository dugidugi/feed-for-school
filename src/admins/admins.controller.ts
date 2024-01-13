import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { Admin } from './schemas/admin.schema';
import { AdminsService } from './admins.service';
import { BasicResponseDto } from '@src/common/dtos/response.dto';

@Controller('admins')
export class AdminsController {
  constructor(private adminsService: AdminsService) {}

  @Post()
  create(
    @Body() createAdminDto: CreateAdminDto,
  ): Promise<BasicResponseDto<Admin>> {
    return this.adminsService.create(createAdminDto);
  }
}
