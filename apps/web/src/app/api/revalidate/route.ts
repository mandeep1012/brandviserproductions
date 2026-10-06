import { timingSafeEqual } from 'node:crypto';
import { revalidateTag } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';

const TAGS = new Set(['site', 'services', 'process', 'case-studies', 'testimonials', 'team', 'faqs']);

function authorized(header: string | null): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || !header?.startsWith('Bearer ')) return false;
  const given = Buffer.from(header.slice('Bearer '.length));
  const expected = Buffer.from(secret);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * POST /api/revalidate { "tags": ["case-studies"] }, called by the API after admin writes.
 * Expires the tagged fetches immediately so the next request renders fresh content.
 */
export async function POST(request: NextRequest) {
  if (!authorized(request.headers.get('authorization'))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as { tags?: unknown } | null;
  const tags = Array.isArray(body?.tags) ? body.tags.filter((t): t is string => typeof t === 'string' && TAGS.has(t)) : [];
  if (tags.length === 0) return NextResponse.json({ error: 'No known tags' }, { status: 400 });
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: tags, at: new Date().toISOString() });
}
