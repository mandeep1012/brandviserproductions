import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { FaqPage } from '../../../generated/prisma/enums.js';

export class ListFaqsQuery {
  /** Accepts `expertise` or `EXPERTISE`. */
  @Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.toUpperCase() : value))
  @IsEnum(FaqPage)
  page!: FaqPage;
}
