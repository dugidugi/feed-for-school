import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

const validFields = ['createdAt'];

export class GetFollowingSortingDto {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Matches(new RegExp(`^(${validFields.join('|')})\.(asc|desc)$`), {
    message: 'Invalid sorting format',
  })
  sort?: string = 'createdAt.desc';
}
