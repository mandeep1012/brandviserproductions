import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, Max, Min, validateSync } from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

/**
 * Typed, validated view of `process.env`. The app refuses to boot if this fails.
 * Email, Blob, admin and revalidation settings are optional so local development boots
 * without them; the features that need them degrade (log instead of email, 401, 503).
 */
export class Env {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsOptional()
  @IsString()
  CORS_ORIGINS?: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 4000;

  @IsOptional()
  @IsString()
  RESEND_API_KEY?: string;

  @IsOptional()
  @IsString()
  ENQUIRY_NOTIFY_TO?: string;

  @IsOptional()
  @IsString()
  ENQUIRY_FROM?: string;

  @IsOptional()
  @IsString()
  BLOB_READ_WRITE_TOKEN?: string;

  @IsOptional()
  @IsString()
  ADMIN_API_TOKEN?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  WEB_REVALIDATE_URL?: string;

  @IsOptional()
  @IsString()
  REVALIDATE_SECRET?: string;

  @IsOptional()
  @IsUrl()
  SCHEDULER_URL?: string;
}

/** Empty strings in .env files mean "unset", not "invalid". */
function dropEmpty(raw: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(raw).filter(([, value]) => value !== ''));
}

export function validateEnv(raw: Record<string, unknown>): Env {
  const env = plainToInstance(Env, dropEmpty(raw), { enableImplicitConversion: true, exposeDefaultValues: true });
  const errors = validateSync(env, { skipMissingProperties: false, whitelist: false });
  if (errors.length > 0) {
    const details = errors.map((e) => `${e.property}: ${Object.values(e.constraints ?? {}).join(', ')}`);
    throw new Error(`Invalid environment configuration:\n  ${details.join('\n  ')}`);
  }
  return env;
}

