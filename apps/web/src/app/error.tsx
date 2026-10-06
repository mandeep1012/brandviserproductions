'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

/** Route error boundary: retry, or reach the team another way. Keeps the header and footer. */
export default function RouteError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="gutter flex flex-col items-start gap-6 py-16 md:py-32">
      <p className="eyebrow text-slate">Something went wrong</p>
      <h1 className="text-h1 max-w-2xl">We couldn&apos;t load this page.</h1>
      <p className="max-w-xl">
        This is usually temporary. Try again in a moment, or contact us directly and we&apos;ll reply within one
        working day.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/contact">Contact us</Link>
        </Button>
      </div>
      {error.digest && <p className="text-small text-slate">Reference: {error.digest}</p>}
    </section>
  );
}
