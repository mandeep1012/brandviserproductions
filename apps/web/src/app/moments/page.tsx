import type { Metadata } from 'next';
import { connection } from 'next/server';
import { CtaBand } from '@/components/common/CtaBand';
import { GoldRule } from '@/components/common/Section';
import { MomentsMosaic } from '@/components/moments/MomentsMosaic';
import { MOMENTS } from '@/content/moments';
import { shuffle } from '@/lib/shuffle';
import { ENQUIRY_HREF } from '@/lib/navigation';

export const metadata: Metadata = {
  title: 'Moments',
  description: 'Photographs from the events, launches and celebrations BRANDVISER has staged.',
};

export default async function MomentsPage() {
  // Rendered per request so every visit gets a fresh order.
  await connection();

  return (
    <>
      <MomentsMosaic photos={shuffle(MOMENTS)}>
        <h1 className="text-h1">
          Moments<span className="text-metal">.</span>
        </h1>
        <GoldRule className="mt-3 w-18 md:mt-4 md:w-30" />
      </MomentsMosaic>

      <CtaBand
        title="Want a night like these?"
        text="Share the brief and we will send a concept."
        href={ENQUIRY_HREF}
        label="Plan an event"
      />
    </>
  );
}
