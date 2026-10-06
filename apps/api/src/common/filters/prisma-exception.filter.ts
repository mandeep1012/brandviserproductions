import { ArgumentsHost, Catch, HttpStatus, type ExceptionFilter } from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../../generated/prisma/client.js';

/**
 * Maps the Prisma errors an admin write can trigger onto HTTP responses instead of 500s:
 * unique violations (P2002) → 409, missing rows (P2025) → 404, bad foreign keys (P2003) → 400.
 */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const [statusCode, error, message] = describe(exception);
    response.status(statusCode).json({ statusCode, error, message });
  }
}

function describe(exception: Prisma.PrismaClientKnownRequestError): [number, string, string] {
  switch (exception.code) {
    case 'P2002':
      return [HttpStatus.CONFLICT, 'Conflict', 'A record with this unique value already exists'];
    case 'P2025':
      return [HttpStatus.NOT_FOUND, 'Not Found', 'Record not found'];
    case 'P2003':
      return [HttpStatus.BAD_REQUEST, 'Bad Request', 'A referenced record does not exist'];
    default:
      return [HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error', 'Database error'];
  }
}
