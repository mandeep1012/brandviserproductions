import { describe, expect, it } from 'vitest';
import { withExplicitSslMode } from './connection-string.js';

describe('withExplicitSslMode', () => {
  it('upgrades require to verify-full and keeps other params', () => {
    const out = withExplicitSslMode('postgresql://u:p@ep-x.aws.neon.tech/db?channel_binding=require&sslmode=require');
    const url = new URL(out);
    expect(url.searchParams.get('sslmode')).toBe('verify-full');
    expect(url.searchParams.get('channel_binding')).toBe('require');
    expect(url.password).toBe('p');
  });

  it('leaves URLs without sslmode or with disable/verify-full untouched', () => {
    for (const input of [
      'postgresql://u:p@localhost:5433/db',
      'postgresql://u:p@host/db?sslmode=disable',
      'postgresql://u:p@host/db?sslmode=verify-full',
      'not a url',
    ]) {
      expect(withExplicitSslMode(input)).toBe(input);
    }
  });
});
