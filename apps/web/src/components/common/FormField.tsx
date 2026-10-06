import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export const errorId = (id: string) => `${id}-error`;

/** Props a control needs so screen readers announce its error. */
export function describedBy(id: string, error?: string) {
  return { 'aria-invalid': error ? true : undefined, 'aria-describedby': error ? errorId(id) : undefined } as const;
}

interface FormFieldProps {
  id: string;
  label: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

/** Label above, control, then the field's error message (linked by aria-describedby). */
export function FormField({ id, label, error, className, children }: FormFieldProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      <Label htmlFor={id} className="mb-2 text-[14px] leading-5 font-normal text-ink">
        {label}
      </Label>
      {children}
      {error && (
        <p id={errorId(id)} className="text-small mt-1.5 text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

/** Off-screen honeypot. People never see or reach it; bots that fill it are discarded. */
export function Honeypot({ register }: { register: () => object }) {
  return (
    <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
      <label>
        Website
        <input type="text" tabIndex={-1} autoComplete="off" {...register()} />
      </label>
    </div>
  );
}
