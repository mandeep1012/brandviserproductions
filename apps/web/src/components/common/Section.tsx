import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'paper' | 'white' | 'navy';

const tones: Record<Tone, string> = {
  paper: '',
  white: 'bg-card border-y border-rule',
  navy: 'bg-navy text-paper',
};

/** Full-width band with the page gutter and the standard vertical rhythm (48px mobile, 96px desktop). */
export function Section({
  tone = 'paper',
  spacing = 'default',
  className,
  ...props
}: ComponentProps<'section'> & { tone?: Tone; spacing?: 'default' | 'compact' | 'none' }) {
  return (
    <section
      className={cn(
        'gutter',
        spacing === 'default' && 'py-12 md:py-24',
        spacing === 'compact' && 'py-8 md:py-16',
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
