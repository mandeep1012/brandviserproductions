import { NotFoundException } from '@nestjs/common';
import type { Paginated } from '@brandviserproductions/contracts';
import type { PaginationDto } from '../dto/pagination.dto.js';

/** Stable display ordering shared by the content tables (id breaks ties). */
export const displayOrder = (): [{ sortOrder: 'asc' }, { id: 'asc' }] => [{ sortOrder: 'asc' }, { id: 'asc' }];

export function pageWindow({ page, limit }: PaginationDto): { skip: number; take: number } {
  return { skip: (page - 1) * limit, take: limit };
}

export function toPage<T>(items: T[], total: number, { page, limit }: PaginationDto): Paginated<T> {
  return { items, total, page, limit, pageCount: Math.max(1, Math.ceil(total / limit)) };
}

/** Narrows `T | null` to `T`, throwing a consistent 404 otherwise. */
export function orNotFound<T>(value: T | null, resource: string, key: string): T {
  if (value === null) throw new NotFoundException(`${resource} "${key}" was not found`);
  return value;
}
