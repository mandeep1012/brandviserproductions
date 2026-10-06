import { BadRequestException, ValidationPipe, type ValidationError } from '@nestjs/common';

/** Flattens nested class-validator errors into `{ "field.path": "first message" }`. */
export function fieldErrors(errors: ValidationError[], parent = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const error of errors) {
    const path = parent ? `${parent}.${error.property}` : error.property;
    const first = Object.values(error.constraints ?? {})[0];
    if (first) out[path] = first;
    if (error.children?.length) Object.assign(out, fieldErrors(error.children, path));
  }
  return out;
}

/**
 * Global pipe: strips unknown properties, rejects requests that send them, converts types,
 * and returns `fields` so the web forms can show each message next to its input.
 */
export function createValidationPipe(): ValidationPipe {
  return new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const fields = fieldErrors(errors);
      return new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: Object.values(fields),
        fields,
      });
    },
  });
}
