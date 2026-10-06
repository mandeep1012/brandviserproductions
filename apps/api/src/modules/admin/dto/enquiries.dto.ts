import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto.js';
import { EnquiryStatus } from '../../../generated/prisma/enums.js';

export class ListEnquiriesQuery extends PaginationDto {
  @IsOptional()
  @IsEnum(EnquiryStatus)
  status?: EnquiryStatus;
}

export class UpdateEnquiryDto {
  @IsEnum(EnquiryStatus)
  status!: EnquiryStatus;
}
