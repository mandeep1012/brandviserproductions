'use client';

import { upload } from '@vercel/blob/client';
import { useCallback, useRef, useState } from 'react';
import { briefUploadUrl } from './client';

export const MAX_BRIEF_BYTES = 10 * 1024 * 1024;

export type BriefUploadState =
  | { status: 'idle' }
  | { status: 'uploading'; name: string; progress: number }
  | { status: 'done'; name: string; url: string }
  | { status: 'error'; message: string };

/** Checks type and size before any network call, mirroring the API's token constraints. */
export function checkBrief(file: File): string | null {
  if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return 'Attach a PDF file.';
  if (file.size > MAX_BRIEF_BYTES) return 'The PDF must be 10 MB or smaller.';
  return null;
}

/** Keeps letters, digits and a few separators so the Blob pathname passes the API's check. */
const safeName = (name: string) => name.replace(/\.pdf$/i, '').replace(/[^\w .()-]+/g, '-').slice(0, 120) || 'brief';

/**
 * Uploads a brief straight from the browser to private Vercel Blob storage. The API only
 * issues the short-lived upload token, so the file never hits the 4.5 MB function body limit.
 */
export function useBriefUpload() {
  const [state, setState] = useState<BriefUploadState>({ status: 'idle' });
  const abort = useRef<AbortController | null>(null);

  const start = useCallback(async (file: File) => {
    const problem = checkBrief(file);
    if (problem) {
      setState({ status: 'error', message: problem });
      return;
    }
    abort.current?.abort();
    const controller = new AbortController();
    abort.current = controller;
    setState({ status: 'uploading', name: file.name, progress: 0 });
    try {
      const blob = await upload(`briefs/${safeName(file.name)}.pdf`, file, {
        access: 'private',
        handleUploadUrl: briefUploadUrl,
        contentType: 'application/pdf',
        abortSignal: controller.signal,
        onUploadProgress: ({ percentage }) =>
          setState({ status: 'uploading', name: file.name, progress: Math.round(percentage) }),
      });
      setState({ status: 'done', name: file.name, url: blob.url });
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error('[brief upload]', error);
      setState({ status: 'error', message: 'The upload failed. Try again, or send the brief by email instead.' });
    }
  }, []);

  const reset = useCallback(() => {
    abort.current?.abort();
    setState({ status: 'idle' });
  }, []);

  return { state, start, reset };
}
