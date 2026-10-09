'use client';

import { CircleCheck } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import type { EnquiryCreated } from '@brandviserproductions/contracts';
import { Button } from '@/components/ui/button';

/** Replaces the form after a successful submission: thanks, reference number, calendar link. */
export function EnquirySuccess({ result }: { result: EnquiryCreated }) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus(), []);

  return (
    <div role="status" className="flex flex-col items-start gap-4">
      <CircleCheck className="size-8 text-gold-700" strokeWidth={1.5} aria-hidden="true" />
      <h2 ref={heading} tabIndex={-1} className="text-h2 outline-none">
        Thank you. Your brief is with us.
      </h2>
      <p>We&apos;ll call you within one working day to understand it.</p>
      <div className="gold-edge w-full rounded-md border border-rule bg-paper p-4">
        <p className="eyebrow text-slate">Your reference</p>
        <p className="text-h3 font-mono">{result.reference}</p>
      </div>
      {result.schedulerUrl && (
        <p className="text-small text-slate">Want to skip the wait? Book a 30-minute call now.</p>
      )}
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        {result.schedulerUrl && (
          <Button asChild>
            <a href={result.schedulerUrl} target="_blank" rel="noopener noreferrer">
              Book a call
            </a>
          </Button>
        )}
        <Button asChild variant="outline">
          <Link href="/gallery">See our work</Link>
        </Button>
      </div>
    </div>
  );
}
