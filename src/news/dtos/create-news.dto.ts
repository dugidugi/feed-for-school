import { IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  admin: string;

  @IsString()
  school: string;
}
