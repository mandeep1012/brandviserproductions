import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Length, Matches, Max, Min } from 'class-validator';
import type { CaseStudyQuery } from '@brandviserproductions/contracts';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';
import { ToBoolean } from '../../../common/decorators/to-boolean.decorator.js';
import { EventType } from '../../../generated/prisma/enums.js';

const upper = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.toUpperCase() : value);
const trimmed = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

/** GET /case-studies filters. Every filter is optional and they combine with AND. */
export class ListCaseStudiesQuery extends PaginationDto implements CaseStudyQuery {
  @IsOptional()
  @Transform(upper)
  @IsEnum(EventType)
  type?: EventType;

  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  @Length(1, 80)
  service?: string;

  @IsOptional()
  @Transform(trimmed)
  @IsString()
  @Length(1, 80)
  city?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(2000)
  @Max(2100)
  year?: number;

  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  featured?: boolean;
}
