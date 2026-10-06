/** sslmodes that pg currently upgrades to `verify-full`, logging a deprecation warning each time. */
const IMPLICIT_VERIFY_FULL = new Set(['prefer', 'require', 'verify-ca']);

/**
 * Spells out the TLS mode pg already applies. Neon's integration injects `sslmode=require`, which
 * pg treats as `verify-full` but warns about on every cold start (it changes meaning in pg 9).
 * Neon serves publicly trusted certificates, so `verify-full` is the intended behavior.
 * URLs without an sslmode (local Docker) are returned unchanged.
 */
export function withExplicitSslMode(connectionString: string): string {
  let url: URL;
  try {
    url = new URL(connectionString);
  } catch {
    return connectionString;
  }
  const mode = url.searchParams.get('sslmode');
  if (!mode || !IMPLICIT_VERIFY_FULL.has(mode)) return connectionString;
  url.searchParams.set('sslmode', 'verify-full');
  return url.toString();
}
