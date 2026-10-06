import type { TeamMember } from '@brandviserproductions/contracts';
import { EventImage } from '@/components/common/EventImage';

/** Four portraits per row on desktop; a swipeable row on mobile. */
export function TeamGrid({ team }: { team: TeamMember[] }) {
  return (
    <ul
      aria-label="Team"
      className="-mr-4 flex snap-x snap-mandatory gap-3 overflow-x-auto pr-4 pb-2 md:mr-0 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible md:pr-0"
    >
      {team.map((member) => (
        <li key={member.id} className="w-40 flex-none snap-start md:w-auto">
          <EventImage
            src={member.portraitUrl}
            alt={`${member.name}, ${member.role}`}
            label="Portrait"
            sizes="(min-width: 48rem) 25vw, 160px"
            className="aspect-square"
          />
          <p className="mt-3 font-semibold md:mt-4">{member.name}</p>
          <p className="text-small text-slate">{member.role}</p>
        </li>
      ))}
    </ul>
  );
}
