import Link from 'next/link';
import type { SiteStats } from '@brandviserproductions/contracts';
import { Eyebrow } from '@/components/common/Eyebrow';
import { StatsRow } from '@/components/common/StatsRow';
import { Button } from '@/components/ui/button';
import { ENQUIRY_HREF } from '@/lib/navigation';
import { HeroMedia } from './HeroMedia';

export function Hero({ stats, imageUrl }: { stats: SiteStats | null; imageUrl: string | null }) {
  return (
    <section className="gutter pt-8 pb-12 md:pt-20 md:pb-20">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
        <div className="flex flex-col justify-center gap-4 lg:col-span-7 lg:gap-6 lg:pr-12">
          <Eyebrow>360° event &amp; brand activation agency</Eyebrow>
          <h1 className="text-display">Brand stories, staged in every city you sell in.</h1>
          <p className="max-w-[520px]">
            Concept, production, on-ground activation and digital amplification from one accountable team.
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
            <Button asChild>
              <Link href={ENQUIRY_HREF}>Plan an event</Link>
            </Button>
            <Button asChild variant="outline" className="hidden sm:inline-flex">
              <Link href="/gallery">See our work</Link>
            </Button>
            <Link href="/gallery" className="flex min-h-11 items-center justify-center sm:hidden">
              See our work →
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5">
          <HeroMedia imageUrl={imageUrl} alt="An event staged by BRANDVISER" />
        </div>
      </div>
      {stats && (
        <StatsRow
          stats={stats}
          keys={['citiesCovered', 'clientBrands', 'yearsExperience']}
          className="mt-8 border-t border-rule pt-4 md:mt-12 md:pt-6"
        />
      )}
    </section>
  );
}
