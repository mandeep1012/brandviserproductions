import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { ToBoolean } from '../../../common/decorators/to-boolean.decorator.js';

export class ListTestimonialsQuery {
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(24)
  limit: number = 6;
}
