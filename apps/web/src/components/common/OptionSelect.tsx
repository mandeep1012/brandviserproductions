'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { describedBy } from './FormField';

interface OptionSelectProps<T extends string> {
  id: string;
  value: T | '';
  onChange: (value: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
  placeholder?: string;
  error?: string;
  'aria-label'?: string;
}

/** shadcn Select wired for forms: full width, placeholder when empty, error state. */
export function OptionSelect<T extends string>({
  id,
  value,
  onChange,
  options,
  placeholder = 'Select',
  error,
  ...rest
}: OptionSelectProps<T>) {
  return (
    <Select value={value || undefined} onValueChange={(v) => onChange(v as T)}>
      <SelectTrigger id={id} className="w-full" aria-label={rest['aria-label']} {...describedBy(id, error)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent position="popper">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
