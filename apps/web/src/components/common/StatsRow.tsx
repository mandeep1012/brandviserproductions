import type { SiteStats } from '@brandviserproductions/contracts';
import { cn } from '@/lib/utils';

const LABELS: Record<keyof SiteStats, { long: string; short: string }> = {
  citiesCovered: { long: 'Cities covered', short: 'Cities' },
  clientBrands: { long: 'Client brands', short: 'Clients' },
  eventsDelivered: { long: 'Events delivered', short: 'Events' },
  yearsExperience: { long: 'Years of experience', short: 'Years' },
};

interface StatsRowProps {
  stats: SiteStats;
  keys: Array<keyof SiteStats>;
  tone?: 'paper' | 'navy';
  className?: string;
}

/**
 * Headline numbers. Stats BRANDVISER hasn't confirmed yet (null) are left out, and the row
 * disappears entirely when none are set.
 */
export function StatsRow({ stats, keys, tone = 'paper', className }: StatsRowProps) {
  const shown = keys.filter((key) => stats[key] !== null);
  if (shown.length === 0) return null;
  return (
    <dl
      className={cn(
        'grid gap-x-4 gap-y-6',
        shown.length === 4 ? 'grid-cols-2 md:grid-cols-4' : 'grid-cols-3',
        className,
      )}
    >
      {shown.map((key) => (
        <div key={key} className="flex flex-col-reverse gap-1 md:gap-2">
          <dt className={cn('eyebrow', tone === 'navy' ? 'text-navy-muted' : 'text-slate')}>
            <span className="md:hidden">{LABELS[key].short}</span>
            <span className="hidden md:inline">{LABELS[key].long}</span>
          </dt>
          <dd className={cn(tone === 'navy' ? 'text-h1' : 'text-h2 md:text-h1')}>
            {stats[key]!.toLocaleString('en-IN')}+
          </dd>
        </div>
      ))}
    </dl>
  );
}
