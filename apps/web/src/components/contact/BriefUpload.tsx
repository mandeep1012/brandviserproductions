'use client';

import { FileText, Loader2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import type { BriefUploadState } from '@/lib/api/use-brief-upload';

interface BriefUploadProps {
  state: BriefUploadState;
  onSelect: (file: File) => void;
  onRemove: () => void;
}

/** "Attach brief (PDF, optional)": choose, upload with progress, remove or retry. */
export function BriefUpload({ state, onSelect, onRemove }: BriefUploadProps) {
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.status === 'error') toast.error(state.message);
  }, [state]);

  return (
    <div className="flex flex-col">
      <Label htmlFor="brief-file" className="mb-2 text-[14px] leading-5 font-normal">
        Attach brief (PDF, optional)
      </Label>
      {state.status === 'idle' || state.status === 'error' ? (
        <>
          <input
            ref={input}
            id="brief-file"
            type="file"
            accept="application/pdf,.pdf"
            aria-describedby="brief-file-hint"
            className="text-[15px] file:mr-3 file:min-h-11 file:cursor-pointer file:rounded-md file:border file:border-ink file:bg-transparent file:px-4 file:font-medium"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) onSelect(file);
              event.target.value = '';
            }}
          />
          <p id="brief-file-hint" className="text-small mt-1.5 text-slate">
            PDF up to 10 MB.
          </p>
          {state.status === 'error' && (
            <p role="alert" className="text-small mt-1 text-destructive">
              {state.message}
            </p>
          )}
        </>
      ) : (
        <div className="flex min-h-12 items-center gap-3 rounded-sm border border-rule bg-card px-3">
          {state.status === 'uploading' ? (
            <Loader2 className="size-4 flex-none animate-spin text-slate" aria-hidden="true" />
          ) : (
            <FileText className="size-4 flex-none text-slate" aria-hidden="true" />
          )}
          <span className="min-w-0 flex-grow truncate text-[15px]">{state.name}</span>
          {state.status === 'uploading' ? (
            <span className="text-small text-slate" aria-live="polite">
              {state.progress}%
            </span>
          ) : (
            <span className="sr-only" role="status">
              Uploaded
            </span>
          )}
          <button
            type="button"
            onClick={onRemove}
            aria-label={state.status === 'uploading' ? 'Cancel upload' : `Remove ${state.name}`}
            className="flex size-11 flex-none items-center justify-center text-slate hover:text-ink"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
