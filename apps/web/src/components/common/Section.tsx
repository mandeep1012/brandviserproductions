import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'paper' | 'white' | 'midnight' | 'navy';

const tones: Record<Tone, string> = {
  paper: '',
  white: 'bg-card border-y border-rule',
  midnight: 'surface-dark bg-midnight',
  navy: 'surface-dark bg-navy',
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

/** The metallic hairline between a dark band and its neighbours. */
export function GoldRule({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn('gold-rule', className)} />;
}
