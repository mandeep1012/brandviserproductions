import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Uppercase mono label: eyebrows, step numbers, metadata captions. `rule` leads it with a gold line. */
export function Eyebrow({ rule = false, className, ...props }: ComponentProps<'p'> & { rule?: boolean }) {
  return <p className={cn('eyebrow text-eyebrow', rule && 'eyebrow-rule', className)} {...props} />;
}
