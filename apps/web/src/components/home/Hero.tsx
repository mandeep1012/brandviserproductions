import Link from 'next/link';
import type { SiteStats } from '@brandviserproductions/contracts';
import { Eyebrow } from '@/components/common/Eyebrow';
import { GoldRule } from '@/components/common/Section';
import { StatsRow } from '@/components/common/StatsRow';
import { Button } from '@/components/ui/button';
import { ENQUIRY_HREF } from '@/lib/navigation';
import { HeroMedia } from './HeroMedia';

export function Hero({ stats, imageUrl }: { stats: SiteStats | null; imageUrl: string | null }) {
  return (
    <>
      <section className="surface-dark gutter bg-midnight pt-9 pb-8 md:pt-22 md:pb-12">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-6">
          <div className="flex flex-col justify-center gap-4 lg:col-span-7 lg:gap-6 lg:pr-12">
            <Eyebrow rule>360° event &amp; brand activation agency</Eyebrow>
            <h1 className="text-display">
              Designing experiences with purpose, presence and <em className="text-metal">precision.</em>
            </h1>
            <div className="flex max-w-[520px] flex-col gap-3 text-slate">
              <p>
                BRANDVISER Productions is a leading event and experiential marketing company, creating impactful
                experiences across MICE, conferences, exhibitions, and brand activations. With a strong presence across
                400+ cities in India and 15+ countries internationally, we bring brands closer to their audiences.
              </p>
              <p>
                Since 2015, our expertise has empowered businesses to connect, engage, and grow through seamless event
                execution and innovative marketing solutions. From concept to execution, we transform ideas into
                memorable experiences that inspire engagement and deliver measurable impact.
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
              <Button asChild variant="gold">
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
          <div className="relative lg:col-span-5">
            <HeroMedia imageUrl={imageUrl} alt="An event staged by BRANDVISER" />
            <GoldRule className="absolute right-0 -bottom-3 left-6 hidden lg:-right-6 lg:block" />
          </div>
        </div>
        {stats && (
          <StatsRow
            stats={stats}
            keys={['citiesCovered', 'clientBrands', 'eventsDelivered', 'countriesCovered']}
            metal
            className="mt-8 border-t border-rule pt-4 md:mt-18 md:pt-8"
          />
        )}
      </section>
      <GoldRule />
    </>
  );
}
