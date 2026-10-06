import { BadRequestException, Injectable, type PipeTransform } from '@nestjs/common';

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Rejects malformed slugs before they reach the database. */
@Injectable()
export class ParseSlugPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (value.length > 120 || !SLUG_PATTERN.test(value)) {
      throw new BadRequestException(`"${value.slice(0, 40)}" is not a valid slug`);
    }
    return value;
  }
}
