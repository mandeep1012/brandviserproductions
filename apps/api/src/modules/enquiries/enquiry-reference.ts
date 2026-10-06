/** Human reference shown on the success screen and in the email: BV-2026-0042. */
export function formatReference(sequence: number, createdAt: Date): string {
  return `BV-${createdAt.getUTCFullYear()}-${String(sequence).padStart(4, '0')}`;
}

/**
 * A plausible reference for honeypot hits, so bots see the normal success response and
 * nothing is stored.
 */
export function decoyReference(now = new Date()): string {
  return formatReference(1000 + Math.floor(Math.random() * 9000), now);
}
