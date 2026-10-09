import type { CaseStudySummary } from '@brandviserproductions/contracts';
import { cn } from '@/lib/utils';
import { CaseStudyCard } from './CaseStudyCard';

/** Every published case study: two large cards then a compact grid on mobile, three columns on desktop. */
export function CaseStudyGrid({ studies }: { studies: CaseStudySummary[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-6 md:gap-y-8">
      {studies.map((study, index) => (
        <li key={study.id} className={cn(index < 2 && 'max-md:col-span-2')}>
          <CaseStudyCard study={study} compact={index >= 2} />
        </li>
      ))}
    </ul>
  );
}
