import { Transform } from 'class-transformer';
import { IsOptional, IsPositive, Max } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsPositive()
  page?: number = 1;

  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  @IsPositive()
  @Max(100)
  pageSize?: number = 10;
}

export class PaginationResponseDto<T> {
  data?: T[];

  @IsPositive()
  totalPages: number;

  @IsPositive()
  totalItems: number;
}
