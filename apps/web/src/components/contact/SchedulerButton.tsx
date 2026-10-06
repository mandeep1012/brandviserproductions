'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useMediaQuery } from '@/hooks/use-media-query';
import { SCHEDULER_URL } from '@/lib/config';
import { ENQUIRY_HREF } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface SchedulerButtonProps {
  label?: string;
  variant?: 'default' | 'outline';
  className?: string;
}

/**
 * Opens the booking calendar (Cal.com / Calendly) in a dialog on desktop and a bottom sheet
 * on phones. The third-party iframe is only created once the visitor asks for it, so it
 * costs nothing on page load. Without NEXT_PUBLIC_SCHEDULER_URL it links to the form instead.
 */
export function SchedulerButton({ label = 'Choose a time', variant = 'outline', className }: SchedulerButtonProps) {
  const [open, setOpen] = useState(false);
  const desktop = useMediaQuery('(min-width: 48rem)', true);

  if (!SCHEDULER_URL) {
    return (
      <Button asChild variant={variant} className={className}>
        <Link href={ENQUIRY_HREF}>Request a call back</Link>
      </Button>
    );
  }

  const frame = open && (
    <iframe
      src={SCHEDULER_URL}
      title="Book a 30-minute call with BRANDVISER"
      className="h-[70dvh] w-full rounded-md border border-rule bg-card"
      loading="lazy"
    />
  );

  return (
    <>
      <Button variant={variant} className={className} onClick={() => setOpen(true)}>
        {label}
      </Button>
      {desktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-3xl border-rule bg-paper sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-h3">Book a 30-minute call</DialogTitle>
              <DialogDescription>Pick a slot that suits you. No obligation.</DialogDescription>
            </DialogHeader>
            {frame}
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" className={cn('max-h-[90dvh] rounded-t-lg border-rule bg-paper')}>
            <SheetHeader>
              <SheetTitle className="text-h3">Book a 30-minute call</SheetTitle>
              <SheetDescription>Pick a slot that suits you. No obligation.</SheetDescription>
            </SheetHeader>
            <div className="px-4 pb-4">{frame}</div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
