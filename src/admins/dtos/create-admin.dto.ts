import { IsEmail, IsString } from 'class-validator';

export class CreateAdminDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;
}
