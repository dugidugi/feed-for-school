import { IsString } from 'class-validator';

export class CreateSchoolDto {
  @IsString()
  name: string;

  @IsString()
  admin: string;

  @IsString()
  address: string;
}
