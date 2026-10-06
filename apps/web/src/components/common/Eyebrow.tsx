import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Uppercase mono label: eyebrows, step numbers, metadata captions. */
export function Eyebrow({ className, ...props }: ComponentProps<'p'>) {
  return <p className={cn('eyebrow text-slate', className)} {...props} />;
}
