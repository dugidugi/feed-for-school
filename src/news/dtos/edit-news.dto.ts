import { IsString } from 'class-validator';

export class EditNewsDto {
  @IsString()
  title: string;

  @IsString()
  content: string;
}
